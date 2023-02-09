import React, { useState } from "react"
import { navigate } from "gatsby"
import Accordion from "react-bootstrap/Accordion"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"

import Heading from "./heading"
import HtmlContent from "./htmlContent"
import StaticIcon from "./staticIcon"

import "../../styles/cmsSnippets/parkInfoPage.scss"

function toCamping() {
  navigate("https://camping.bcparks.ca/")
}

export default function CampingDetails({ data }) {
  const activeCampings = data.activeCampings
  const parkOperation = data.parkOperation
  const subAreas = data.subAreas || []
  subAreas.sort((a, b) => (a.parkSubArea >= b.parkSubArea ? 1 : -1))
  const [reservationsExpanded, setReservationsExpanded] = useState(false)
  const [expanded, setExpanded] = useState(
    Array(activeCampings.length).fill(false)
  )

  if (activeCampings.length === 0) return null

  const toggleExpand = index => {
    expanded[index] = !expanded[index]
    setExpanded([...expanded])
  }

  const toggleReservations = () => {
    setReservationsExpanded(!reservationsExpanded)
  }

  // -------- Capacity Counts ----------
  const countsList = [
    // Use this to configure which counts show and in what order
    // Don't show if isActive is false
    {
      display: "Reservable frontcountry sites",
      countVar: "reservableSites",
      isActive: true,
    },
    {
      display: "Vehicle-accessible sites",
      countVar: "vehicleSites",
      isActive: true,
    },
    {
      display: "Double sites",
      countVar: "doubleSites",
      isActive: true,
    },
    {
      display: "Group sites",
      countVar: "groupSites",
      isActive: true,
    },
    {
      display: "Walk-in sites",
      countVar: "walkInSites",
      isActive: true,
    },
    {
      display: "Backcountry sites",
      countVar: "backcountrySites",
      isActive: true,
    },
    {
      display: "Wilderness sites",
      countVar: "wildernessSites",
      isActive: true,
    },
    {
      display: "Boat-accessible sites",
      countVar: "boatAccessSites",
      isActive: true,
    },
    {
      display: "Horse-accessible sites",
      countVar: "horseSites",
      isActive: true,
    },
    {
      display: "RV-accessible sites",
      countVar: "rvSites",
      isActive: true,
    },
    {
      display: "Pull-through sites",
      countVar: "pullThroughSites",
      isActive: true,
    },
    {
      display: "Sites with electrical hook-ups",
      countVar: "electrifiedSites",
      isActive: true,
    },
    {
      display: "Long-stay sites",
      countVar: "longStaySites",
      isActive: true,
    },
    { display: "Cabins", countVar: "cabins", isActive: true },
    { display: "Huts", countVar: "huts", isActive: true },
    { display: "Yurts", countVar: "yurts", isActive: true },
    { display: "Shelters", countVar: "shelters", isActive: false },
    { display: "Boat launches", countVar: "boatLaunches", isActive: false },
    {
      display: "First-come, first-served frontcountry sites",
      countVar: "nonReservableSites",
      isActive: false,
    },
    {
      display: "Reservable vehicle-accessible sites",
      countVar: "vehicleSitesReservable",
      isActive: false,
    },
    {
      display: "Reservable RV-accessible sites",
      countVar: "rvSitesReservable",
      isActive: false,
    },
    { display: "TOTAL", countVar: "totalCapacity", isActive: false },
  ]

  const isShown = (count, countGroup) => {
    return countGroup[count.countVar] &&
      countGroup[count.countVar] !== "0" &&
      countGroup[count.countVar] !== "*" &&
      count.isActive;
  }

  return (
    <div className="mb-5">
      <Row
        id="park-camping-details-container"
        className="anchor-link d-flex justify-content-between"
      >
        {data.hasReservations && (
          <Col
            lg={{ span: 4, order: "last" }}
            xl={3}
            md={{ span: 12, order: "first" }}
            className="mb-3"
          >
            <button
              className="btn btn-warning btn-block booking-button p-2"
              onClick={() => toCamping()}
            >
              Book a campsite
            </button>
          </Col>
        )}
        <Col md={{ order: "last" }} lg={{ order: "first" }}>
          <Heading>Camping</Heading>
        </Col>
      </Row>
      {parkOperation &&
      <Row>
        <Col>
          <dl>
            {countsList
              .filter(
                count =>
                  isShown(count, parkOperation)).length > 0
              && subAreas
                .filter(subArea => subArea.isActive).length !== 1
              && (<>
                <dt>Total number of campsites</dt>
                {countsList
                  .filter(count => isShown(count, parkOperation))
                  .map((count, index) => (
                    <dd key={index} className="mb-0">
                      Total {count.display.toLowerCase()}:{" "}
                      {parkOperation[count.countVar]}
                    </dd>
                  ))}
              </>
              )}
          </dl>
        </Col>
      </Row>
      }
      <Row>
        <Col>
          {activeCampings.length > 0 && (
            <div id="park-camping-list-container" className="anchor-link">
              {data.reservations && (
                <div key="reservation">
                  <Accordion
                    key="reservations"
                    aria-controls="reservations"
                    className="park-details mb-2"
                  >
                    <Accordion.Toggle
                      as={Container}
                      eventKey="0"
                      id="panel1a-header"
                      onClick={() => toggleReservations()}
                    >
                      <div className="d-flex justify-content-between p-3 accordion-toggle">
                        <HtmlContent className="accordion-header pl-2">
                          Reservations
                        </HtmlContent>
                        <div className="d-flex align-items-center expand-icon">
                          <i
                            className={
                              (reservationsExpanded ? "open " : "close ") +
                              "fa fa-angle-down mx-3"
                            }
                          ></i>
                        </div>
                      </div>
                    </Accordion.Toggle>

                    <Accordion.Collapse eventKey="0">
                      <div className="p-3 pl-5">
                        <HtmlContent>{data.reservations}</HtmlContent>
                      </div>
                    </Accordion.Collapse>
                  </Accordion>
                </div>
              )}
            </div>
          )}
        </Col>
      </Row>
      <Row>
        <Col>
          {activeCampings.map((camping, index) => (
            <Accordion
              key={"camping" + index}
              className="park-details mb-2"
            >
              <Accordion.Toggle
                as={Container}
                aria-controls={camping?.activityType?.activityName || camping?.facilityType?.facilityName}
                eventKey="0"
                id={index}
                onClick={() => toggleExpand(index)}
              >
                <div className="d-flex justify-content-between p-3 accordion-toggle">
                  <div className="d-flex justify-content-left align-items-center pl-2">
                    <StaticIcon name={camping?.activityType?.icon || camping?.facilityType?.icon} size={48} />
                    <HtmlContent className="pl-3 accordion-header">
                      {camping?.activityType?.activityName || camping?.facilityType?.facilityName}
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
                  <HtmlContent>{camping.description}</HtmlContent>
                </div>
              </Accordion.Collapse>
            </Accordion>
          ))}
        </Col>
      </Row>
    </div>
  )
}
