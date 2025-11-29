import React from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Tooltip from "react-bootstrap/Tooltip"
import OverlayTrigger from "react-bootstrap/OverlayTrigger"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"

import HtmlContent from "../htmlContent"
import FontAwesome from "../fontAwesome"
import { countsList } from "../../utils/constants"
import { formattedTime } from "../../utils/parkDatesHelper"

const DateTypeTooltip = ({ dateType, description }) => {
  return (
  <OverlayTrigger
    placement="top"
    overlay={
      <Tooltip id={`${dateType}-tooltip`}>
        {description}
      </Tooltip>
    }
  >
    <button className="btn-tooltip btn">
      <FontAwesome icon="generic-information" />
    </button>
  </OverlayTrigger>
  )
}

export default function ParkFeature({ data, showHeading = false }) {
  const reservationName = 
    data.hasBackcountryReservations ? "Reservations required" : "Reservations"
  const reservationDescription =
    data.hasBackcountryReservations ?
    "Reservations must be made in advance. First come, first served camping is not available." : 
    "Reservations are highly recommended. You can book up to four months in advance."

  const parkFeatureNotesList = [
    { noteVar: "operationNote", display: "Operation note" },
    { noteVar: "reservationNote", display: "Booking note" },
    { noteVar: "offSeasonNote", display: "Off-season note" },
    { noteVar: "registrationNote", display: "Registration note" },
  ]

  const isShown = (count, countGroup) => {
    return countGroup[count.countVar] &&
      countGroup[count.countVar] !== "0" &&
      countGroup[count.countVar] !== "*" &&
      count.isActive;
  }

  const renderGateTimes = gate => {
    if (!gate) return null
    const {
      hasGate,
      gateOpenTime,
      gateCloseTime,
      gateOpensAtDawn,
      gateClosesAtDusk,
      gateOpen24Hours,
      gateNote,
    } = gate

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
    <div>
      <Row className="subarea-container">
        <Col className="subarea-container--left" xs={12} lg={6}>
          <div className="subarea-icon">
            <FontAwesomeIcon icon={faCalendar} />
          </div>
          <div className="subarea-lists">
            {showHeading && (<h4>{data.displayName}</h4>)}
            {data.operationDates.length > 0 && (
              <div className="subarea-list">
                <h4>Operating season</h4>
                <ul>
                  {data.operationDates.map((dateRange, index) =>
                    <li key={index}>{dateRange}</li>
                  )}
                </ul>
                <small>{renderGateTimes(data.displayGate)}</small>
              </div>
            )}
            {data.reservationDates.length > 0 && (
              <div className="subarea-list">
                <h4>
                  {reservationName}{" "}
                  <DateTypeTooltip
                    dateType="reservation"
                    description={reservationDescription}
                  />
                </h4>
                <ul>
                  {data.reservationDates.map((dateRange, index) =>
                    <li key={index}>{dateRange}</li>
                  )}
                </ul>
              </div>
            )}
            {data.backcountryDates.length > 0 && (
              <div className="subarea-list">
                <h4>Registration required</h4>
                <ul>
                  {data.backcountryDates.map((dateRange, index) =>
                    <li key={index}>{dateRange}</li>
                  )}
                </ul>
              </div>
            )}
            {data.winterFeeDates.length > 0 && (
              <div className="subarea-list">
                <h4>
                  Winter rate{" "}
                  <DateTypeTooltip
                    dateType="winter-rate"
                    description="Shoulder season with reduced fees and services" 
                  />
                </h4>
                <ul>
                  {data.winterFeeDates.map((dateRange, index) =>
                    <li key={index}>{dateRange}</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </Col>
        {countsList
          .filter(count => isShown(count, data)).length > 0 && (
            <Col className="subarea-container--right" xs={12} lg={6}>
              <div className="subarea-icon">
                <FontAwesome icon="campground" />
              </div>
              <div className="subarea-lists">
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
              </div>
            </Col>
          )}
      </Row>
      <Row className="subarea-container mt-3">
        <Col>
          {parkFeatureNotesList
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