import moment from "moment"
import _ from "lodash"
import { parseISO, format } from "date-fns"

const datePhrase = (openDate, closeDate, fmt, yearRoundText, delimiter, prefix, nowrap) => {
  if (openDate && closeDate) {
    try {
      const open = moment(openDate).format(fmt)
      const close = moment(closeDate).format(fmt)
      const openYearRound =
        (open.indexOf("Jan 1") === 0 && close.indexOf("Dec 31") === 0) ||
        (open.indexOf("January 1") === 0 && close.indexOf("December 31") === 0)
      let output = openYearRound ? yearRoundText : `${prefix || ""}${open}${delimiter}${close}`
      if (nowrap) {
        return output.replace(/ /g, "\u00A0")
      }
      return output;
    } catch (err) {
      console.error("Err formatting date " + openDate + ", " + closeDate)
      return ""
    }
  } else {
    return ""
  }
}

// get unique date ranges, excluding years in the past, 
//sorted chronologically by start date and formatted as date pharses
const processDateRanges = (arr, fmt, yr, delimiter, yearPrefix) => {
  const newArr = []
  for (let dateRange of arr) {
    const startYear = moment(dateRange.start).year();
    const endYear = moment(dateRange.end).year();
    if (startYear === endYear) {
      newArr.push(dateRange)
    } else if (endYear > startYear) {
      for (let year = startYear; year <= endYear; year++) {
        if (year === startYear) {
          newArr.push({ start: dateRange.start, end: `${year}-12-31` })
        } else if (year === endYear) {
          newArr.push({ start: `${year}-01-01`, end: dateRange.end })
        } else {
          newArr.push({ start: `${year}-01-01`, end: `${year}-12-31` })
        }
      }
    } else {
      newArr.push(dateRange)
    }
  }

  const sortedUniqueFutureDates = _.uniqWith(newArr, _.isEqual)
    .filter(dateRange => moment(dateRange.end).year() >= new Date().getFullYear())
    .sort((a, b) => {
      return a.start < b.start ? -1 : 1
    })

  let groupedByYear = []
  let prevYear = 0
  let phrase = ""
  for (let dateRange of sortedUniqueFutureDates) {
    const year = moment(dateRange.start).year();
    if (phrase !== "" && year !== prevYear) {
      groupedByYear.push(phrase);
    }
    if (year !== prevYear) {
      phrase = `${year}: ${datePhrase(dateRange.start, dateRange.end, fmt, yr, delimiter, "", true)}`
    } else {
      phrase += `, ${datePhrase(dateRange.start, dateRange.end, fmt, yr, delimiter, "", true)}`
    }
    prevYear = year;
  }
  if (phrase !== "") {
    groupedByYear.push(phrase);
  }
  // on the park page, remove the year prefix if there is only one item in groupedByYear
  // on the park operationg dates page, keep the year prefix
  if (!yearPrefix) {
    if (groupedByYear.length === 1) {
      groupedByYear[0] = groupedByYear[0].replace(/^\d{4}: /, '');
    }
  }
  return groupedByYear
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
  datePhrase,
  processDateRanges,
  groupSubAreaDates,
  formattedTime,
  convertWinterRate
}