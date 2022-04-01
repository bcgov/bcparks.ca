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

  // Use this to configure which notes show below the subareas,
  // and in what order. Note that "openNote" appears separately above subareas
  const notesList = [
    "generalNote",
    "serviceNote",
    "reservationsNotes",
    "offSeasonNote",
  ]

  let notes = []
  for (const nIdx in notesList) {
    const n = notesList[nIdx]
    if (parkOperation[n]) {
      notes.push({ noteType: n, display: parkOperation[n] })
    }
  }

  // -------- Capacity Counts ----------

  const countsList = [
    // Use this to configure which counts show and in what order
    // Don't show if isActive is false
    {
      display: "Total number of wilderness campsites",
      countVar: "wildernessSites",
      isActive: true,
    },
    {
      display: "Total number of backcountry campsites",
      countVar: "backgrountrySites",
      isActive: true,
    },
    {
      display: "Total number of vehicle-accessible campsites",
      countVar: "vehicleSites",
      isActive: true,
    },
    {
      display: "Total number of group campsites",
      countVar: "groupSites",
      isActive: true,
    },
    {
      display: "Total number of RV-accessible campsites",
      countVar: "rvSites",
      isActive: true,
    },
    {
      display: "Total number of reservable frontcountry campsites",
      countVar: "reservableSites",
      isActive: true,
    },
    { display: "", countVar: "totalCapacity", isActive: false },
    { display: "", countVar: "reservableSites", isActive: false },
    { display: "", countVar: "nonReservableSites", isActive: false },
    { display: "", countVar: "doubleSites", isActive: false },
    { display: "", countVar: "pullThroughSites", isActive: false },
    { display: "", countVar: "horseSites", isActive: false },
    { display: "", countVar: "cabins", isActive: false },
    { display: "", countVar: "huts", isActive: false },
    { display: "", countVar: "yurts", isActive: false },
    { display: "", countVar: "shelters", isActive: false },
    { display: "", countVar: "boatLaunches", isActive: false },
    { display: "", countVar: "vehicleSitesReservable", isActive: false },
    { display: "", countVar: "rvSitesReservable", isActive: false },
  ]

  let counts = []
  let asterixFootnote = false // show only if necessary
  for (const cIdx in countsList) {
    const c = countsList[cIdx]
    if (c.isActive) {
      const countVal = parkOperation[c.countVar]
      if (countVal) {
        counts.push({ display: c.display, countVal: countVal })
        if (countVal === "*") {
          // need to explain * as a count
          asterixFootnote = true
        }
      }
    }
  }

  return (
    <div id="park-dates-container" className="anchor-link mb-3">
      <Heading>Dates of Operation</Heading>
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
                      </div>
                    </Accordion.Collapse>
                  </Accordion>
                ))}
            </>
          )}

          {notes.length > 0 && (
            <div className="park-operation-notes mt-3">
              <div className="font-weight-bold">Notes</div>
              {notes.map((note, index) => (
                <div key={index}>
                  {note.noteType === "offSeasonNote" && (
                    <div className="font-weight-bold">Winter Camping</div>
                  )}
                  <div key={index} className="park-operation-note">
                    <HTMLArea isVisible={true}>{note.display}</HTMLArea>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="park-operation-counts my-3">
            {counts.map((count, index) => (
              <div key={index} className="park-operation-count">
                {count.display}: {count.countVal}
              </div>
            ))}
            {asterixFootnote && (
              <div className="">* Number of sites is undesignated</div>
            )}
          </div>
        </Col>
      </Row>
      <div className="m-3">&nbsp;</div>
    </div>
  )
}
