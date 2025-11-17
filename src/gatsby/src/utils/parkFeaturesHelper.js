import { groupParkFeatureDates, getFeatureDates } from "./parkDatesHelper"

/**
 * Processes raw park features data by grouping dates, formatting date ranges, and adding computed properties
 * @param {Array} parkFeatures - Array of raw park feature objects from the API
 * @returns {Array} Array of processed park features with formatted dates and additional properties
 * @throws {Error} Throws an error if parkFeatures is not an array
 * @example
 * const rawFeatures = [{ isActive: true, parkFeatureName: "Campground A", ... }]
 * const processedFeatures = preProcessParkFeatures(rawFeatures)
 * // Returns features with formatted dates: gateDates, operationDates, etc.
 */
const preProcessParkFeatures = parkFeatures => {
  const processedParkFeatures = parkFeatures
    .filter(feature => feature.isActive)
    .map(feature => {
      const facilityType = feature.parkFeatureType?.facilityType || {}
      const campingType = feature.parkFeatureType?.campingType || {}

      let processed = {
        ...feature,
        displayName: getDisplayName(feature),
        displayGate: getDisplayGate(feature),
        typeCode:
          facilityType.facilityCode || campingType.campingTypeCode || "",
        typeIcon: facilityType.icon || campingType.icon || "",
      }

      processed = groupParkFeatureDates(processed)

      // Format date ranges
      processed.gateDates = getFeatureDates(processed.gateDates)
      processed.winterFeeDates = getFeatureDates(processed.winterFeeDates)
      processed.operationDates = getFeatureDates(processed.operationDates)
      processed.reservationDates = getFeatureDates(processed.reservationDates)
      processed.backcountryDates = getFeatureDates(processed.backcountryDates)

      // Commented out dates are not currently used
      // Comment them back in if needed in the future

      // processed.tier1Dates = getFeatureDates(processed.tier1Dates)
      // processed.tier2Dates = getFeatureDates(processed.tier2Dates)
      // processed.dayUsePassDates = getFeatureDates(processed.dayUsePassDates)
      // processed.firstComeFirstServedDates = getFeatureDates(
      //   processed.firstComeFirstServedDates
      // )
      // processed.serviceAndFeeDates = getFeatureDates(
      //   processed.serviceAndFeeDates
      // )

      // Add a placeholder if no dates are available for the current year
      if (
        processed.operationDates.length === 0 &&
        processed.reservationDates.length === 0 &&
        processed.winterFeeDates.length === 0
      ) {
        processed.operationDates.push("Dates unavailable")
      }

      return processed
    })

  return processedParkFeatures
}

/**
 * Groups park features by their type code (facilityCode or campingTypeCode)
 * @param {Array} parkFeatures - Array of raw park feature objects
 * @returns {Object} Object with typeCode as keys and objects containing parkFeatures array as values
 * @throws {Error} Throws an error if parkFeatures is not an array
 * @example
 * const features = [{ typeCode: "RV", parkFeatureName: "RV Site A" }]
 * const grouped = groupParkFeaturesByType(features)
 * // Returns: { "RV": { parkFeatures: [{ typeCode: "RV", ... }] } }
 */
const groupParkFeaturesByType = parkFeatures => {
  const result = {}
  const features = preProcessParkFeatures(parkFeatures)

  for (const feature of features) {
    const typeCode = feature.typeCode
    if (!result[typeCode]) {
      result[typeCode] = { parkFeatures: [] }
    }
    result[typeCode].parkFeatures.push(feature)
  }
  return result
}

/**
 * Combines park camping data with camping types and park features into a unified structure
 * @param {Array} campings - Array of park camping objects from the API
 * @param {Array} campingTypes - Array of camping type definitions
 * @param {Object} parkFeatures - Object of park features grouped by type code
 * @returns {Array} Array of combined camping objects sorted by camping type name
 * @throws {Error} Throws an error if any parameter is not the expected type
 * @example
 * const campings = [{ isActive: true, campingType: { campingTypeCode: "RV" } }]
 * const campingTypes = [{ campingTypeCode: "RV", campingTypeName: "RV Sites" }]
 * const parkFeatures = { "RV": { parkFeatures: [...] } }
 * const combined = combineCampingTypes(campings, campingTypes, parkFeatures)
 */
const combineCampingTypes = (campings, campingTypes, parkFeatures) => {
  let arr = []
  // Create a copy to avoid mutation
  const obj = JSON.parse(JSON.stringify(parkFeatures))

  // Filter the campings to include only active
  const parkCampingTypes = campings.filter(camping => camping.isActive)

  // Add the parkCampingTypes to the common object
  for (const parkCampingType of parkCampingTypes) {
    const campingTypeCode = parkCampingType.campingType?.campingTypeCode
    if (!campingTypeCode) continue

    if (!obj[campingTypeCode]) {
      obj[campingTypeCode] = { parkFeatures: [] }
    }
    obj[campingTypeCode] = { ...parkCampingType, ...obj[campingTypeCode] }
  }

  // Add the campingTypes to the common object and convert it to an array
  for (const campingTypeCode in obj) {
    const parkCampingType = obj[campingTypeCode]
    parkCampingType.campingType = campingTypes.find(
      ct => ct.campingTypeCode === campingTypeCode
    )

    // Only include camping, not facilities
    if (parkCampingType.campingType) {
      // The camping type should be active, but include it anyway if it has parkFeatures
      if (
        parkCampingType.campingType.isActive ||
        parkCampingType.parkFeatures.length > 0
      ) {
        arr.push(parkCampingType)
      }
    }
  }

  return arr.sort((a, b) =>
    a.campingType.campingTypeName.localeCompare(b.campingType.campingTypeName)
  )
}

