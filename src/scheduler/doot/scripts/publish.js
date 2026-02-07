const { getLogger } = require("../../shared/logging");
const { readQueue, removeFromQueue } = require("../../shared/taskQueue");
const { noCommandLineArgs } = require("../../shared/commandLine");
const { cmsAxios } = require("../../shared/axiosConfig");
const { getEntityIds, getDateTypeMap, getParkGateIds } = require("../utils/helper");
const { dootSplitMessage } = require("./splitMessage");

/**
 * Publishes DOOT date and gate info to Strapi
 */
exports.dootPublish = async function () {
  let queue;
  const logger = getLogger();

  // When we create/update date ranges from DOOT data, we will only delete existing
  // date ranges of these types to avoid removing date ranges managed manually in Strapi.
  const DOOT_MANAGED_DATE_TYPE_IDS = [1, 2, 3, 4, 6, 7, 8]; // Gate, Tier 1, Tier 2, Winter fee, Operation, Reservation, Backcountry registration

  // get items from the queue with the action 'doot publish'
  try {
    queue = await readQueue("doot publish");
  } catch (error) {
    logger.error(`dootPublish() failed while retrieving 'doot publish' tasks: ${error}`);
    return;
  }

  for (const message of queue) {
    let jsonData = message.attributes?.jsonData;
    let errorProcessingMessage = false;

    // loop through each item in the jsonData array
    if (!Array.isArray(jsonData)) {
      logger.error(`dootPublish() expected jsonData to be an array but got: ${typeof jsonData}`);
      continue;
    }

    // check if the array contains data from multiple entities. If so, then split
    // it up into separate messages\
    if (jsonData.length > 1) {
      logger.info(
        `Splitting dootpublish task with ${jsonData.length} items into separate messages`
      );
      await dootSplitMessage(message);
      continue;
    }

    for (const item of jsonData) {
      let protectedAreaId, parkAreaId, parkFeatureId, relationName;
      try {
        ({ protectedAreaId, parkAreaId, parkFeatureId, relationName } = await getEntityIds(item));
      } catch (error) {
        logger.error(`dootPublish() failed while retrieving entity IDs: ${error}`);
        errorProcessingMessage = true;
        break;
      }
      const parkGateIds = await getParkGateIds(protectedAreaId, parkAreaId, parkFeatureId);
      if (item.gateInfo) {
        // check the park-gates collection to see if there is an existing record
        // matching the protectedAreaId, parkAreaId, or parkFeatureId
        if (parkGateIds.length > 0) {
          // update the existing park-gates record
          const updateData = {
            hasGate: item.gateInfo.hasGate,
            gateNote: item.gateInfo.gateNote,
            gateOpenHoursStartTime: item.gateInfo.gateOpenHoursStartTime,
            gateOpenHoursEndTime: item.gateInfo.gateOpenHoursEndTime,
            gateOpen24Hours: item.gateInfo.gateOpen24Hours,
            gateOpensAtDawn: item.gateInfo.gateOpensAtDawn,
            gateClosesAtDusk: item.gateInfo.gateClosesAtDusk,
          };
          try {
            await cmsAxios.put(`/api/park-gates/${parkGateIds[0]}`, { data: updateData });
            logger.info(`Updated park-gates record for ${relationName}`);
          } catch (error) {
            logger.error(`dootPublish() failed while updating park-gates: ${error}`);
            errorProcessingMessage = true;
            break;
          }
        } else {
          // create a new park-gates record
          const createData = {
            hasGate: item.gateInfo.hasGate,
            gateNote: item.gateInfo.gateNote,
            gateOpenHoursStartTime: item.gateInfo.gateOpenHoursStartTime,
            gateOpenHoursEndTime: item.gateInfo.gateOpenHoursEndTime,
            gateOpen24Hours: item.gateInfo.gateOpen24Hours,
            gateOpensAtDawn: item.gateInfo.gateOpensAtDawn,
            gateClosesAtDusk: item.gateInfo.gateClosesAtDusk,
            protectedArea: protectedAreaId ? protectedAreaId : undefined,
            parkArea: parkAreaId ? parkAreaId : undefined,
            parkFeature: parkFeatureId ? parkFeatureId : undefined,
          };
          try {
            await cmsAxios.post("/api/park-gates", { data: createData });
            logger.info(`Created new park-gates record for ${relationName}`);
          } catch (error) {
            logger.error(`dootPublish() failed while creating park-gates: ${error}`);
            errorProcessingMessage = true;
            break;
          }
        }
      } else {
        // If gateInfo is not provided in the input, update any existing park-gates records
        // for this entity to indicate no gate info
        if (parkGateIds.length > 0) {
          try {
            await cmsAxios.put(`/api/park-gates/${parkGateIds[0]}`, {
              data: {
                hasGate: false,
                gateNote: "",
                gateOpenHoursStartTime: null,
                gateOpenHoursEndTime: null,
                gateOpen24Hours: null,
                gateOpensAtDawn: null,
                gateClosesAtDusk: null,
              },
            });

            logger.info(
              `Updated existing park-gates record(s) for ${relationName} to indicate no gate info`
            );
          } catch (error) {
            logger.error(`dootPublish() failed while updating park-gates: ${error}`);
            errorProcessingMessage = true;
            break;
          }
        }
      }

      // if there is more than one parkGateId for the entity, delete the extras
      if (parkGateIds.length > 1) {
        for (let i = 1; i < parkGateIds.length; i++) {
          try {
            await cmsAxios.delete(`/api/park-gates/${parkGateIds[i]}`);
            logger.info(
              `Deleted duplicate park-gates record ID ${parkGateIds[i]} for ${relationName}`
            );
          } catch (error) {
            logger.error(`dootPublish() failed while deleting duplicate park-gates: ${error}`);
            errorProcessingMessage = true;
            break;
          }
        }
      }

      // delete any existing date ranges for the same operating year
      if (item.operatingYear && (protectedAreaId || parkFeatureId)) {
        const deleteParams = {
          filters: {
            protectedArea: protectedAreaId ? { id: protectedAreaId } : undefined,
            parkFeature: parkFeatureId ? { id: parkFeatureId } : undefined,
            operatingYear: item.operatingYear,
          },
          fields: ["id"],
          populate: {
            parkDateType: {
              fields: ["dateTypeId"],
            },
          },
        };

        let datesToDelete;
        try {
          datesToDelete = await cmsAxios.get("/api/park-dates", { params: deleteParams });
        } catch (error) {
          logger.error(`dootPublish() failed while retrieving park-dates: ${error}`);
          errorProcessingMessage = true;
          break;
        }
        try {
          for (const dateRange of datesToDelete.data.data) {
            if (DOOT_MANAGED_DATE_TYPE_IDS.includes(dateRange.parkDateType.dateTypeId)) {
              await cmsAxios.delete(`/api/park-dates/${dateRange.id}`);
            }
          }
        } catch (error) {
          logger.error(`dootPublish() failed while deleting park-dates: ${error}`);
          errorProcessingMessage = true;
          break;
        }

        // create a map of the park-date-types collection to get the id for each
        // dateTypeId
        let dateTypeMap;
        try {
          dateTypeMap = await getDateTypeMap();
        } catch (error) {
          logger.error(`dootPublish() failed while retrieving dateTypeMap: ${error}`);
          errorProcessingMessage = true;
          break;
        }

        // create new date ranges
        if (item.dateRanges && item.dateRanges.length > 0) {
          try {
            // validate all the dateTypeIds first
            for (const dootDateRange of item.dateRanges) {
              if (!dateTypeMap.has(dootDateRange.dateTypeId)) {
                throw new Error(
                  `Invalid dateTypeId ${dootDateRange.dateTypeId} in DOOT data for ${relationName}`
                );
              }
            }
            // create the date ranges
            for (const dootDateRange of item.dateRanges) {
              const createDateRangeData = {
                startDate: dootDateRange.startDate,
                endDate: dootDateRange.endDate,
                isActive: dootDateRange.isActive,
                adminNote: dootDateRange.adminNote,
                parkDateType: dateTypeMap.get(dootDateRange.dateTypeId),
                isDateAnnual: dootDateRange.isDateAnnual,
                operatingYear: item.operatingYear,
                protectedArea: protectedAreaId ? protectedAreaId : undefined,
                parkFeature: parkFeatureId ? parkFeatureId : undefined,
              };
              await cmsAxios.post("/api/park-dates", { data: createDateRangeData });
            }
            // After creating all date ranges, log a summary message
            const count = item.dateRanges.length;
            logger.info(`Created ${count} park-dates records for ${relationName}`);
          } catch (error) {
            logger.error(`dootPublish() failed while creating park-dates: ${error}`);
            errorProcessingMessage = true;
            break;
          }
        }
      }
    }

    // if this script is being called from server.js then we need to remove the
    // message from the queue, otherwise manage.js will leave it in the queue
    // for further testing
    if (!errorProcessingMessage && noCommandLineArgs()) {
      try {
        await removeFromQueue([message.id]);
      } catch (error) {
        logger.error(`dootPublish() failed while removing message from queue: ${error}`);
        continue;
      }
    }
  }
};
