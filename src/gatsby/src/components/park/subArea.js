import React from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"

import HtmlContent from "../htmlContent"
import FontAwesome from "../fontAwesome"
import { countsList } from "../../utils/constants"
import { formattedTime } from "../../utils/parkDatesHelper"

export default function SubArea({ data, showHeading }) {

  const subAreasNotesList = [
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

  const renderGateTimes = subArea => {
    if (!subArea) return null
    const {
      hasGate,
      gateOpenTime,
      gateCloseTime,
      gateOpensAtDawn,
      gateClosesAtDusk,
      gateOpen24Hours,
      gateNote,
    } = subArea

    if (!hasGate) return null
    let message = ""
    if (gateOpen24Hours) {
      message += "Gates are open 24 hours a day."
    } else if (
      (gateOpenTime || gateOpensAtDawn) &&
      (gateCloseTime || gateClosesAtDusk)
    ) {
      message += `Gates are open from ${
        gateOpensAtDawn ? "dawn" : formattedTime(gateOpenTime)
      } to ${
        gateClosesAtDusk ? "dusk" : formattedTime(gateCloseTime)
      }, daily.`
    }
    return (
      <>
        {message}
        {gateNote && <HtmlContent>{gateNote}</HtmlContent>}
      </>
    )
  }

  return (
    <div className="accordion-content">
      {showHeading && (<h4>{data.parkSubArea}</h4>)}
      <Row className="subarea-container">
        <Col className="subarea-container--left" xs={12} lg={6}>
          <div className="subarea-icon">
            <FontAwesomeIcon icon={faCalendar} />
          </div>
          <div className="subarea-lists">
            {data.serviceDates.length > 0 && (
              <div className="subarea-list">
                <h4>Operating season</h4>
                <ul>
                  {data.serviceDates.map((dateRange, index) =>
                    <li key={index}>{dateRange}</li>
                  )}
                </ul>
                <small>{renderGateTimes(data)}</small>
              </div>
            )}
            {data.resDates.length > 0 && (
              <div className="subarea-list">
                <h4>Booking available</h4>
                <ul>
                  {data.resDates.map((dateRange, index) =>
                    <li key={index}>{dateRange}</li>
                  )}
                </ul>
              </div>
            )}
            <div className="subarea-list">
              <h4>Winter season</h4>
              {data.offSeasonDates.length > 0 ? (
                <ul>
                  {data.offSeasonDates.map((dateRange, index) =>
                    <li key={index}>{dateRange}</li>
                  )}
                </ul>
              ) : (
                data.operationDates.length > 0 ? (
                  <>
                    {data.operationDates[0].toLowerCase().includes("year-round") ?
                      "Limited services" : "No services"}
                  </>
                ) : (
                  <>Not known</>
                )
              )}
            </div>
          </div>
        </Col>
        {countsList
          .filter(count => isShown(count, data)).length > 0 && (
            <Col className="subarea-container--right" xs={12} lg={6}>
              <div className="subarea-icon">
                <FontAwesome icon="campground" />
              </div>
              <div className="subarea-list">
                <h4>Number of campsites</h4>
                <ul>
                  {countsList
                    .filter(count => isShown(count, data))
                    .map((count, index) => (
                      <li key={index}>
                        {count.display}:{" "}
                        {data[count.countVar]}
                      </li>
                    ))}
                </ul>
              </div>
            </Col>
          )}
      </Row>
      <Row className="subarea-container mt-3">
        <Col>
          {subAreasNotesList
            .filter(note => data[note.noteVar])
            .map((note, index) => (
              <div key={index} className="subarea-list subarea-note">
                {note.display && (
                  <h4>{note.display}</h4>
                )}
                <HtmlContent>
                  {data[note.noteVar]}
                </HtmlContent>
              </div>
            ))}
        </Col>
      </Row>
    </div>
  )
}