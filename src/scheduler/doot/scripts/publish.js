const { getLogger } = require("../../shared/logging");
const { readQueue, removeFromQueue } = require("../../shared/taskQueue");
const { noCommandLineArgs } = require("../../shared/commandLine");
const { cmsAxios } = require("../../shared/axiosConfig");
const { getEntityIds, getDateTypeMap, getParkGateIds } = require("../utils/helper");

/**
 * Publishes DOOT date and gate info to Strapi
 */
exports.dootPublish = async function () {
  let queue;
  const logger = getLogger();

  // get items from the queue with the action 'doot publish'
  try {
    queue = await readQueue("doot publish");
  } catch (error) {
    logger.error(`dootPublish() failed while retrieving 'doot publish' tasks: ${error}`);
    return;
  }

  for (const message of queue) {
    let jsonData = message.attributes?.jsonData;

    // loop through each item in the jsonData array
    if (!Array.isArray(jsonData)) {
      logger.error(`dootPublish() expected jsonData to be an array but got: ${typeof jsonData}`);
      continue;
    }
    for (const item of jsonData) {
      let protectedAreaId, parkAreaId, parkFeatureId, relationName;
      try {
        ({ protectedAreaId, parkAreaId, parkFeatureId, relationName } = await getEntityIds(item));
      } catch (error) {
        logger.error(`dootPublish() failed while retrieving entity IDs: ${error}`);
        break;
      }
      if (item.gateInfo) {
        // check the park-gates collection to see if there is an existing record
        // matching the protectedAreaId, parkAreaId, or parkFeatureId
        const parkGateIds = await getParkGateIds(protectedAreaId, parkAreaId, parkFeatureId);
        if (parkGateIds.length > 0) {
          // update the existing park-gates record
          const updateData = {
            hasGate: item.gateInfo.hasGate,
            gateNote: item.gateInfo.gateNote,
            gateOpenTime: item.gateInfo.gateOpenTime,
            gateCloseTime: item.gateInfo.gateCloseTime,
            gateOpen24Hours: item.gateInfo.gateOpen24Hours,
            gateOpensAtDawn: item.gateInfo.gateOpensAtDawn,
            gateClosesAtDusk: item.gateInfo.gateClosesAtDusk,
          };
          try {
            await cmsAxios.put(`/api/park-gates/${parkGateIds[0]}`, {
              data: updateData,
            });
            logger.info(`Updated park-gates record for ${relationName}`);
          } catch (error) {
            logger.error(`dootPublish() failed while updating park-gates: ${error}`);
            break;
          }
        } else {
          // create a new park-gates record
          const createData = {
            hasGate: item.gateInfo.hasGate,
            gateNote: item.gateInfo.gateNote,
            gateOpenTime: item.gateInfo.gateOpenTime,
            gateCloseTime: item.gateInfo.gateCloseTime,
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
            break;
          }
        }
      } else {
        // delete any existing park-gates record if gateInfo is undefined
        const parkGateIds = await getParkGateIds(protectedAreaId, parkAreaId, parkFeatureId);
        if (parkGateIds.length > 0) {
          try {
            for (const gateId of parkGateIds) {
              await cmsAxios.delete(`/api/park-gates/${gateId}`);
            }
            logger.info(`Deleted existing park-gates record(s) for ${relationName}`);
          } catch (error) {
            logger.error(`dootPublish() failed while deleting park-gates: ${error}`);
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
        };

        let datesToDelete;
        try {
          datesToDelete = await cmsAxios.get("/api/park-dates", {
            params: deleteParams,
          });
        } catch (error) {
          logger.error(`dootPublish() failed while retrieving park-dates: ${error}`);
          break;
        }
        try {
          for (const dateRange of datesToDelete.data.data) {
            await cmsAxios.delete(`/api/park-dates/${dateRange.id}`);
          }
        } catch (error) {
          logger.error(`dootPublish() failed while deleting park-dates: ${error}`);
          break;
        }

        // create a map of the park-date-types collection to get the id for each
        // dateTypeId
        let dateTypeMap;
        try {
          dateTypeMap = await getDateTypeMap();
        } catch (error) {
          logger.error(`dootPublish() failed while retrieving dateTypeMap: ${error}`);
          break;
        }

        // create new date ranges
        if (item.dateRanges && item.dateRanges.length > 0) {
          try {
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

              const response = await cmsAxios.post("/api/park-dates", {
                data: createDateRangeData,
              });
            }
            // After creating all date ranges, log a summary message
            const count = item.dateRanges.length;
            logger.info(`Created ${count} park-dates records for ${relationName}`);
          } catch (error) {
            logger.error(`dootPublish() failed while creating park-dates: ${error}`);
            break;
          }
        }
      }
    }

    // if this script is being called from server.js then we need to remove the
    // message from the queue, otherwise manage.js will leave it in the queue
    // for further testing
    if (noCommandLineArgs()) {
      try {
        await removeFromQueue([message.id]);
      } catch (error) {
        logger.error(`dootPublish() failed while removing message from queue: ${error}`);
        continue;
      }
    }
  }
};
