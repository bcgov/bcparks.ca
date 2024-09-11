import React from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"

import HTMLArea from "../HTMLArea"
import FontAwesome from "../fontAwesome"
import { countsList } from "../../utils/constants"

export default function SubArea({ data, showHeading }) {

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
              </div>
            )}
            {data.resDates.length > 0 && (
              <div className="subarea-list">
                <h4 className="mt-3">Booking required</h4>
                <ul>
                  {data.resDates.map((dateRange, index) =>
                    <li key={index}>{dateRange}</li>
                  )}
                </ul>
              </div>
            )}
            <div className="subarea-list">
              <h4 className="mt-3">Winter season</h4>
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
      {subAreasNotesList
        .filter(note => data[note.noteVar])
        .map((note, index) => (
          <Row key={index} className="subarea-container">
            <Col xs={12}>
              <div className="subarea-list">
                {note.display && (
                  <h4 className="mt-3">
                    {note.display}
                  </h4>
                )}
                <HTMLArea isVisible={true}>
                  {data[note.noteVar]}
                </HTMLArea>
              </div>
            </Col>
          </Row>
        ))}
    </div>
  )
}