import React, { useState } from "react"
import moment from "moment"
import _ from "lodash"

import HTMLArea from "../HTMLArea"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Accordion from "react-bootstrap/Accordion"
import Container from "react-bootstrap/Container"
import Heading from "./heading"
import HtmlContent from "./htmlContent"
import StaticIcon from "./staticIcon"
import { ParkAccessFromAdvisories } from "../../components/park/parkAccessStatus"
import { countsList } from "../../utils/constants";

export default function ParkDates({ data }) {
  const dataCopy = JSON.parse(JSON.stringify(data)) // deep copy
  const parkOperation = dataCopy.parkOperation || {}
  const subAreas = dataCopy.subAreas || []
  subAreas.sort((a, b) => (a.parkSubArea >= b.parkSubArea ? 1 : -1))

  const advisories = dataCopy.advisories || []

  const parkStatus = ParkAccessFromAdvisories(advisories)
  const parkStatusText = parkStatus.parkStatusText
  const parkStatusIcon = parkStatus.parkStatusIcon

  // Accordion expanded state
  const [expanded, setExpanded] = useState(Array(subAreas.length).fill(false))
  const toggleExpand = index => {
    expanded[index] = !expanded[index]
    setExpanded([...expanded])
  }

  // Operations record is required, even if subarea records are present
  // If no operations record, show "not available" message
  const hasOperations = parkOperation.isActive // either false, or whole record missing

  // -------- Operating Dates --------

  const datePhrase = (openDate, closeDate, fmt, yearRoundText) => {
    if (openDate && closeDate) {
      try {
        const open = moment(openDate).format(fmt)
        const close = moment(closeDate).format(fmt)

        // check if dates go from jan 1 to dec 31
        // for puposes of checking if year-round, ignoring year
        const openYearRound =
          open.indexOf("January 1") === 0 && close.indexOf("December 31") === 0
        let output = openYearRound ? yearRoundText : open + " to " + close

        return output
      } catch (err) {
        console.error("Err formatting date " + openDate + ", " + closeDate)
        return ""
      }
    } else {
      return "" // at least one date missing
    }
  }

  // Overall operating dates for parks, to display above subareas
  const fmt = "MMMM D, yyyy"  // date format for overall operating dates
  const yr = "year-round" // lowercase for overall operating dates
  let parkDates = datePhrase(parkOperation.openDate, parkOperation.closeDate, fmt, yr)

  // make sure the parkDates is valid
  const thisYear = new Date().getFullYear()
  if (parkDates !== yr && !parkDates.includes(thisYear)) {
    parkDates = "";
  }

  // ---- Subarea Dates -----

  // get unique date ranges, excluding years in the past, 
  //sorted chronologically by start date and formatted as date pharses
  const processDateRanges = (arr) => {

    // split date ranges spanning multiple years into 1 row for each year
    const newArr = []
    for (let dateRange of arr) {
      const startYear = moment(dateRange.start).year();
      const endYear = moment(dateRange.end).year();
      if (startYear === endYear) {
        newArr.push(dateRange);
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
        newArr.push(dateRange) // fallback for invalid date ranges
      }
    }

    // get sorted unique dates, omitting past years
    const sortedUniqueFutureDates = _.uniqWith(newArr, _.isEqual)
      .filter(dateRange => moment(dateRange.end).year() >= new Date().getFullYear())
      .sort((a, b) => {
        return a.start < b.start ? -1 : 1
      })

    // group dates by year
    let groupedByYear = []
    const fmt = "MMMM D" // date format for subareas
    const yr = "Year-round" // capitalized for subareas
    let prevYear = 0;
    let phrase = "";
    for (let dateRange of sortedUniqueFutureDates) {
      const year = moment(dateRange.start).year();
      if (phrase !== "" && year !== prevYear) {
        groupedByYear.push(phrase);
      }
      if (year !== prevYear) {
        phrase = `${year}: ${datePhrase(dateRange.start, dateRange.end, fmt, yr)}`
      } else {
        phrase += `, ${datePhrase(dateRange.start, dateRange.end, fmt, yr)}`
      }
      prevYear = year;
    }
    if (phrase !== "") {
      groupedByYear.push(phrase);
    }
    return groupedByYear
  }

  for (let idx in subAreas) {
    const subArea = subAreas[idx]

    if (subArea.isActive) {
      const typeObj = subArea.parkSubAreaType || {}
      const iconUrl = typeObj.iconUrl || ""
      const typeIcon = iconUrl.split("/")[iconUrl.split("/").length - 1] // ignore path, get filename
      subArea.typeIcon = typeIcon

      const facilityType = subArea.facilityType || {}
      subArea.facilityName = facilityType.facilityName || ""

      // Subarea operating dates
      const saDates = subArea.parkOperationSubAreaDates
      subArea.offSeasonDates = []
      subArea.resDates = []
      subArea.serviceDates = []

      for (let dIdx in saDates) {
        const dateRec = saDates[dIdx]
        if (dateRec.isActive) {
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

      // get distinct date ranges sorted chronologically
      subArea.serviceDates = processDateRanges(subArea.serviceDates)
      subArea.resDates = processDateRanges(subArea.resDates)
      subArea.offSeasonDates = processDateRanges(subArea.offSeasonDates)

      // add a placeholder if no dates are available for the current year
      if (subArea.serviceDates.length === 0
        && subArea.resDates.length === 0
        && subArea.offSeasonDates.length === 0) {
        subArea.serviceDates.push(`${new Date().getFullYear()}: Dates are not yet available`)
      }
    }
  }

  // -------- Operating Notes ----------

  // Use this to configure which notes show below the subareas, and within each subarea
  // and in what order. Note that "openNote" appears separately above subareas
  const parkOperationsNotesList = [
    { noteVar: "generalNote", display: "Note" },
    { noteVar: "serviceNote", display: "Service note" },
    { noteVar: "reservationsNote", display: "Reservation note" },
    { noteVar: "offSeasonNote", display: "Winter note" },
  ]

  const subAreasNotesList = [
    { noteVar: "generalNote", display: "Note" },
    { noteVar: "serviceNote", display: "Service note" },
    { noteVar: "reservationNote", display: "Reservation note" },
    { noteVar: "offSeasonNote", display: "Winter note" },
  ]

  const isShown = (count, countGroup) => {
    return countGroup[count.countVar] &&
      countGroup[count.countVar] !== "0" &&
      countGroup[count.countVar] !== "*" &&
      count.isActive;
  }

  return (
    <div id="park-dates-container" className="anchor-link mb-3">
      <Heading>Dates of operation</Heading>
      <Row>
        <Col>
          {!hasOperations && (
            <div className="font-italic">
              There is currently no operating date information available
            </div>
          )}
          {hasOperations && (
            <>
              <div className="text-center">
                <div className="dates-header font-italic">
                  All dates are subject to change without notice.
                </div>
                {parkDates && (
                  <>
                    <h4 className="my-3">Open to public access {parkDates}</h4>
                  </>
                )}
                {!parkDates && (
                  <>
                    <h4 className="my-3">Operating dates are not yet available</h4>
                  </>
                )}
                <h4 className="my-3">
                  Current status:
                  <img
                    src={parkStatusIcon}
                    alt=""
                    className="mx-1"
                    style={{ width: 32, height: 32 }}
                  />
                  {parkStatusText}
                </h4>
                <div className="font-italic my-3">
                  Be sure to check advisories above before visiting
                </div>
                {parkOperation.openNote && (
                  <div className="dates-open-note">
                    <HTMLArea isVisible={true}>
                      {parkOperation.openNote}
                    </HTMLArea>
                  </div>
                )}
              </div>
              {subAreas
                .filter(subArea => subArea.isActive)
                .map((subArea, index) => (
                  <Accordion
                    key={"parkActivity" + index}
                    className="park-details mb-2"
                  >
                    <Accordion.Toggle
                      as={Container}
                      aria-controls={subArea.parkSubArea}
                      eventKey="0"
                      id={index}
                      onClick={() => toggleExpand(index)}
                    >
                      <div className="d-flex justify-content-between p-3 accordion-toggle">
                        <div className="d-flex justify-content-left align-items-center pl-2">
                          <StaticIcon name={subArea.typeIcon} size={48} />
                          <HtmlContent className="pl-3 accordion-header">
                            {subArea.parkSubArea}
                          </HtmlContent>
                        </div>
                        <div className="d-flex align-items-center expand-icon">
                          <i
                            className={
                              (expanded[index] ? "open " : "close ") +
                              "fa fa-angle-down mx-3"
                            }
                          ></i>
                        </div>
                      </div>
                    </Accordion.Toggle>
                    <Accordion.Collapse eventKey="0">
                      <div className="p-4">
                        <dl>
                          {subArea.facilityName && (
                            <>
                              <dt>Facility type</dt>
                              <dd>{subArea.facilityName}</dd>
                            </>
                          )}

                          {countsList
                            .filter(count => isShown(count, subArea)).length > 0
                            && (<>
                              <dt className="mt-3">Number of campsites</dt>
                              <dd><ul className="pl-3">
                                {countsList
                                  .filter(count => isShown(count, subArea))
                                  .map((count, index) => (
                                    <li key={index}>
                                      {count.display}:{" "}
                                      {subArea[count.countVar]}
                                    </li>
                                  ))}
                              </ul></dd>
                            </>
                            )}

                          {subArea.serviceDates.length > 0 && (
                            <>
                              <dt className="mt-3">
                                {subArea?.facilityType?.isCamping || false
                                  ? 'Main camping season dates'
                                  : 'Main operating season dates'}
                              </dt>
                              <dd>
                                <ul className="pl-3">
                                  {subArea.serviceDates.map((dateRange, index) =>
                                    <li key={index}>{dateRange}</li>
                                  )}
                                </ul>
                              </dd>
                            </>
                          )}

                          {subArea.resDates.length > 0 && (
                            <>
                              <dt className="mt-3">Reservable dates</dt>
                              <dd>
                                <ul className="pl-3">
                                  {subArea.resDates.map((dateRange, index) =>
                                    <li key={index}>{dateRange}</li>
                                  )}
                                </ul>
                              </dd>
                            </>
                          )}

                          {subArea.offSeasonDates.length > 0 && (
                            <>
                              <dt className="mt-3">Off season dates</dt>
                              <dd>
                                <ul className="pl-3">
                                  {subArea.offSeasonDates.map((dateRange, index) =>
                                    <li key={index}>{dateRange}</li>
                                  )}
                                </ul>
                              </dd>
                            </>
                          )}

                          {subAreasNotesList
                            .filter(note => subArea[note.noteVar])
                            .map((note, index) => (
                              <div key={index}>
                                {note.display && (
                                  <dt className="mt-3">
                                    {note.display}
                                  </dt>
                                )}
                                <dd>
                                  <HTMLArea isVisible={true}>
                                    {subArea[note.noteVar]}
                                  </HTMLArea>
                                </dd>
                              </div>
                            ))}
                        </dl>
                      </div>
                    </Accordion.Collapse>
                  </Accordion>
                ))}
            </>
          )}
          <dl className="mb-0">
            {parkOperationsNotesList
              .filter(note => parkOperation[note.noteVar])
              .map((note, index) => (
                <div key={index}>
                  {note.display && (
                    <dt className="mt-3">
                      {note.display}
                    </dt>
                  )}
                  <dd>
                    <HTMLArea isVisible={true}>
                      {parkOperation[note.noteVar]}
                    </HTMLArea>
                  </dd>
                </div>
              ))}
          </dl>
        </Col>
      </Row>
      <div className="m-3">&nbsp;</div>
    </div>
  )
}
