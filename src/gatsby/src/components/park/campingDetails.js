import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"
import Accordion from "react-bootstrap/Accordion"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import { Link } from "@mui/material"

import Heading from "./heading"
import HtmlContent from "./htmlContent"
import StaticIcon from "./staticIcon"
import Spacer from "./spacer"

import { countsList } from "../../utils/constants"
import { isNullOrWhiteSpace } from "../../utils/helpers"
import "../../styles/cmsSnippets/parkInfoPage.scss"

function toCamping() {
  navigate("https://camping.bcparks.ca/")
}

export const AccordionList = ({ eventKey, camping, open, hasReservation, reservations }) => {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    setIsShow(open)
  }, [open])

  return (
    hasReservation ? (
      <Accordion
        className="park-details mb-2"
        activeKey={isShow ? eventKey : ''}
      >
        <Accordion.Toggle
          as={Container}
          aria-controls="reservations"
          eventKey={eventKey}
          onClick={() => setIsShow(!isShow)}
        >
          <div
            id="reservations"
            className="d-flex justify-content-between p-3 accordion-toggle"
          >
            <div className="d-flex justify-content-left align-items-center pl-2">
              <StaticIcon name="reservations" size={48} />
              <HtmlContent className="pl-3 accordion-header">
                Reservations
              </HtmlContent>
            </div>
            <div className="d-flex align-items-center expand-icon">
              <i
                className={
                  (isShow ? "open " : "close ") +
                  "fa fa-angle-down mx-3"
                }
              ></i>
            </div>
          </div>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={eventKey}>
          <div className="p-4">
            <HtmlContent>{reservations}</HtmlContent>
          </div>
        </Accordion.Collapse>
      </Accordion>
    ) : (
      <Accordion
        className="park-details mb-2"
        activeKey={isShow ? eventKey : ''}
      >
        <Accordion.Toggle
          as={Container}
          aria-controls={camping?.activityType?.activityName || camping?.facilityType?.facilityName}
          eventKey={eventKey}
          onClick={() => setIsShow(!isShow)}
        >
          <div
            id={camping?.activityType?.activityCode || camping?.facilityType?.facilityCode}
            className="d-flex justify-content-between p-3 accordion-toggle"
          >
            <div className="d-flex justify-content-left align-items-center pl-2">
              <StaticIcon name={camping?.activityType?.icon || camping?.facilityType?.icon} size={48} />
              <HtmlContent className="pl-3 accordion-header">
                {camping?.activityType?.activityName || camping?.facilityType?.facilityName}
              </HtmlContent>
            </div>
            <div className="d-flex align-items-center expand-icon">
              <i
                className={
                  (isShow ? "open " : "close ") +
                  "fa fa-angle-down mx-3"
                }
              ></i>
            </div>
          </div>
        </Accordion.Toggle>
        <Accordion.Collapse eventKey={eventKey}>
          <div className="p-4">
            <HtmlContent>
              {!isNullOrWhiteSpace(camping.description.data) ?
                camping.description.data : (
                  camping?.activityType?.defaultDescription.data || camping?.facilityType?.defaultDescription.data
                )
              }
            </HtmlContent>
          </div>
        </Accordion.Collapse>
      </Accordion>
    )
  )
}

export default function CampingDetails({ data }) {
  const activeCampings = data.activeCampings
  const parkOperation = data.parkOperation
  const reservations = data.reservations.data.reservations
  const subAreas = data.subAreas || []
  subAreas.sort((a, b) => (a.parkSubArea >= b.parkSubArea ? 1 : -1))
  const [open, setOpen] = useState(false)

  if (activeCampings.length === 0) return null

  const isShown = (count, countGroup) => {
    return countGroup[count.countVar] &&
      countGroup[count.countVar] !== "0" &&
      countGroup[count.countVar] !== "*" &&
      count.isActive;
  }

  const checkCountDisplay = (text) => {
    const newText = text.replace("rv-accessible", "RV-accessible")
    return newText
  }

  return (
    <div>
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
              Book camping
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
                        Total {checkCountDisplay(count.display.toLowerCase())}:{" "}
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
          <Link
            role="link"
            tabIndex="0"
            underline="hover"
            onClick={() => setOpen(!open)}
            className="expand-link expand-icon"
          >
            {open ? "Collapse all" : "Expand all"}
            <i className={`fa fa-angle-down ${open ? "open" : "close"}`}></i>
          </Link>
          {activeCampings.length > 0 &&
            !isNullOrWhiteSpace(reservations) && (
              <AccordionList
                eventKey="0"
                open={open}
                hasReservation={true}
                reservations={reservations}
              />
            )
          }
          {activeCampings.map((camping, index) => (
            <AccordionList
              key={index}
              eventKey={index.toString()}
              camping={camping}
              open={open}
            />
          ))}
        </Col>
      </Row>
      <Spacer />
    </div>
  )
}
