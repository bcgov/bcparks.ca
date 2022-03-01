"use strict";
const fs = require("fs");
const permission = require("./loadPermissions");

const updateOperationsFromJson = async ({modelName, jsonFile, objectName, idName, isSeedMode = true, allowUpdates = false }) => {
  // general purpose function used to upload
  // parkOperations, parkOperationSubarea,
  // parkOperationSubAreaDate, and parkSubAreaType
  // pattern is the same to load + update
  // differences in models, e.g. relations, handled in case statements

  try {
  
    let createCount = 0;
    let updateCount = 0;
    let missingCount = 0;
   
    const modelService = strapi.services[modelName];

    // get existing records
    const currentData = await modelService.find({ _limit: -1 }); // need to set limit or only 100 will load
    const currentCount = currentData.length; // num existing records
    console.log("Current record count:" + currentData.length)

    var jsonData = fs.readFileSync(jsonFile, "utf8"); // load json string
    const j = JSON.parse(jsonData); // convert from json string to obj 
    const dataSeed = j[objectName]; // get target array from obj
    const seedCount = dataSeed.length; // num records

    if (isSeedMode && (currentCount > 0)) {
      // stop here, seed mode requires an empty dataSet
      console.log("Seed mode, but data set is not empty " + modelName)
    } else {
    
      for (const dIdx in dataSeed) { // iterate over records in json
        const data = dataSeed[dIdx];
        const idVal = data[idName]; // select id in order to know if update or crreate     
        try {
          // get existing record
          let existingRecord;
          switch (modelName) {
            case "park-operation":
              // shoud only be one record per protected area
              existingRecord = currentData.find(d => (d.protectedArea) && (d.protectedArea.orcs === data.orcs))
              break;
            case "park-operation-sub-area-date":
              // specific call to get existingRecord
              // both subarea and year
              existingRecord = currentData.find(d => (d.parkOperationSubArea?.parkSubAreaId === data.parkSubAreaId) && (d.operatingYear === data.operatingYear)); // get existing record
              break;
            default:
              existingRecord = currentData.find(d => d[idName] === idVal);
              break;
          }
          const doesExist = (existingRecord !== undefined);

          if (!idVal) {
            // id needed
            console.log("Id for " + modelName + " is missing in json: " + idName)
            missingCount++;
          } else {

            const keys = Object.keys(data); // replace empty strings with nulls
            for (let i = 0; i < keys.length; i++) {
              if (data[keys[i]] === "") data[keys[i]] = null;
            }
            
            let isMissingRelation = false;

            switch (modelName) { // add relations, specific to model
              case "park-operation-sub-area":
                // make relation between sub-area and type
                if (data.parkSubAreaTypeId) {
                  const subAreaTypeService = strapi.services["park-operation-sub-area-type"];
                  const subAreaType = await subAreaTypeService.findOne({ subAreaTypeId: data.parkSubAreaTypeId });
                  data.parkSubAreaType = subAreaType ? subAreaType.id : null;
                } else {
                  data.parkSubAreaType = null;
                }
                // relate subarea to protected areas
                if (data.orcs) {
                  const protectedAreaService = strapi.services["protected-area"];
                  const protectedArea = await protectedAreaService.findOne({ orcs: data.orcs })
                  data.protectedArea = protectedArea ? protectedArea.id : null;
                } else {
                  data.protectedArea = null;
                }
                // relate subarea to facility
                if (data.parkFacilityId) {
                  const parkFacilityService = strapi.services["park-facility"];
                  const parkFacility = await parkFacilityService.findOne({ id: data.parkFacilityId })
                  data.parkFacility = parkFacility ? parkFacility.id : null;
                } else {
                  data.parkFacility = null;
                }
                isMissingRelation = ((data.parkSubAreaType === null) || (data.protectedArea === null)) // park facility not needed
                break;
              case "park-operation":
                // relate operation to protected areas
                if (data.orcs) {
                  const paService = strapi.services["protected-area"];
                  const pa = await paService.findOne({ orcs: data.orcs })
                  data.protectedArea = pa ? pa.id : null;
                } else {
                  data.protectedArea = null;
                }

                isMissingRelation = (data.protectedArea === null)
                break;
              case "park-operation-sub-area-date":
                // relate date to subarea
                if (data.parkSubAreaId) {
                  const subAreaService = strapi.services["park-operation-sub-area"];
                  const subArea = await subAreaService.findOne({ parkSubAreaId: data.parkSubAreaId })
                  data.parkOperationSubArea = subArea ? subArea.id : null;
                } else {
                  data.parkOperationSubArea = null;
                }
                isMissingRelation = (data.parkOperationSubArea === null)
                break;
              default:
                // no default relation for other models
                break;
            }
            if (isMissingRelation) {
              console.log("Missing relation, not creating or updating for: " + idVal)
              missingCount++;
            } else {
              if (doesExist) {
                if (allowUpdates) { // update existing record
                  const u = await modelService.update({ id: existingRecord.id }, data);
                  updateCount++;
                }
              } else { // create a new record
                const c = await modelService.create(data);
                createCount++;
              }
            }
          }

        } catch (e) {
          console.log("!! Json import failed for " + modelName + " data with " + idName + ":" + idVal);
          console.log(e);
        }
      };
      console.log(modelName + " - Updates: " + updateCount + ", Creates: " + createCount + ", Missing: " + missingCount);
    }
    return(true)

  } catch (error) {
    console.log(`error loading ${modelName}...`);
    console.log(error);
    return(false)
  }
}

