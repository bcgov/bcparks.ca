"use strict";
const fs = require("fs");
const permission = require("./loadPermissions");

const getExistingParkOperation = (currentData, dataToFind) => {
  // shoud only be one record per protected area
  const rec = currentData.find(
    (d) => d.protectedArea && d.protectedArea.orcs === dataToFind.orcs
  );
  return rec;
};

const getExistingSubAreaDate = (currentData, dataToFind) => {
  // both subarea and year
  const rec = currentData.find(
    (d) =>
      d.parkOperationSubArea?.parkSubAreaId === dataToFind.parkSubAreaId &&
      d.operatingYear === dataToFind.operatingYear
  );
  return rec;
};

const updateSubAreaRelations = async (data) => {
  // make relation between sub-area and type
  if (data.parkSubAreaTypeId) {
    const subAreaTypeService = strapi.services["park-operation-sub-area-type"];
    const subAreaType = await subAreaTypeService.findOne({
      subAreaTypeId: data.parkSubAreaTypeId,
    });
    data.parkSubAreaType = subAreaType ? subAreaType.id : null;
  } else {
    data.parkSubAreaType = null;
  }
  // relate subarea to protected areas
  if (data.orcs) {
    const protectedAreaService = strapi.services["protected-area"];
    const protectedArea = await protectedAreaService.findOne({
      orcs: data.orcs,
    });
    data.protectedArea = protectedArea ? protectedArea.id : null;
  } else {
    data.protectedArea = null;
  }
  // relate subarea to facility type
  // note that the key is facilityNumber, not something like facilityTypeId
  if (data.facilityNumber) {
    const facilityTypeService = strapi.services["facility-type"];
    const facilityType = await facilityTypeService.findOne({
      facilityNumber: data.facilityNumber,
    });
    data.facilityType = facilityType ? facilityType.id : null;
  } else {
    data.facilityType = null;
  }
  const isMissingRelation =
    data.parkSubAreaType === null || data.protectedArea === null; // facility type not needed
  return !isMissingRelation;
};

const updateParkOperationsRelations = async (data) => {
  // relate operation to protected areas
  if (data.orcs) {
    const paService = strapi.services["protected-area"];
    const pa = await paService.findOne({ orcs: data.orcs });
    data.protectedArea = pa ? pa.id : null;
  } else {
    data.protectedArea = null;
  }

  const isMissingRelation = data.protectedArea === null;
  return !isMissingRelation;
};

const updateSubAreaDateRelations = async (data) => {
  // relate date to subarea
  if (data.parkSubAreaId) {
    const subAreaService = strapi.services["park-operation-sub-area"];
    const subArea = await subAreaService.findOne({
      parkSubAreaId: data.parkSubAreaId,
    });
    data.parkOperationSubArea = subArea ? subArea.id : null;
  } else {
    data.parkOperationSubArea = null;
  }
  const isMissingRelation = data.parkOperationSubArea === null;
  return !isMissingRelation;
};

