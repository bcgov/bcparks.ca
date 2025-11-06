import axios from "axios"
import qs from "qs"

import { countsList } from "./constants"

// Constants
const currentYear = new Date().getFullYear()
const campsites = countsList
  .filter(count => count.isActive)
  .map(count => count.countVar)

const PARK_AREA = {
  fields: ["parkAreaName"],
}
const PARK_DATES = {
  fields: ["isActive", "operatingYear", "startDate", "endDate"],
  filters: {
    $and: [
      {
        isActive: { $eq: true },
      },
      {
        operatingYear: { $gte: currentYear },
      },
    ],
  },
  populate: {
    parkDateType: { fields: ["dateTypeId", "dateType"] },
  },
}
const PARK_FEATURE_TYPE = {
  fields: ["parkFeatureType", "closureAffectsAccessStatus"],
  populate: {
    campingType: { fields: ["campingTypeCode", "icon"] },
    facilityType: { fields: ["facilityCode", "icon"] },
  },
}
const PARK_GATE = {
  fields: [
    "hasGate",
    "gateOpenTime",
    "gateCloseTime",
    "gateOpensAtDawn",
    "gateClosesAtDusk",
    "gateOpen24Hours",
    "gateNote",
  ],
}
const PARK_GATE_DATES = {
  fields: ["isActive", "operatingYear", "startDate", "endDate"],
  filters: {
    $and: [
      {
        isActive: { $eq: true },
      },
      {
        operatingYear: { $gte: currentYear },
      },
      {
        parkDateType: {
          dateTypeId: { $eq: 1 }, // Gate dates only
        },
      },
    ],
  },
}

/**
 * Retrieves all park features from the API, optionally filtered by starting letter
 * @param {string} apiBaseUrl - The base URL for the API
 * @param {string|null} [startingLetter=null] - Optional filter to get parks starting with this letter
 * @returns {Promise<Object>} Promise that resolves to the API response data containing park features
 * @throws {Error} Throws an error if the API request fails
 * @example
 * // Get all park features
 * const allFeatures = await getAllParkFeatures(apiBaseUrl)
 *
 * // Get park features for parks starting with 'A'
 * const aFeatures = await getAllParkFeatures(apiBaseUrl, 'A')
 */
const getAllParkFeatures = async (apiBaseUrl, startingLetter = null) => {
  const filters = {
    isActive: true,
  }

  // Add starting letter filter, if provided
  if (startingLetter) {
    filters.protectedArea = {
      protectedAreaName: {
        $startsWith: startingLetter,
      },
    }
  }

  const params = qs.stringify(
    {
      filters,
      fields: [
        "isActive",
        "isOpen",
        "isCleanAirSite",
        "parkFeatureName",
        "hasBackcountryReservations",
        "closureAffectsAccessStatus",
      ],
      populate: {
        protectedArea: {
          fields: ["orcs", "protectedAreaName"],
          populate: {
            parkDates: PARK_GATE_DATES,
          },
        },
        parkArea: PARK_AREA,
        parkDates: PARK_DATES,
        parkFeatureType: PARK_FEATURE_TYPE,
      },
      sort: ["parkFeatureName:asc"],
      pagination: {
        limit: 1000,
      },
    },
    {
      encodeValuesOnly: true,
    }
  )

  try {
    const response = await axios.get(`${apiBaseUrl}/park-features?${params}`)
    return response.data
  } catch (error) {
    console.error("Error fetching park features:", error)
    throw error
  }
}

/**
 * Retrieves park features for a specific protected area by ORCS number
 * @param {string} apiBaseUrl - The base URL for the API
 * @param {number} orcs - The ORCS number of the protected area
 * @returns {Promise<Object>} Promise that resolves to the API response data containing park features
 * @throws {Error} Throws an error if the API request fails
 * @example
 * // Get park features for a specific park
 * const features = await getParkFeatures(apiBaseUrl, 123)
 */
const getParkFeatures = async (apiBaseUrl, orcs) => {
  const params = qs.stringify(
    {
      filters: {
        isActive: true,
        protectedArea: {
          orcs: {
            $eq: orcs,
          },
        },
      },
      fields: [
        "isActive",
        "isOpen",
        "parkFeatureName",
        "hasBackcountryReservations",
        "closureAffectsAccessStatus",
        ...campsites,
      ],
      populate: {
        parkArea: PARK_AREA,
        parkDates: PARK_DATES,
        parkFeatureType: PARK_FEATURE_TYPE,
        parkGate: PARK_GATE,
      },
      sort: ["parkFeatureName:asc"],
      pagination: {
        limit: 100,
      },
    },
    {
      encodeValuesOnly: true,
    }
  )

  try {
    const response = await axios.get(`${apiBaseUrl}/park-features?${params}`)
    return response.data
  } catch (error) {
    console.error("Error fetching park features:", error)
    throw error
  }
}

/**
 * Retrieves protected area data with gate information and filtered park dates
 * @param {string} apiBaseUrl - The base URL for the API
 * @param {number} orcs - The ORCS number of the protected area
 * @returns {Promise<Object>} Promise that resolves to the API response data containing protected area info
 * @throws {Error} Throws an error if the API request fails or parameters are invalid
 * @example
 * // Get protected area data with active gate dates for current year and future
 * const protectedArea = await getProtectedArea(apiBaseUrl, 123)
 */
const getProtectedArea = async (apiBaseUrl, orcs) => {
  const params = qs.stringify(
    {
      fields: ["hasCampfireBan"],
      populate: {
        parkGate: PARK_GATE,
        parkDates: PARK_GATE_DATES,
      },
      pagination: {
        limit: 100,
      },
    },
    {
      encodeValuesOnly: true,
    }
  )

  try {
    const response = await axios.get(
      `${apiBaseUrl}/protected-areas/${orcs}?${params}`
    )
    return response.data
  } catch (error) {
    console.error(`Error fetching protected area ${orcs}:`, error)
    throw new Error(`Failed to fetch protected area ${orcs}: ${error.message}`)
  }
}

export { getAllParkFeatures, getParkFeatures, getProtectedArea }