/**
 * Combines park facilities data with facility types and park features into a unified structure
 * @param {Array} facilities - Array of park facility objects from the API
 * @param {Array} facilityTypes - Array of facility type definitions
 * @param {Object} parkFeatures - Object of park features grouped by type code
 * @returns {Array} Array of combined facility objects sorted by facility name
 * @throws {Error} Throws an error if any parameter is not the expected type
 * @example
 * const facilities = [{ isActive: true, facilityType: { facilityCode: "BOAT" } }]
 * const facilityTypes = [{ facilityCode: "BOAT", facilityName: "Boat Launch" }]
 * const parkFeatures = { "BOAT": { parkFeatures: [...] } }
 * const combined = combineFacilities(facilities, facilityTypes, parkFeatures)
 */
const combineFacilities = (facilities, facilityTypes, parkFeatures) => {
  let arr = []
  // Create a copy to avoid mutation
  const obj = JSON.parse(JSON.stringify(parkFeatures))

  // Filter the facilities to include only active
  const parkFacilities = facilities.filter(facility => facility.isActive)

  // Add the parkFacilities to the common object
  for (const parkFacility of parkFacilities) {
    const facilityCode = parkFacility.facilityType?.facilityCode
    if (!facilityCode) continue

    if (!obj[facilityCode]) {
      obj[facilityCode] = { parkFeatures: [] }
    }
    obj[facilityCode] = { ...parkFacility, ...obj[facilityCode] }
  }

  // Add the facilityTypes to the common object and convert it to an array
  for (const facilityCode in obj) {
    const parkFacility = obj[facilityCode]
    parkFacility.facilityType = facilityTypes.find(
      f => f.facilityCode === facilityCode
    )

    // Only include facilities, not camping
    if (parkFacility.facilityType) {
      // The facility type should be active, but include it anyway if it has parkFeatures
      if (
        parkFacility.facilityType.isActive ||
        parkFacility.parkFeatures.length > 0
      ) {
        arr.push(parkFacility)
      }
    }
  }

  return arr.sort((a, b) =>
    a.facilityType.facilityName.localeCompare(b.facilityType.facilityName)
  )
}

/**
 * Generates a display name for a park feature based on its area and feature name
 * @param {Object} feature - The park feature object
 * @param {Object|null} feature.parkArea - The park area object (can be null)
 * @param {string} [feature.parkArea.parkAreaName] - The name of the park area
 * @param {string} [feature.parkFeatureName] - The name of the park feature
 * @returns {string} The formatted facility name
 * @example
 * // No park area - returns just feature name
 * getDisplayName({ parkArea: null, parkFeatureName: "Boat Launch" })
 * // Returns: "Boat Launch"
 *
 * @example
 * // Feature name is "All sites" - returns just area name
 * getDisplayName({
 *   parkArea: { parkAreaName: "Campground A" },
 *   parkFeatureName: "All sites"
 * })
 * // Returns: "Campground A"
 *
 * @example
 * // Normal case - returns combined name
 * getDisplayName({
 *   parkArea: { parkAreaName: "Campground A" },
 *   parkFeatureName: "Site 1"
 * })
 * // Returns: "Campground A: Site 1"
 */
const getDisplayName = feature => {
  // If no park area, just display the feature name
  if (feature.parkArea == null) {
    return feature.parkFeatureName || ""
  }

  // If feature name is "All sites", just display the area name
  if (feature.parkFeatureName === "All sites") {
    return feature.parkArea.parkAreaName || ""
  }

  // Normal case: display both area and feature name
  return `${feature.parkArea?.parkAreaName || ""}: ${
    feature.parkFeatureName || ""
  }`
}

/**
 * Gets park gate data with fallback logic
 * @param {Object} feature - The park feature object
 * @param {Object|null} feature.parkArea - The park area object (can be null)
 * @param {Object} [feature.parkArea.parkGate] - The park gate data from area level
 * @param {Object} [feature.parkGate] - The park gate data from feature level
 * @returns {Object|null} The park gate data or null if none available
 */
const getDisplayGate = feature => {
  // If park area exists and has gate data, use area gate
  if (feature.parkArea?.parkGate) {
    return feature.parkArea.parkGate
  }

  // If no area gate but feature has gate data, use feature gate
  if (feature.parkGate) {
    return feature.parkGate
  }

  // No gate data available
  return null
}

export {
  combineFacilities,
  combineCampingTypes,
  groupParkFeaturesByType,
  preProcessParkFeatures,
}
