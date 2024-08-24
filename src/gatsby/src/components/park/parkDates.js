import React, { useState, useEffect, useMemo } from "react"
import Accordion from "react-bootstrap/Accordion"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"

import HtmlContent from "./htmlContent"
import SubArea from "./subArea"

export const ReservationButtons = ({ campingTypeCode, parkOperation }) => {
  const reservationUrlRules = {
    "backcountry-camping": {
      buttons: [
        {
          label: "Get permit",
          fieldName: "backcountryPermitUrl"
        },
        {
          label: "Make a reservation",
          fieldName: "backcountryReservationUrl"
        },
        {
          label: "Reserve canoe circuit",
          fieldName: "canoeCircuitReservationUrl"
        },
        {
          label: "Book groupsite",
          fieldName: "backcountryGroupReservationUrl"
        },
        {
          label: "Book shelter",
          fieldName: "backcountryShelterReservationUrl"
        }
      ]
    },
    "wilderness-camping": {
      buttons: [
        {
          label: "Book wilderness area",
          fieldName: "backcountryWildernessReservationUrl"
        }
      ]
    },
    "frontcountry-camping": {
      buttons: [
        {
          label: "Book camping",
          fieldName: "frontcountryReservationUrl"
        }
      ]
    },
    "group-camping": {
      buttons: [
        {
          label: "Book groupsite",
          fieldName: "frontcountryGroupReservationUrl"
        }
      ]
    },
    "cabins-huts": {
      buttons: [
        {
          label: "Book cabin",
          fieldName: "frontcountryCabinReservationUrl"
        }
      ]
    }
  }

  const getReservationButtons = (code) => {
    if (reservationUrlRules[code]) {
      return reservationUrlRules[code].buttons
    }
  }

  return (
    getReservationButtons(campingTypeCode)?.length > 0 &&
    getReservationButtons(campingTypeCode).map((button, index) => (
      parkOperation && parkOperation[button.fieldName] && (
        <a
          key={index}
          href={parkOperation[button.fieldName]}
          className="btn btn-secondary"
        >
          {button.label}
        </a>
      )
    ))
  )
}

export const AccordionList = ({ eventKey, subArea, openAccordions, toggleAccordion, itemCount }) => {
  return (
    <Accordion
      className={`dates-accordion is-open--${openAccordions[eventKey]}`}
    >
      {itemCount > 1 ?
        (<Accordion.Toggle
          as={"div"}
          aria-controls={subArea.parkSubArea}
          eventKey={eventKey}
          onClick={() => toggleAccordion(eventKey)}
        >
          <div className="d-flex justify-content-between accordion-toggle">
            <div className="d-flex align-items-center">
              <HtmlContent className="accordion-header">
                {subArea.parkSubArea}
              </HtmlContent>
            </div>
            <div className="d-flex align-items-center">
              {openAccordions[eventKey] ?
                <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />
              }
            </div>
          </div>
        </Accordion.Toggle>) :
        (
          <div className="accordion-toggle">
            <HtmlContent className="accordion-header">
              {subArea.parkSubArea}
            </HtmlContent>
          </div>
        )
      }
      <Accordion.Collapse eventKey={eventKey} in={openAccordions[eventKey]}>
        <SubArea data={subArea} />
      </Accordion.Collapse>
    </Accordion>
  )
}

export default function ParkDates({ data, parkOperation }) {
  const subAreas = data.subAreas.sort((a, b) => (a.parkSubArea >= b.parkSubArea ? 1 : -1))
  const [openAccordions, setOpenAccordions] = useState({})

  const toggleAccordion = (index) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
  }

  const toggleExpandAll = () => {
    const newExpandAll = !allExpanded
    const newOpenAccordions = subAreas.reduce((acc, _, index) => {
      acc[index] = newExpandAll
      return acc
    }, {})
    setOpenAccordions(newOpenAccordions)
  }

  const allExpanded = useMemo(() => {
    return subAreas.length > 0 &&
      Object.keys(openAccordions).length === subAreas.length &&
      Object.values(openAccordions).every((isOpen) => isOpen)
  }, [openAccordions, subAreas.length])

  useEffect(() => {
    if (subAreas.length === 1) {
      setOpenAccordions({ 0: true })
    }
  }, [subAreas.length])

  if (subAreas.length === 0) return null

  return (
    <>
      {subAreas.length > 0 && (
        <>
          <Row className="align-items-center mt-5 mb-4">
            <Col>
              <h4 className="mb-0">
                {data.campingType.pluralName}
              </h4>
            </Col>
            <Col className="reservation-button-container" xs="12" sm="auto">
              <ReservationButtons campingTypeCode={data.campingType.campingTypeCode} parkOperation={parkOperation} />
            </Col>
          </Row>
          <Row className="mb-5">
            <Col>
              <>
                {subAreas.length > 1 && (
                  <button
                    onClick={toggleExpandAll}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        toggleExpandAll()
                      }
                    }}
                    className="btn btn-link expand-link expand-icon"
                  >
                    {allExpanded ?
                      <>Collapse all <FontAwesomeIcon icon={faChevronUp} /></>
                      :
                      <>Expand all <FontAwesomeIcon icon={faChevronDown} /></>
                    }
                  </button>
                )}
                {subAreas
                  .filter(subArea => subArea.isActive)
                  .map((subArea, index) => (
                    <AccordionList
                      key={index}
                      eventKey={index.toString()}
                      subArea={subArea}
                      openAccordions={openAccordions}
                      toggleAccordion={toggleAccordion}
                      itemCount={subAreas.length}
                    />
                  ))}
              </>
            </Col>
          </Row>
        </>
      )}
    </>
  )
}