const { DateTime } = require("luxon");

/* 
  Convert the parkOperationDates and parkOperationSubAreaDates into a format
  that can be stored in Elasticsearch and easily be used to detect seasonal
  restrictions.

  e.g.:

  [
    {
      operatingYear: 2023,
      gateOpenDate: '2023-06-01',
      gateCloseDate: '2023-10-02',
      latestSubAreaOpenDate: '2023-06-01',
      earliestSubAreaCloseDate: '2023-10-02'
    },
    {
      operatingYear: 2024,
      gateOpenDate: '2024-06-01',
      gateCloseDate: '2024-10-02',
      latestSubAreaOpenDate: null,
      earliestSubAreaCloseDate: null
    }
  ]  
*/
const getSeasonalRestrictions = function (parkOperationDates, parkOperationSubAreas) {
  const thisYear = new Date().getFullYear();
  const results = {};

  // validate and combine parkOperationDates
  for (const yearlyData of parkOperationDates) {

    const openDateYear = DateTime.fromISO(yearlyData.gateOpenDate).year;
    const closeDateYear = DateTime.fromISO(yearlyData.gateCloseDate).year;

    // only use dates in future years or the current year where the open date is before the close date
    if (yearlyData.operatingYear >= thisYear && yearlyData.gateOpenDate < yearlyData.gateCloseDate) {
      // ignore any dates where the gateOpenDate, gateCloseDate and operatingYear don't all match
      if (openDateYear === yearlyData.operatingYear && closeDateYear === yearlyData.operatingYear) {
        if (!results[yearlyData.operatingYear]) {
          // if this is not a duplicate then create a new record
          results[yearlyData.operatingYear] = {
            operatingYear: yearlyData.operatingYear,
            gateOpenDate: yearlyData.gateOpenDate,
            gateCloseDate: yearlyData.gateCloseDate,
            latestSubAreaOpenDate: null,
            earliestSubAreaCloseDate: null
          }
        } else {
          // if this is a duplicate then update the existing record with the LEAST restrictive dates 
          // there really shouldn't be any duplicates, and if there are then it's due to a data entry error
          const current = results[yearlyData.operatingYear];
          results[yearlyData.operatingYear] = {
            ...current,
            gateOpenDate: yearlyData.gateOpenDate < current.gateOpenDate
              ? yearlyData.gateOpenDate
              : current.gateOpenDate,
            gateCloseDate: yearlyData.gateCloseDate > current.gateCloseDate
              ? yearlyData.gateCloseDate
              : current.gateCloseDate
          }
        }
      }
    }
  }

  // validate and combine parkOperationSubAreas
  for (const subarea of parkOperationSubAreas) {
    if (subarea.isActive && subarea.isOpen) {
      for (const yearlyData of subarea.parkOperationSubAreaDates) {

        const openDateYear = DateTime.fromISO(yearlyData.openDate).year;
        const closeDateYear = DateTime.fromISO(yearlyData.closeDate).year;

        // only use dates in future years or the current year where the open date is before the close date
        if (yearlyData.operatingYear >= thisYear && yearlyData.openDate < yearlyData.closeDate) {
          // ignore any dates where the openDate, closeDate and operatingYear don't all match
          if (yearlyData.isActive && openDateYear === yearlyData.operatingYear && closeDateYear === yearlyData.operatingYear) {

            if (!results[yearlyData.operatingYear]) {
              // if there is no existing record for this operating year then create one
              results[yearlyData.operatingYear] = {
                operatingYear: yearlyData.operatingYear,
                gateOpenDate: null,
                gateCloseDate: null,
                latestSubAreaOpenDate: yearlyData.openDate,
                earliestSubAreaCloseDate: yearlyData.closeDate
              }
            } else {
              // update the existing record with the MOST restrictive dates
              const current = results[yearlyData.operatingYear];
              results[yearlyData.operatingYear] = {
                ...current,
                latestSubAreaOpenDate: yearlyData.openDate > current.latestSubAreaOpenDate || `${yearlyData.operatingYear}-01-01`
                  ? yearlyData.openDate
                  : current.latestSubAreaOpenDate,
                earliestSubAreaCloseDate: yearlyData.closeDate < current.earliestSubAreaCloseDate || `${yearlyData.operatingYear}-12-31`
                  ? yearlyData.closeDate
                  : current.earliestSubAreaCloseDate
              }
            }
          }
        }
      }
    }
  }
  return Object.values(results);
}

module.exports = {
  getSeasonalRestrictions
}