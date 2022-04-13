import React, { useState } from "react"
import moment from "moment"

import HTMLArea from "../HTMLArea"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Accordion from "react-bootstrap/Accordion"
import Container from "react-bootstrap/Container"
import Heading from "./heading"
import HtmlContent from "./htmlContent"
import StaticIcon from "./staticIcon"
import { ParkAccessFromAdvisories } from "../../components/park/parkAccessStatus"

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

  const fmt = "MMM D, yyyy" // date format for display

  // -------- Operating Dates --------

  const datePhrase = (openDate, closeDate) => {
    if (openDate && closeDate) {
      try {
        const open = moment(openDate).format(fmt)
        const close = moment(closeDate).format(fmt)

        // check if dates go from jan 1 to dec 31
        // for puposes of checking if year-round, ignoring year
        const openYearRound =
          open.indexOf("Jan 1") === 0 && close.indexOf("Dec 31") === 0
        let output = openYearRound ? "year-round" : open + " - " + close

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
  const parkDates = datePhrase(parkOperation.openDate, parkOperation.closeDate)

  // ---- Subarea Dates -----

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
      let saDateCount = 0
      subArea.processedDates = []
      for (let dIdx in saDates) {
        const dateRec = saDates[dIdx]
        if (dateRec.isActive) {
          saDateCount++
          const serviceDates = datePhrase(
            dateRec.serviceStartDate,
            dateRec.serviceEndDate
          )
          const resDates = datePhrase(
            dateRec.reservationStartDate,
            dateRec.reservationEndDate
          )
          const offSeasonDates = datePhrase(
            dateRec.offSeasonStartDate,
            dateRec.offSeasonEndDate
          )

          if (saDateCount === 1) {
            subArea.serviceDates = serviceDates
            subArea.resDates = resDates
            subArea.offSeasonDates = offSeasonDates
          } else {
            // more than one date for this subarea, extend sentence
            subArea.serviceDates += serviceDates ? ", " + serviceDates : ""
            subArea.resDates += resDates ? ", " + resDates : ""
            subArea.offSeasonDates += offSeasonDates
              ? ", " + offSeasonDates
              : "" // prettier is adding extra line breaks
          }
        }
      }
      subArea.hasDates = saDateCount > 0
    }
  }

  // -------- Operating Notes ----------

  // Use this to configure which notes show below the subareas, and within each subarea
  // and in what order. Note that "openNote" appears separately above subareas
  const notesList = [
    { noteVar: "generalNote", display: "" },
    { noteVar: "serviceNote", display: "" },
    { noteVar: "reservationsNotes", display: "Reservations Note" },
    { noteVar: "offSeasonNote", display: "Winter Note" },
  ]

  // -------- Capacity Counts ----------

  const countsList = [
    // Use this to configure which counts show and in what order
    // Don't show if isActive is false
    {
      display: "reservable frontcountry campsites",
      countVar: "reservableSites",
      isActive: true,
    },
    {
      display: "vehicle-accessible campsites",
      countVar: "vehicleSites",
      isActive: true,
    },
    {
      display: "double campsites",
      countVar: "doubleSites",
      isActive: true,
    },
    {
      display: "group campsites",
      countVar: "groupSites",
      isActive: true,
    },
    {
      display: "walk-in campsites",
      countVar: "walkInSites",
      isActive: true,
    },
    {
      display: "backcountry campsites",
      countVar: "backgrountrySites",
      isActive: true,
    },
    {
      display: "wilderness campsites",
      countVar: "wildernessSites",
      isActive: true,
    },
    {
      display: "boat-accessible campsites",
      countVar: "boatAccessSites",
      isActive: true,
    },
    {
      display: "horse-accessible",
      countVar: "horseSites",
      isActive: true,
    },
    {
      display: "RV-accessible campsites",
      countVar: "rvSites",
      isActive: true,
    },
    {
      display: "pull-through campsites",
      countVar: "pullThroughSites",
      isActive: true,
    },
    {
      display: "campsites with electrical hook-ups",
      countVar: "electrifiedSites",
      isActive: true,
    },
    {
      display: "long-stay campsites",
      countVar: "longStaySites",
      isActive: true,
    },
    { display: "cabins", countVar: "cabins", isActive: true },
    { display: "huts", countVar: "huts", isActive: true },
    { display: "yurts", countVar: "yurts", isActive: true },
    { display: "shelters", countVar: "shelters", isActive: true },
    { display: "boat launches", countVar: "boatLaunches", isActive: true },
    {
      display: "first-come, first-served frontcountry campsites",
      countVar: "nonReservableSites",
      isActive: false,
    },
    {
      display: "reservable vehicle-accessible campsites",
      countVar: "vehicleSitesReservable",
      isActive: false,
    },
    {
      display: "reservable RV-accessible campsites",
      countVar: "rvSitesReservable",
      isActive: false,
    },
    { display: "TOTAL", countVar: "totalCapacity", isActive: false },
  ]

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
                .filter(subArea => subArea.isActive && subArea.hasDates)
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
                        {subArea.serviceDates && (
                          <p>Main Camping Season: {subArea.serviceDates}</p>
                        )}
                        {subArea.resDates && (
                          <p>Reservable dates: {subArea.resDates}</p>
                        )}
                        {subArea.offSeasonDates && (
                          <p>Off-season camping: {subArea.offSeasonDates}</p>
                        )}
                        {subArea.facilityName && (
                          <p>
                            Facility type: &nbsp;
                            <a href={"#" + subArea.facilityType.facilityCode}>
                              {subArea.facilityName}
                            </a>
                          </p>
                        )}
                        {notesList
                          .filter(note => subArea[note.noteVar])
                          .map((note, index) => (
                            <div key={index} className="mb-2">
                              {note.display && <>{note.display}: </>}{" "}
                              <HTMLArea isVisible={true}>
                                {subArea[note.noteVar]}
                              </HTMLArea>
                            </div>
                          ))}
                        {countsList
                          .filter(
                            count =>
                              subArea[count.countVar] &&
                              subArea[count.countVar] !== "0" &&
                              count.isActive
                          )
                          .map((count, index) => (
                            <div key={index} className="park-operation-count">
                              Number of {count.display}:{" "}
                              {subArea[count.countVar] === "*"
                                ? "undesignated"
                                : subArea[count.countVar]}
                            </div>
                          ))}
                      </div>
                    </Accordion.Collapse>
                  </Accordion>
                ))}
            </>
          )}
          {notesList
            .filter(note => parkOperation[note.noteVar])
            .map((note, index) => (
              <div key={index} className="mb-2">
                {note.display && <>{note.display}: </>}{" "}
                <HTMLArea isVisible={true}>
                  {parkOperation[note.noteVar]}
                </HTMLArea>
              </div>
            ))}

          <div className="park-operation-counts my-3">
            {countsList
              .filter(
                count =>
                  parkOperation[count.countVar] &&
                  parkOperation[count.countVar] !== "0" &&
                  parkOperation.isActive
              )
              .map((count, index) => (
                <div key={index} className="park-operation-count">
                  Total number of {count.display}:{" "}
                  {parkOperation[count.countVar] === "*"
                    ? "undesignated"
                    : parkOperation[count.countVar]}
                </div>
              ))}
          </div>
        </Col>
      </Row>
      <div className="m-3">&nbsp;</div>
    </div>
  )
}
