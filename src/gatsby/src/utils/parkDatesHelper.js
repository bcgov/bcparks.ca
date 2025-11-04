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
  
  // Only show dates that are current year or future
  const openYear = getYear(openDate)
  const closeYear = getYear(closeDate)
  const sameYear = openYear === closeYear
  
  // Check if it's year-round (Jan 1 to Dec 31)
  const isYearRound = (
    getMonth(openDate) === 0 && getDate(openDate) === 1 && // Jan 1
    getMonth(closeDate) === 11 && getDate(closeDate) === 31 && // Dec 31
    openYear === closeYear // Same year
  )
  
  if (isYearRound) {
    return "year-round"
  }

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
const getParkDates = (parkOperationDates) => {  
  if (parkOperationDates.length === 0) {
    return ""
  }

  // Format each date range and filter out empty ones
  const formattedDateRanges = parkOperationDates
    .sort((a, b) => new Date(a.startDate) - new Date(b.startDate))
    .map(dateData => formatDateRange(dateData.startDate, dateData.endDate))
    .filter(dateStr => dateStr !== "")
  
  if (formattedDateRanges.length === 0) {
    return ""
  }

  // Join the date ranges with proper grammar
  return joinDateRanges(formattedDateRanges)
}

const groupParkFeatureDates = (feature) => {
  const featureDates = feature.parkDates || []
  
  // Group dates by dateTypeId
  const datesByTypeId = featureDates
    .filter(date => date.isActive && date.parkDateType?.dateTypeId)
    .reduce((acc, date) => {
      const dateTypeId = date.parkDateType.dateTypeId
      
      if (!acc[dateTypeId]) {
        acc[dateTypeId] = []
      }
      
      acc[dateTypeId].push({
        operatingYear: date.operatingYear,
        start: date.startDate,
        end: date.endDate
      })
      
      return acc
    }, {})

  // Map dateTypeIds to feature properties based on your API data
  feature.gateDates = datesByTypeId[1] || []                    // Gate
  feature.tier1Dates = datesByTypeId[2] || []                   // Tier 1
  feature.tier2Dates = datesByTypeId[3] || []                   // Tier 2
  feature.winterFeeDates = datesByTypeId[4] || []               // Winter fee
  feature.dayUsePassDates = datesByTypeId[5] || []              // Day-use pass
  feature.operationDates = datesByTypeId[6] || []               // Operation
  feature.reservationDates = datesByTypeId[7] || []             // Reservation
  feature.backcountryDates = datesByTypeId[8] || []             // Backcountry registration
  feature.firstComeFirstServedDates = datesByTypeId[9] || []    // First come, first served
  feature.serviceAndFeeDates = datesByTypeId[10] || []          // Full services and fees

  return feature
}

export {
  formatDateRange,
  formattedTime,
  getFeatureDates,
  getParkDates,
  groupParkFeatureDates,
}