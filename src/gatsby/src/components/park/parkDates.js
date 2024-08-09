import React, { useState, useEffect } from "react"
import { Link as GatsbyLink } from "gatsby"
import Accordion from "react-bootstrap/Accordion"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"

import HtmlContent from "./htmlContent"
import HTMLArea from "../HTMLArea"
import StaticIcon from "./staticIcon"
import { countsList } from "../../utils/constants"
import { datePhrase, processDateRanges, groupSubAreaDates } from "../../utils/parkDatesHelper"

export const AccordionList = ({ eventKey, subArea, open, isShown, subAreasNotesList, toggleAccordion }) => {
  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    setIsShow(open)
  }, [open])

  return (
    <Accordion
      activeKey={isShow ? eventKey : ''}
      className={`is-open--${isShow}`}
    >
      <Accordion.Toggle
        as={"div"}
        aria-controls={subArea.parkSubArea}
        eventKey={eventKey}
        onClick={() => {
          setIsShow(!isShow)
          toggleAccordion(eventKey)
        }}
      >
        <div className="d-flex justify-content-between accordion-toggle">
          <div className="d-flex align-items-center">
            <StaticIcon name={subArea.typeIcon} size={36} />
            <HtmlContent className="accordion-header">
              {subArea.parkSubArea}
            </HtmlContent>
          </div>
          <div className="d-flex align-items-center">
            {isShow ?
              <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />
            }
          </div>
        </div>
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={eventKey}>
        <div className="accordion-content">
          <dl>
            {subArea.typeName && (
              <>
                <dt>Facility type</dt>
                <dd>{subArea.typeName}</dd>
              </>
            )}
            {countsList
              .filter(count => isShown(count, subArea)).length > 0 && (
                <>
                  <dt className="mt-3">Number of campsites</dt>
                  <dd>
                    <ul className="pl-4">
                      {countsList
                        .filter(count => isShown(count, subArea))
                        .map((count, index) => (
                          <li key={index}>
                            {count.display}:{" "}
                            {subArea[count.countVar]}
                          </li>
                        ))}
                    </ul>
                  </dd>
                </>
              )}
            {subArea.serviceDates.length > 0 && (
              <>
                <dt className="mt-3">
                  Main operating season
                </dt>
                <dd>
                  <ul className="pl-4">
                    {subArea.serviceDates.map((dateRange, index) =>
                      <li key={index}>{dateRange}</li>
                    )}
                  </ul>
                </dd>
              </>
            )}
            <>
              <dt className="mt-3">Winter season</dt>
              <dd>
                {subArea.offSeasonDates.length > 0 ? (
                  <ul className="pl-4">
                    {subArea.offSeasonDates.map((dateRange, index) =>
                      <li key={index}>{dateRange}</li>
                    )}
                  </ul>
                ) : (
                  subArea.operationDates.length > 0 ? (
                    <>
                      {subArea.operationDates[0].includes("Year-round") ? "Limited services" : "No services"}
                    </>
                  ) : (
                    <>Not known</>
                  )
                )}
              </dd>
            </>
            {subArea.resDates.length > 0 && (
              <>
                <dt className="mt-3">Booking required</dt>
                <dd>
                  <ul className="pl-4">
                    {subArea.resDates.map((dateRange, index) =>
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
  )
}

export default function ParkDates({ data }) {
  const dataCopy = JSON.parse(JSON.stringify(data)) // deep copy
  const parkOperation = dataCopy.parkOperation || {}
  const parkType = dataCopy.parkType
  const subAreas = dataCopy.subAreas || []
  subAreas.filter(subArea => subArea.isActive).sort((a, b) => (a.parkSubArea >= b.parkSubArea ? 1 : -1))

  const [expanded, setExpanded] = useState(Array(subAreas.length).fill(false))
  const [open, setOpen] = useState(false)

  // Operations record is required, even if subarea records are present
  // If no operations record, show "not available" message
  const hasOperations = parkOperation.isActive // either false, or whole record missing

  // -------- Operating Dates --------

  const thisYear = new Date().getFullYear()

  // Overall operating dates for parks, to display above subareas
  let fmt = "MMMM D, yyyy"  // date format for overall operating dates
  const yr = "year-round" // lowercase for overall operating dates
  const parkOperationDates = dataCopy.parkOperationDates.find(d => d.operatingYear === +thisYear) || {}
  let parkDates = datePhrase(parkOperationDates.gateOpenDate, parkOperationDates.gateCloseDate, fmt, yr, " to ", "")

  // make sure the parkDates is valid
  if (parkDates !== yr && !parkDates.includes(thisYear)) {
    parkDates = "";
  }

  // ---- Subarea Dates -----
  fmt = "MMMM D"

  for (let idx in subAreas) {
    let subArea = subAreas[idx]

    if (subArea.isActive) {

      const facilityType = subArea.parkSubAreaType?.facilityType || {}
      const campingType = subArea.parkSubAreaType?.campingType || {}
      subArea.typeIcon = facilityType.icon || campingType.icon || "";
      subArea.typeName = facilityType.facilityName || campingType.campingTypeName || ""
      subArea = groupSubAreaDates(subArea);

      // get distinct date ranges sorted chronologically
      subArea.operationDates = processDateRanges(subArea.operationDates, fmt, yr, " to ")
      subArea.serviceDates = processDateRanges(subArea.serviceDates, fmt, yr, " to ")
      subArea.resDates = processDateRanges(subArea.resDates, fmt, yr, " to ")
      subArea.offSeasonDates = processDateRanges(subArea.offSeasonDates, fmt, yr, " to ")

      // add a placeholder if no dates are available for the current year
      if (subArea.serviceDates.length === 0
        && subArea.resDates.length === 0
        && subArea.offSeasonDates.length === 0) {
        subArea.serviceDates.push(`${new Date().getFullYear()}: Dates unavailable`)
      }
    }
  }

  // -------- Operating Notes ----------

  // Use this to configure which notes show below the subareas, and within each subarea
  // and in what order. Note that "openNote" appears separately above subareas
  const parkOperationsNotesList = [
    { noteVar: "generalNote", display: "Note" },
    { noteVar: "serviceNote", display: "Service note" },
    { noteVar: "reservationsNote", display: "Booking note" },
    { noteVar: "offSeasonNote", display: "Winter season note" },
  ]

  const subAreasNotesList = [
    { noteVar: "generalNote", display: "Note" },
    { noteVar: "serviceNote", display: "Service note" },
    { noteVar: "reservationNote", display: "Booking note" },
    { noteVar: "offSeasonNote", display: "Winter season note" },
  ]

  const isShown = (count, countGroup) => {
    return countGroup[count.countVar] &&
      countGroup[count.countVar] !== "0" &&
      countGroup[count.countVar] !== "*" &&
      count.isActive;
  }

  const toggleAccordion = (index) => {
    setExpanded(prevStates => {
      const newStates = [...prevStates]
      newStates[index] = !newStates[index]
      return newStates
    })
  }

  useEffect(() => {
    setOpen(expanded.every(state => state))
  }, [expanded])

  useEffect(() => {
    if (subAreas.length === 1) {
      setOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subAreas.length])

  return (
    <div id="park-dates-container" className="anchor-link">
      <h2 className="section-heading">Dates of operation</h2>
      <Row>
        <Col>
          {!hasOperations && (
            <div>
              No dates available
            </div>
          )}
          {hasOperations && (
            <>
              <div className="mb-4">
                <div>
                  <GatsbyLink to="#advisories">Check advisories</GatsbyLink> before visiting.
                  Dates may change without notice.
                </div>
                {parkDates && (
                  <h4 className="my-3">
                    The {parkType} {parkOperation.hasParkGate !== false && "gate"} is open {parkDates}
                  </h4>
                )}
                {!parkDates && (
                  <h4 className="my-3">Operating dates are unavailable</h4>
                )}
                {parkOperation.openNote && (
                  <div className="dates-open-note">
                    <HTMLArea isVisible={true}>
                      {parkOperation.openNote}
                    </HTMLArea>
                  </div>
                )}
              </div>
              {subAreas.length > 1 && (
                <button
                  onClick={() => setOpen(!open)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault()
                      setOpen(!open)
                    }
                  }}
                  className="btn btn-link expand-link expand-icon"
                >
                  {open ?
                    <>Collapse all <FontAwesomeIcon icon={faChevronUp} /></>
                    :
                    <>Expand all <FontAwesomeIcon icon={faChevronDown} /></>
                  }
                </button>
              )}
              {subAreas
                .map((subArea, index) => (
                  <AccordionList
                    key={index}
                    eventKey={index.toString()}
                    subArea={subArea}
                    open={open}
                    isShown={isShown}
                    subAreasNotesList={subAreasNotesList}
                    toggleAccordion={toggleAccordion}
                  />
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
    </div>
  )
}
