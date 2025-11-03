import { groupSubAreaDates, groupParkFeatureDates, getFeatureDates } from "./parkDatesHelper"

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

const preProcessParkFeatures = (parkFeatures) => {
  const processedParkFeatures = parkFeatures
    .filter(feature => feature.isActive)
    .map(feature => {
      const facilityType = feature.parkFeatureType?.facilityType || {}
      const campingType = feature.parkFeatureType?.campingType || {}

      let processed = {
        ...feature,
        typeCode: facilityType.facilityCode || campingType.campingTypeCode || "",
        typeIcon: facilityType.icon || campingType.icon || ""
      }

      processed = groupParkFeatureDates(processed)

      // Format date ranges using the property names from groupParkFeatureDates
      processed.gateDates = getFeatureDates(processed.gateDates)
      processed.tier1Dates = getFeatureDates(processed.tier1Dates)
      processed.tier2Dates = getFeatureDates(processed.tier2Dates)
      processed.winterFeeDates = getFeatureDates(processed.winterFeeDates)
      processed.dayUsePassDates = getFeatureDates(processed.dayUsePassDates)
      processed.operationDates = getFeatureDates(processed.operationDates)
      processed.reservationDates = getFeatureDates(processed.reservationDates)
      processed.backcountryDates = getFeatureDates(processed.backcountryDates)
      processed.firstComeFirstServedDates = getFeatureDates(processed.firstComeFirstServedDates)
      processed.serviceAndFeeDates = getFeatureDates(processed.serviceAndFeeDates)

      // Add a placeholder if no dates are available for the current year
      if (
        // processed.serviceAndFeeDates.length === 0 &&
        processed.reservationDates.length === 0 &&
        // processed.winterFeeDates.length === 0 &&
        processed.operationDates.length === 0
      ) {
        processed.serviceAndFeeDates.push("Dates unavailable")
      }
      
      return processed
    })

  return processedParkFeatures
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

const groupParkFeaturesByType = (parkFeatures) => {
  const result = {}
  const features = preProcessParkFeatures(parkFeatures);
  for (const feature of features) {
    const campingTypeCode = feature.typeCode;
    if (!result[campingTypeCode]) {
      result[campingTypeCode] = { parkFeatures: [] };
    }
    result[campingTypeCode].parkFeatures.push(feature);
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

export {
  preProcessSubAreas,
  preProcessParkFeatures,
  combineCampingTypes,
  combineFacilities,
  groupSubAreasByType,
  groupParkFeaturesByType
}
