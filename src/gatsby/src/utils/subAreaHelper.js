import axios from "axios"
import qs from "qs"
import { processDateRanges, groupSubAreaDates } from "./parkDatesHelper"


const preProcessSubAreas = (subAreas) => {
  const fmt = "MMMM D"  // date format for overall operating dates
  const yr = "year-round" // lowercase for overall operating dates
  for (let idx in subAreas) {
    let subArea = subAreas[idx]

    if (subArea.isActive) {

      const facilityType = subArea.parkSubAreaType?.facilityType || {}
      const campingType = subArea.parkSubAreaType?.campingType || {}
      subArea.typeCode = facilityType.facilityCode || campingType.campingTypeCode || ""
      subArea = groupSubAreaDates(subArea);

      // get distinct date ranges sorted chronologically
      subArea.operationDates = processDateRanges(subArea.operationDates, fmt, yr, " to ", false)
      subArea.serviceDates = processDateRanges(subArea.serviceDates, fmt, yr, " to ", false)
      subArea.resDates = processDateRanges(subArea.resDates, fmt, yr, " to ", false)
      subArea.offSeasonDates = processDateRanges(subArea.offSeasonDates, fmt, yr, " to ", false)

      // add a placeholder if no dates are available for the current year
      if (subArea.serviceDates.length === 0
        && subArea.resDates.length === 0
        && subArea.offSeasonDates.length === 0) {
        subArea.serviceDates.push("Dates unavailable")
      }
    }
  }

  // add the subareas to a common object
  let result = {};
  for (const subArea of subAreas) {
    const campingTypeCode = subArea.typeCode;
    if (!result[campingTypeCode]) {
      result[campingTypeCode] = { subAreas: [] };
    }
    result[campingTypeCode].subAreas.push(subArea);
  }
  return result;
}

const combineCampingTypes = (parkCampingTypes, campingTypes, subAreas) => {
  let arr = [];
  let obj = subAreas;

  // add the parkCampingTypes to the common object
  for (const parkCampingType of parkCampingTypes) {
    if (parkCampingType.isActive && parkCampingType.isCampingOpen) {
      const campingTypeCode = parkCampingType.campingType?.campingTypeCode;
      if (!obj[campingTypeCode]) {
        obj[campingTypeCode] = { subAreas: [] };
      }
      obj[campingTypeCode] = { ...parkCampingType, ...obj[campingTypeCode] };
    }
  }

  // add the campingTypes to the common object and convert it to an array
  for (const campingTypeCode in obj) {
    const parkCampingType = obj[campingTypeCode];
    parkCampingType.campingType = campingTypes.find(ct => ct.campingTypeCode === campingTypeCode);
    // only include camping, not facilities
    if (parkCampingType.campingType) {
      // the camping type should be active, but we will include it anyway if it has subareas
      if (parkCampingType.campingType.isActive || parkCampingType.subAreas.length > 0) {
        arr.push(parkCampingType);
      }
    }
  }

  return arr.sort((a, b) => a.campingType.campingTypeName.localeCompare(b.campingType.campingTypeName))
}

const combineFacilities = (parkFacilities, facilityTypes, subAreas) => {
  let arr = [];
  let obj = subAreas;

  // add the parkFacilities to the common object
  for (const parkFacility of parkFacilities) {
    if (parkFacility.isActive && parkFacility.isFacilityOpen) { 
      const facilityCode = parkFacility.facilityType?.facilityCode;
      if (!obj[facilityCode]) {
        obj[facilityCode] = { subAreas: [] };
      }
      obj[facilityCode] = { ...parkFacility, ...obj[facilityCode] };
    }
  }

  // add the facilityTypes to the common object and convert it to an array
  for (const facilityCode in obj) {
    const parkFacility = obj[facilityCode];
    parkFacility.facilityType = facilityTypes.find(f => f.facilityCode === facilityCode);
    // only include facilities, not camping
    if (parkFacility.facilityType) {
      // the facility type should be active, but we will include it anyway if it has subareas
      if (parkFacility.facilityType.isActive || parkFacility.subAreas.length > 0) {
        arr.push(parkFacility);
      }
    }
  }

  return arr.sort((a, b) => a.facilityType.facilityName.localeCompare(b.facilityType.facilityName))
}
// load all subareas
const loadAllSubAreas = (apiBaseUrl) => {
  const params = qs.stringify({
    filters: {
      isActive: true,
    },
    fields: [
      "isOpen",
      "isCleanAirSite",
      "parkSubArea",
      "isActive",
      "closureAffectsAccessStatus"
    ],
    populate: {
      protectedArea: {
        fields: ["orcs"]
      },
      parkSubAreaType: {
        fields: [
          "closureAffectsAccessStatus",
        ], 
        populate : {
          campingType: {fields: ["icon"]}, 
          facilityType: {fields: ["icon"]}
        }
      },
      parkFeatureDates: {
        fields: [
          "operatingYear",
          "isActive",
          "startDate",
          "endDate",
          "dateType",
        ]
      },
      parkOperationSubAreaDates: {
        fields: [
          "operatingYear",
          "isActive",
          "openDate",
          "closeDate",
          "serviceStartDate",
          "serviceEndDate",
          "reservationStartDate",
          "reservationEndDate",
          "offSeasonStartDate",
          "offSeasonEndDate",
        ]
      },
    },
    pagination: {
      limit: 1000,
    }
  }, {
    encodeValuesOnly: true,
  })
  return axios.get(`${apiBaseUrl}/park-operation-sub-areas?${params}`)
}
// load subareas by protected area
const loadSubAreas = (apiBaseUrl, orcs) => {
  const params = qs.stringify({
    filters: {
      protectedArea: {
        orcs: {
          $eq: orcs
        }
      }
    },
    populate: {
      parkSubAreaType: {
        fields: [
          "subAreaType",
          "subAreaTypeCode",
          "closureAffectsAccessStatus",
        ], 
        populate : {
          campingType: {fields: ["campingTypeCode"]}, 
          facilityType: {fields: ["facilityCode"]}
        }
      },
      parkFeatureDates: {
        fields: [
          "operatingYear",
          "isActive",
          "startDate",
          "endDate",
          "dateType",
        ]
      },
      parkOperationSubAreaDates: {
        fields: [
          "operatingYear",
          "isActive",
          "openDate",
          "closeDate",
          "serviceStartDate",
          "serviceEndDate",
          "reservationStartDate",
          "reservationEndDate",
          "offSeasonStartDate",
          "offSeasonEndDate",
        ]
      },
    },
    pagination: {
      limit: 100,
    }
  }, {
    encodeValuesOnly: true,
  })
  return axios.get(`${apiBaseUrl}/park-operation-sub-areas?${params}`)
}

export {
  preProcessSubAreas,
  combineCampingTypes,
  combineFacilities,
  loadAllSubAreas,
  loadSubAreas
}