const updateOperationsFromJson = async ({
  modelName,
  jsonFile,
  objectName,
  idName,
  isSeedMode = true,
  allowUpdates = false,
}) => {
  // general purpose function used to upload
  // parkOperations, parkOperationSubarea,
  // parkOperationSubAreaDate, and parkSubAreaType
  // pattern is the same to load + update
  // differences in models, e.g. relations, handled in case statements

  try {
    console.log("-");
    console.log("Loading records for model: " + modelName);
    let createCount = 0;
    let updateCount = 0;
    let missingCount = 0;

    const modelService = strapi.services[modelName];

    // get existing records
    const currentData = await modelService.find({ _limit: -1 }); // need to set limit or only 100 will load
    const currentCount = currentData.length; // num existing records
    console.log("Current record count:" + currentData.length);

    var jsonData = fs.readFileSync(jsonFile, "utf8"); // load json string
    const j = JSON.parse(jsonData); // convert from json string to obj
    const dataSeed = j[objectName]; // get target array from obj
    const seedCount = dataSeed.length; // num records

    if (isSeedMode && currentCount > 0) {
      // stop here, seed mode requires an empty dataSet
      console.log("Seed mode, but data set is not empty " + modelName);
    } else {
      for (const dIdx in dataSeed) {
        // iterate over records in json
        const data = dataSeed[dIdx];
        const idVal = data[idName]; // select id in order to know if update or crreate
        try {
          // get existing record
          let existingRecord;

          switch (modelName) {
            case "park-operation":
              existingRecord = getExistingParkOperation(currentData, data);
              break;
            case "park-operation-sub-area-date":
              existingRecord = getExistingSubAreaDate(currentData, data);
              break;
            default:
              existingRecord = currentData.find((d) => d[idName] === idVal);
              break;
          }

          const doesExist = existingRecord !== undefined;

          if (!idVal) {
            // id needed
            console.error(
              "Id for " + modelName + " is missing in json: " + idName
            );
            missingCount++;
          } else {
            const keys = Object.keys(data); // replace empty strings with nulls
            for (let i = 0; i < keys.length; i++) {
              if (data[keys[i]] === "") data[keys[i]] = null;
            }

            let relationsMade = false;

            switch (
              modelName // add relations, specific to model
            ) {
              case "park-operation-sub-area":
                relationsMade = await updateSubAreaRelations(data);
                break;
              case "park-operation":
                relationsMade = await updateParkOperationsRelations(data);
                break;
              case "park-operation-sub-area-date":
                relationsMade = await updateSubAreaDateRelations(data);
                break;
              default:
                // no default relation for other models
                relationsMade = true;
                break;
            }
            if (!relationsMade) {
              console.error(
                "Missing relation, not creating or updating for: " + idVal
              );
              missingCount++;
            } else {
              if (doesExist) {
                if (allowUpdates) {
                  // update existing record
                  const u = await modelService.update(
                    { id: existingRecord.id },
                    data
                  );
                  updateCount++;
                }
              } else {
                // create a new record
                const c = await modelService.create(data);
                createCount++;
              }
            }
          }
        } catch (e) {
          console.error(
            "!! Json import failed for " +
              modelName +
              " data with " +
              idName +
              ":" +
              idVal
          );
          console.error(e);
        }
      }
      console.log(
        "Updates: " +
          updateCount +
          ", Creates: " +
          createCount +
          ", Missing: " +
          missingCount
      );
    }
    return true;
  } catch (error) {
    console.error(`error loading ${modelName}...`);
    console.error(error);
    return false;
  }
};

const loadParkOperations = async ({
  isSeedMode = true,
  allowUpdates = false,
}) => {
  const a = await updateOperationsFromJson({
    modelName: "park-operation",
    jsonFile: "./data/park-operation.json",
    objectName: "parkOperation",
    idName: "orcs",
    isSeedMode: isSeedMode,
    allowUpdates: allowUpdates,
  });
  return a;
};

const loadParkOperationSubAreaTypes = async ({
  isSeedMode = true,
  allowUpdates = false,
}) => {
  const a = await updateOperationsFromJson({
    modelName: "park-operation-sub-area-type",
    jsonFile: "./data/park-operation-sub-area-types.json",
    objectName: "parkOperationSubAreaTypes",
    idName: "subAreaTypeId",
    isSeedMode: isSeedMode,
    allowUpdates: allowUpdates,
  });
  return a;
};

const loadParkOperationSubAreas = async ({
  isSeedMode = true,
  allowUpdates = false,
}) => {
  const a = await updateOperationsFromJson({
    modelName: "park-operation-sub-area",
    jsonFile: "./data/park-operation-sub-areas.json",
    objectName: "parkOperationSubAreas",
    idName: "parkSubAreaId",
    isSeedMode: isSeedMode,
    allowUpdates: allowUpdates,
  });
  return a;
};

const loadParkOperationSubAreaDates = async ({
  isSeedMode = true,
  allowUpdates = false,
}) => {
  const a = await updateOperationsFromJson({
    modelName: "park-operation-sub-area-date",
    jsonFile: "./data/park-operation-sub-area-dates.json",
    objectName: "parkOperationSubAreaDates",
    idName: "parkSubAreaId", // exception to pattern - at most one record per subArea per year
    isSeedMode: isSeedMode,
    allowUpdates: allowUpdates,
  });
};

const loadData = async ({ isSeedMode = true, allowUpdates = false }) => {
  const config = { isSeedMode: isSeedMode, allowUpdates: allowUpdates };
  try {
    const p1 = await loadParkOperationSubAreaTypes(config);
    const p2 = await loadParkOperationSubAreas(config);
    const p3 = await loadParkOperationSubAreaDates(config);
    const p4 = await loadParkOperations(config);
  } catch (err) {
    console.error("Error in loading operations data");
    return false;
  }
};

module.exports = {
  loadData,
};
