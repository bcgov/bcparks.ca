import axios from "axios"
import qs from "qs"

// Constants for population configurations
const PARK_AREA = {
  fields: ["parkAreaName"],
}
const PARK_DATES = {
  fields: ["isActive", "operatingYear", "startDate", "endDate"],
  populate: {
    parkDateType: { fields: ["dateType"] },
  },
}
const PARK_FEATURE_TYPE = {
  fields: ["parkFeatureType", "closureAffectsAccessStatus"],
  populate: {
    campingType: { fields: ["campingTypeCode", "icon"] },
    facilityType: { fields: ["facilityCode", "icon"] },
  },
}

// Get all park features (optionally filtered by starting letter)
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
          fields: ["orcs"],
        },
        parkArea: PARK_AREA,
        parkDates: PARK_DATES,
        parkFeatureType: PARK_FEATURE_TYPE,
      },
      pagination: {
        limit: 1000,
      },
    },
    {
      encodeValuesOnly: true,
    }
  )
  const response = await axios.get(`${apiBaseUrl}/park-features?${params}`)
  return response.data
}

// Get park features by protected area
const getParkFeatures = (apiBaseUrl, orcs) => {
  const params = qs.stringify(
    {
      filters: {
        protectedArea: {
          orcs: {
            $eq: orcs,
          },
        },
      },
      populate: {
        parkArea: PARK_AREA,
        parkDates: PARK_DATES,
        parkFeatureType: PARK_FEATURE_TYPE,
      },
      pagination: {
        limit: 100,
      },
    },
    {
      encodeValuesOnly: true,
    }
  )
  return axios.get(`${apiBaseUrl}/park-features?${params}`)
}

export { getAllParkFeatures, getParkFeatures }
