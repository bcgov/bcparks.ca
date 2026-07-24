import axios from "axios"
const qs = require('qs');

const getAdvisoryTypeFromUrl = () => {
  let aType = "all", thisUrl = "", params

  if (typeof window !== "undefined" && window.document) {
    thisUrl = new URLSearchParams(window.location.search)
    params = Object.fromEntries(thisUrl.entries())
  }

  if (params && params.type) {
    aType = params.type
  }
  return aType
}

const loadAdvisories = (apiBaseUrl, orcsId) => {
  const params = qs.stringify({
    filters: {
      protectedAreas: {
        orcs: {
          $eq: orcsId
        }
      }
    },
    pagination: {
      limit: 100,
    }
  }, {
    encodeValuesOnly: true,
  })

  return axios.get(`${apiBaseUrl}/public-advisories/items?${params}`)
}

const loadAllAdvisories = (apiBaseUrl) => {
  const params = qs.stringify({
    filters: {
      advisoryStatus: {
        code: {
          $eq: "PUB"
        }
      }
    },
    fields: ["advisoryNumber"],
    populate: {
      accessStatus: { fields: ["accessStatus", "precedence", "color", "groupLabel", "hidesSeasonalAdvisory"] },
      protectedAreas: { fields: ["orcs"] }
    },
    pagination: {
      limit: 1000,
    }
  }, {
    encodeValuesOnly: true,
  })

  return axios.get(`${apiBaseUrl}/public-advisories/?${params}`)
}

// Get advisory displayed date
const getAdvisoryDate = (advisory) => {
  if (advisory.isAdvisoryDateDisplayed && advisory.advisoryDate) {
    return new Date(advisory.advisoryDate)
  }
  if (advisory.isEffectiveDateDisplayed && advisory.effectiveDate) {
    return new Date(advisory.effectiveDate)
  }
  if (advisory.isUpdatedDateDisplayed && advisory.updatedDate) {
    return new Date(advisory.updatedDate)
  }
  // If none of the above conditions are met
  // return updatedDate if available, otherwise return advisoryDate
  return advisory.updatedDate ? new Date(advisory.updatedDate) : new Date(advisory.advisoryDate)
}

// Parses a date-like value to a sortable timestamp.
// Invalid or missing values fall back to 0 so sorting stays deterministic.
const getSortableTimestamp = value => {
  const parsed = Date.parse(value)
  return Number.isFinite(parsed) ? parsed : 0
}

// Sort advisories by posting date first, then by updated date, then id to
// guarantee a deterministic order for offset pagination. This intentionally
// differs from the UI display date, which may show effective or updated dates.
const compareAdvisories = (a, b) => {
  const advisoryDateA = getSortableTimestamp(a.advisoryDate)
  const advisoryDateB = getSortableTimestamp(b.advisoryDate)
  const advisoryDateDiff = advisoryDateB - advisoryDateA

  if (advisoryDateDiff !== 0) {
    return advisoryDateDiff
  }

  // If advisoryDate matches, compare updatedDate.
  const updatedDateA = getSortableTimestamp(a.updatedDate)
  const updatedDateB = getSortableTimestamp(b.updatedDate)
  const updatedDateDiff = updatedDateB - updatedDateA

  if (updatedDateDiff !== 0) {
    return updatedDateDiff
  }

  // Final tie-breaker: id keeps ordering stable when date fields are identical.
  return (Number(b.id) || 0) - (Number(a.id) || 0)
}

const WINTER_FULL_PARK_ADVISORY = {
  id: -1,
  title: "Limited access to this park during winter season",
  description: `<p>Vehicle access to the park is not available during the winter season. Visitors
                can still access the park on foot, but parking may not be available. Check
                <a href="#main-content">park opening dates</a>, <a href="#camping">camping</a>, and <a href="#facilities">facilities</a> for details and
                opening dates.</p>`,
  urgency: { sequence: 1, color: "blue" },
  eventType: { eventType: "Winter access" }
};

const WINTER_SUB_AREA_ADVISORY = {
  id: -1,
  title: "Limited access to some areas during the winter season",
  description: `<p>Vehicle access to some areas of the park is not available during the winter season.
                Visitors can still access them on foot, but parking may not be available. Check
                <a href="#camping">camping</a> and <a href="#facilities">facilities</a> for details and opening
                dates.</p>`,
  urgency: { sequence: 1, color: "blue" },
  eventType: { eventType: "Winter access" }
};

export {
  loadAdvisories,
  loadAllAdvisories,
  getAdvisoryTypeFromUrl,
  getAdvisoryDate,
  compareAdvisories,
  WINTER_FULL_PARK_ADVISORY,
  WINTER_SUB_AREA_ADVISORY
}
