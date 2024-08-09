import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"
import Accordion from "react-bootstrap/Accordion"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"

import HtmlContent from "./htmlContent"
import StaticIcon from "./staticIcon"
import { countsList } from "../../utils/constants"
import { isNullOrWhiteSpace } from "../../utils/helpers"
import "../../styles/cmsSnippets/parkInfoPage.scss"

export const AccordionList = ({ eventKey, camping, open, hasReservation, reservations, toggleAccordion }) => {
  const [isShow, setIsShow] = useState(false)

  useEffect(() => {
    setIsShow(open)
  }, [open])

  return (
    hasReservation ? (
      <Accordion
        activeKey={isShow ? eventKey : ''}
        className={`is-open--${isShow}`}
      >
        <Accordion.Toggle
          as={"div"}
          aria-controls="reservations"
          eventKey={eventKey}
          onClick={() => {
            setIsShow(!isShow)
            toggleAccordion(eventKey)
          }}
        >
          <div
            id="reservations"
            className="d-flex justify-content-between accordion-toggle"
          >
            <div className="d-flex align-items-center">
              <StaticIcon name="reservations" size={36} />
              <div className="accordion-header">
                Reservations
              </div>
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
            <HtmlContent>{reservations}</HtmlContent>
          </div>
        </Accordion.Collapse>
      </Accordion>
    ) : (
      <Accordion
        activeKey={isShow ? eventKey : ''}
        className={`is-open--${isShow}`}
      >
        <Accordion.Toggle
          as={"div"}
          aria-controls={camping?.campingType?.campingTypeName}
          eventKey={eventKey}
          onClick={() => {
            setIsShow(!isShow)
            toggleAccordion(eventKey)
          }}
        >
          <div
            id={camping?.campingType?.campingTypeCode}
            className="d-flex justify-content-between accordion-toggle"
          >
            <div className="d-flex align-items-center">
              <StaticIcon name={camping?.campingType?.icon} size={36} />
              <HtmlContent className="accordion-header">
                {camping?.campingType?.campingTypeName}
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
            <HtmlContent>
              {!isNullOrWhiteSpace(camping.description.data) ?
                camping.description.data : (camping?.campingType?.defaultDescription.data)
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
  const hasReservations = !isNullOrWhiteSpace(reservations) 

  const [expanded, setExpanded] = useState(Array(activeCampings.length + (hasReservations ? 1 : 0)).fill(false))
  const [open, setOpen] = useState(false)

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

  const checkCountDisplay = (text) => {
    const newText = text.replace("rv-accessible", "RV-accessible")
    return newText
  }

  const toFrontCountryReservations = () => {
    const reservationsURL = "https://camping.bcparks.ca"
    const parkReservationsURL = parkOperation?.reservationUrl || reservationsURL
    navigate(parkReservationsURL)
  }

  useEffect(() => {
    setOpen(expanded.every(state => state))
  }, [expanded])

  useEffect(() => {
    if (activeCampings.length === 1 && !hasReservations) {
      setOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeCampings.length, reservations])

  if (activeCampings.length === 0) return null

  return (
    <div id="camping" className="anchor-link">
      <Row>
        <Col>
          {/* id="park-camping-details-container" should be removed once it's removed from the contents */}
          <h2 id="park-camping-details-container" className="section-heading">
            Camping
          </h2>
        </Col>
        {data.hasReservations && (
          <Col className="mb-3" xs="auto">
            <button
              aria-label="Book camping"
              className="btn btn-secondary"
              onClick={() => toFrontCountryReservations()}
            >
              Book camping
            </button>
          </Col>
        )}
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
          {activeCampings.length > 1 && (
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
          {(activeCampings.length > 0 && hasReservations) && (
              <AccordionList
                eventKey="0"
                open={open}
                hasReservation={true}
                reservations={reservations}
                toggleAccordion={toggleAccordion}
              />
            )
          }
          {activeCampings.map((camping, index) => (
            <AccordionList
              key={index}
              eventKey={(hasReservations ? index + 1 : index).toString()}
              camping={camping}
              open={open}
              toggleAccordion={toggleAccordion}
            />
          ))}
        </Col>
      </Row>
    </div>
  )
}
