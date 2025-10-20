import _ from "lodash"
import { parseISO, format, getYear, getMonth, getDate } from "date-fns"

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

// Updated getParkDates function using the reusable formatter
const getParkDates = (operationDates, thisYear) => {
  const parkOperationDates = operationDates.find(d => d.operatingYear === +thisYear) || {}
  
  const parkDates = formatDateRange(
    parkOperationDates.gateOpenDate, 
    parkOperationDates.gateCloseDate
  )

  // If the dates don't include the current year, return empty string
  if (parkDates && parkDates !== "year-round" && !parkDates.includes(thisYear.toString())) {
    return ""
  }

  return parkDates
}

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

// function to format gate open/close time e.g. "08:00:00" to "8 am"
const formattedTime = time => {
  // prepend a dummy date to the time string to parse it
  const dateTime = parseISO(`1970-01-01T${time}`)
  const minutes = format(dateTime, "mm")
  if (minutes === "00") {
    return format(dateTime, "h aa").toLowerCase()
  } else {
    return format(dateTime, "h:mm aa").toLowerCase()
  }
}

// function to convert date from "YYYY: MM/DD – MM/DD" to "MM/DD, YYYY – MM/DD, YYYY"
const convertWinterRate = dates => {
  if (!Array.isArray(dates) || dates.length === 0) {
    return []
  }
  // flatten all ranges into a single array
  return dates.flatMap(date => {
    const [year, ranges] = date.split(": ")
    if (!year || !ranges) return []
    // split multiple ranges by comma
    return ranges.split(",").map(range => {
      const [start, end] = range.split("–")
      if (!start || !end) return ""
      const startDate = `${start.trim()}, ${year}`
      const endDate = `${end.trim()}, ${year}`
      return `${startDate}–${endDate}`
    }).filter(Boolean)
  })
}

export {
  formatDateRange,
  getParkDates,
  groupSubAreaDates,
  formattedTime,
  convertWinterRate
}