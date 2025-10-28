import axios from "axios"
import qs from "qs"
import { groupSubAreaDates, getFeatureDates } from "./parkDatesHelper"

const preProcessSubAreas = (subAreas) => {
  const processedSubAreas = subAreas
    .filter(subArea => subArea.isActive)
    .map(subArea => {
      const facilityType = subArea.parkSubAreaType?.facilityType || {}
      const campingType = subArea.parkSubAreaType?.campingType || {}

      let processed = {
        ...subArea,
        typeCode: facilityType.facilityCode || campingType.campingTypeCode || "",
        typeIcon: facilityType.icon || campingType.icon || ""
      }

      processed = groupSubAreaDates(processed)

      // Format date ranges
      processed.operationDates = getFeatureDates(processed.operationDates)
      processed.serviceDates = getFeatureDates(processed.serviceDates)
      processed.resDates = getFeatureDates(processed.resDates)
      processed.offSeasonDates = getFeatureDates(processed.offSeasonDates)

      // Add a placeholder if no dates are available for the current year
      if (
        processed.serviceDates.length === 0 &&
        processed.resDates.length === 0 &&
        processed.offSeasonDates.length === 0
      ) {
        processed.serviceDates.push("Dates unavailable")
      }
      return processed
    })

  return processedSubAreas
}

// Group subAreas by typeCode
const groupSubAreasByType = (subAreasData) => {
  const result = {}
  const subAreas = preProcessSubAreas(subAreasData);
  for (const subArea of subAreas) {
    const campingTypeCode = subArea.typeCode;
    if (!result[campingTypeCode]) {
      result[campingTypeCode] = { subAreas: [] };
    }
    result[campingTypeCode].subAreas.push(subArea);
  }
  return result;
}

const combineCampingTypes = (campings, campingTypes, subAreas) => {
  let arr = [];
  let obj = subAreas;

  // filter the campings to include only active
  const parkCampingTypes = campings.filter(
    (camping) => camping.isActive
  )
  // add the parkCampingTypes to the common object
  for (const parkCampingType of parkCampingTypes) {
    const campingTypeCode = parkCampingType.campingType?.campingTypeCode;
    if (!obj[campingTypeCode]) {
      obj[campingTypeCode] = { subAreas: [] };
    }
    obj[campingTypeCode] = { ...parkCampingType, ...obj[campingTypeCode] };
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

const combineFacilities = (facilities, facilityTypes, subAreas) => {
  let arr = [];
  let obj = subAreas;

  // filter the facilities to include only active
  const parkFacilities = facilities.filter(
    (facility) => facility.isActive
  )
  // add the parkFacilities to the common object
  for (const parkFacility of parkFacilities) {
    const facilityCode = parkFacility.facilityType?.facilityCode;
    if (!obj[facilityCode]) {
      obj[facilityCode] = { subAreas: [] };
    }
    obj[facilityCode] = { ...parkFacility, ...obj[facilityCode] };
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
// load all subareas (optionally filtered by starting letter)
const loadAllSubAreas = async (apiBaseUrl, startingLetter = null) => {
  const filters = {
    isActive: true,
  }

  // Add starting letter filter, if provided
  if (startingLetter) {
    filters.protectedArea = {
      protectedAreaName: {
        $startsWith: startingLetter
      }
    }
  }

  const params = qs.stringify({
    filters,
    fields: [
      "isOpen",
      "isCleanAirSite",
      "parkSubArea",
      "isActive",
      "hasBackcountryReservations",
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
  const response = await axios.get(`${apiBaseUrl}/park-operation-sub-areas?${params}`);
  return response.data;
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
  loadSubAreas,
  groupSubAreasByType
}
