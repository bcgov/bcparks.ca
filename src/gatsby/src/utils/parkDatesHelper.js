import moment from "moment"
import _ from "lodash"

const datePhrase = (openDate, closeDate, fmt, yearRoundText, delimiter, prefix) => {
  if (openDate && closeDate) {
    try {
      const open = moment(openDate).format(fmt)
      const close = moment(closeDate).format(fmt)
      const openYearRound =
        (open.indexOf("Jan 1") === 0 && close.indexOf("Dec 31") === 0) ||
        (open.indexOf("January 1") === 0 && close.indexOf("December 31") === 0)
      let output = openYearRound ? yearRoundText : `${prefix || ""}${open}${delimiter}${close}`
      return output.replace(/ /g, "\u00A0")
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
const processDateRanges = (arr, fmt, yr, delimiter) => {
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
      phrase = `${year}: ${datePhrase(dateRange.start, dateRange.end, fmt, yr, delimiter)}`
    } else {
      phrase += `, ${datePhrase(dateRange.start, dateRange.end, fmt, yr, delimiter)}`
    }
    prevYear = year;
  }
  if (phrase !== "") {
    groupedByYear.push(phrase);
  }
  return groupedByYear
}

const groupSubAreaDates = (subArea) => {
  const saDates = subArea.parkOperationSubAreaDates
  subArea.operationDates = []
  subArea.offSeasonDates = []
  subArea.resDates = []
  subArea.serviceDates = []

  for (let dIdx in saDates) {
    const dateRec = saDates[dIdx]
    if (dateRec.isActive) {
      subArea.operationDates.push({
        start: dateRec.openDate,
        end: dateRec.closeDate
      })
      subArea.serviceDates.push({
        start: dateRec.serviceStartDate,
        end: dateRec.serviceEndDate
      })
      subArea.resDates.push({
        start: dateRec.reservationStartDate,
        end: dateRec.reservationEndDate
      })
      subArea.offSeasonDates.push({
        start: dateRec.offSeasonStartDate,
        end: dateRec.offSeasonEndDate
      })
    }
  }
  return subArea;
}

export {
  datePhrase,
  processDateRanges,
  groupSubAreaDates
}