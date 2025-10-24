import _ from "lodash"
import { parseISO, format, getYear, getMonth, getDate, getMinutes } from "date-fns"

// Format a date range
// e.g. "May 15 – Oct 31, 2025" or "year-round"
const formatDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return ""
  }

  // Parse dates using date-fns
  const openDate = parseISO(startDate)
  const closeDate = parseISO(endDate)
  const currentYear = new Date().getFullYear()
  
  // Only show dates that are current year or future
  const openYear = getYear(openDate)
  const closeYear = getYear(closeDate)
  
  // Skip if both start and end years are before current year
  if (openYear < currentYear && closeYear < currentYear) {
    return ""
  }
  
  // Check if it's year-round (Jan 1 to Dec 31)
  const isYearRound = (
    getMonth(openDate) === 0 && getDate(openDate) === 1 && // Jan 1
    getMonth(closeDate) === 11 && getDate(closeDate) === 31 && // Dec 31
    openYear === closeYear // Same year
  )
  
  if (isYearRound) {
    return "year-round"
  }

  const sameYear = openYear === closeYear

  if (sameYear) {
    // Same year: "May 15 – Oct 31, 2025"
    const openFormatted = format(openDate, 'MMM d')
    const closeFormatted = format(closeDate, 'MMM d')
    return `${openFormatted} – ${closeFormatted}, ${openYear}`
  } else {
    // Different years: "May 15, 2025 – Oct 31, 2026"
    const openFormatted = format(openDate, 'MMM d, yyyy')
    const closeFormatted = format(closeDate, 'MMM d, yyyy')
    return `${openFormatted} – ${closeFormatted}`
  }
}

// Format gate time 
// e.g. "08:00:00" to "8 am"
const formattedTime = time => {
  // prepend a dummy date to the time string to parse it
  const dateTime = parseISO(`1970-01-01T${time}`)
  const minutes = getMinutes(dateTime)
  if (minutes === 0) {
    return format(dateTime, "h aa").toLowerCase()
  } else {
    return format(dateTime, "h:mm aa").toLowerCase()
  }
}

// Join date ranges
const joinDateRanges = (dateRanges) => {
  if (dateRanges.length === 0) return ""
  if (dateRanges.length === 1) return dateRanges[0]
  if (dateRanges.length === 2) return `${dateRanges[0]} and ${dateRanges[1]}`
  
  // For 3 or more ranges: "range1, range2, range3 and range4"
  const lastRange = dateRanges.at(-1)
  const otherRanges = dateRanges.slice(0, -1)
  return `${otherRanges.join(", ")} and ${lastRange}`
}

// Get feature dates formatted
const getFeatureDates = (dateArray) => {
  return dateArray
    .sort((a, b) => new Date(a.start) - new Date(b.start))
    .map(dateRange => {
      const dateStr = formatDateRange(dateRange.start, dateRange.end)
      if (dateStr === "") return null
      return dateStr === "year-round" ? "Year-round" : dateStr
    })
    .filter(Boolean)
}

// Get park dates formatted
const getParkDates = (operationDates, thisYear) => {
  // Filter operation dates for the current year
  const parkOperationDates = operationDates.filter(d => d.operatingYear === +thisYear)
  
  if (parkOperationDates.length === 0) {
    return ""
  }

  // Format each date range and filter out empty ones
  const formattedDateRanges = parkOperationDates
    .sort((a, b) => new Date(a.gateOpenDate) - new Date(b.gateOpenDate))
    .map(dateData => formatDateRange(dateData.gateOpenDate, dateData.gateCloseDate))
    .filter(dateStr => dateStr !== "")
  
  if (formattedDateRanges.length === 0) {
    return ""
  }

  // Join the date ranges with proper grammar
  return joinDateRanges(formattedDateRanges)
}

// Group subarea dates into operation, service, reservation, off-season
const groupSubAreaDates = (subArea) => {
  const subAreaDates = subArea.parkOperationSubAreaDates || []
  const featureDates = subArea.parkFeatureDates || []
  subArea.operationDates = []
  subArea.offSeasonDates = []
  subArea.resDates = []
  subArea.serviceDates = []

  // TODO: remove it once data migration is completed
  subAreaDates.filter((date) => date.isActive).forEach((date) => {
    subArea.operationDates.push({ start: date.openDate, end: date.closeDate })
    subArea.serviceDates.push({ start: date.serviceStartDate, end: date.serviceEndDate })
    subArea.resDates.push({ start: date.reservationStartDate, end: date.reservationEndDate })
    subArea.offSeasonDates.push({ start: date.offSeasonStartDate, end: date.offSeasonEndDate })
  })

  // override subAreaDates with featureDates
  const dateTypes = {
    "Operation": "serviceDates",
    "Reservation": "resDates",
    "Winter fee": "offSeasonDates",
    // TODO: add more date types as needed
  }
  // create an object keyed by dateType
  const featureDatesByType = _.keyBy(featureDates, "dateType")
  // narrow down to the date types
  const relevantFeatureDates = _.pick(featureDatesByType, Object.keys(dateTypes))
  _.forEach(relevantFeatureDates, (featureDate, type) => {
    const key = dateTypes[type]
    if (featureDate) {
      subArea[key] = [{ start: featureDate.startDate, end: featureDate.endDate }]
    }
  })
  return subArea
}


export {
  formatDateRange,
  formattedTime,
  getFeatureDates,
  getParkDates,
  groupSubAreaDates,
}