const { getLogger } = require("../../shared/logging");
const { readQueue, removeFromQueue } = require("../../shared/taskQueue");
const { noCommandLineArgs } = require("../../shared/commandLine");
const { cmsAxios } = require("../../shared/axiosConfig");
const { getEntityIds, getDateTypeMap } = require("../utils/helper");

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
    for (const item of jsonData) {
      let protectedAreaId, parkAreaId, parkFeatureId;
      try {
        ({ protectedAreaId, parkAreaId, parkFeatureId } = await getEntityIds(item));
      } catch (error) {
        logger.error(`dootPublish() failed while retrieving entity IDs: ${error}`);
        return;
      }
      // check the park-gates collection to see if there is an existing record
      // matching the protectedAreaId, parkAreaId, or parkFeatureId
      const gateParams = {
        filters: {
          protectedArea: protectedAreaId ? { id: protectedAreaId } : undefined,
          parkArea: parkAreaId ? { id: parkAreaId } : undefined,
          parkFeature: parkFeatureId ? { id: parkFeatureId } : undefined,
        },
        fields: ["id"],
      };
      let gateResponse;
      try {
        gateResponse = await cmsAxios.get("/api/park-gates", {
          params: gateParams,
        });
      } catch (error) {
        logger.error(`dootPublish() failed while retrieving park-gates: ${error}`);
        return;
      }

      if (gateResponse.data.data.length > 0) {
        // update the existing park-gates record
        const gateInfo = gateResponse.data.data[0];
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
          await cmsAxios.put(`/api/park-gates/${gateInfo.id}`, {
            data: updateData,
          });
        } catch (error) {
          logger.error(`dootPublish() failed while updating park-gates: ${error}`);
          return;
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
        } catch (error) {
          logger.error(`dootPublish() failed while creating park-gates: ${error}`);
          return;
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
          return;
        }
        for (const dateRange of datesToDelete.data.data) {
          try {
            await cmsAxios.delete(`/api/park-dates/${dateRange.id}`);
          } catch (error) {
            logger.error(`dootPublish() failed while deleting park-dates: ${error}`);
            return;
          }
        }

        // create a map of the park-date-types collection to get the id for each
        // dateTypeId
        let dateTypeMap;
        try {
          dateTypeMap = await getDateTypeMap();
        } catch (error) {
          logger.error(`dootPublish() failed while retrieving dateTypeMap: ${error}`);
          return;
        }

        // create new date ranges
        if (item.dateRanges && item.dateRanges.length > 0) {
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
            try {
              await cmsAxios.post("/api/park-dates", {
                data: createDateRangeData,
              });
            } catch (error) {
              logger.error(`dootPublish() failed while creating park-dates: ${error}`);
              return;
            }
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
        return;
      }
    }
  }
};