const loadParkOperations = async ({ isSeedMode = true, allowUpdates = false }) => {
  
  const a = await updateOperationsFromJson({
    modelName: "park-operation",
    jsonFile: "./data/park-operation.json",
    objectName: "parkOperation",
    idName: "orcs",
    isSeedMode: isSeedMode,
    allowUpdates: allowUpdates,
  });
  return(a)
};

const loadParkOperationSubAreaTypes = async ({ isSeedMode = true, allowUpdates = false }) => {
  const a = await updateOperationsFromJson({
    modelName: "park-operation-sub-area-type",
    jsonFile: "./data/park-operation-sub-area-types.json",
    objectName: "parkOperationSubAreaTypes",
    idName: "subAreaTypeId",
    isSeedMode: isSeedMode,
    allowUpdates: allowUpdates,
  });
  return(a)
};

const loadParkOperationSubAreas = async ({ isSeedMode = true, allowUpdates = false }) => {
  const a = await updateOperationsFromJson({
    modelName: "park-operation-sub-area",
    jsonFile: "./data/park-operation-sub-areas.json",
    objectName: "parkOperationSubAreas",
    idName: "parkSubAreaId",
    isSeedMode: isSeedMode,
    allowUpdates: allowUpdates,
  });
  return(a)
};

const loadParkOperationSubAreaDates = async ({ isSeedMode = true, allowUpdates = false }) => {
    const a = await updateOperationsFromJson({
    modelName: "park-operation-sub-area-date",
    jsonFile: "./data/park-operation-sub-area-dates.json",
    objectName: "parkOperationSubAreaDates",
    idName: "parkSubAreaId", // exception to pattern - at most one record per subArea per year
    isSeedMode: isSeedMode,
    allowUpdates: allowUpdates,
  });
}

const loadData = async ({ isSeedMode = true, allowUpdates = false }) => { 
  const config = { isSeedMode: isSeedMode, allowUpdates: allowUpdates }
  try {
    const p1 = await loadParkOperationSubAreaTypes(config)
    const p2 = await loadParkOperationSubAreas(config)
    const p3 = await loadParkOperationSubAreaDates(config)
    const p4 = await loadParkOperations(config)
  } catch (err) {
    console.log("Error in loading operations data")
    return (false);
  }
}

module.exports = {
  loadData
};