import React, { useState, useEffect, useMemo, useCallback } from "react"
import _ from "lodash"
import Accordion from "react-bootstrap/Accordion"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"

import HtmlContent from "../htmlContent"
import SubArea from "./subArea"
import CustomToggle from "./customToggle"
import { trackSnowplowEvent } from "../../utils/snowplowHelper"

export const ReservationButtons = ({ campingTypeCode, parkOperation }) => {
  const reservationUrlRules = {
    "backcountry-camping": {
      buttons: [
        {
          label: "Register for permit",
          fieldName: "backcountryPermitUrl"
        },
        {
          label: "Make a reservation",
          fieldName: "backcountryReservationUrl"
        },
        {
          label: "Reserve canoe circuit",
          fieldName: "canoeCircuitReservationUrl"
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
          label: "Book campsite",
          fieldName: "frontcountryReservationUrl"
        }
      ]
    },
    "group-camping": {
      buttons: [
        {
          label: "Book groupsite",
          fieldName: "frontcountryGroupReservationUrl"
        },
        {
          label: "Book groupsite",
          fieldName: "backcountryGroupReservationUrl"
        }
      ]
    },
    "cabins-huts": {
      buttons: [
        {
          label: "Book cabin",
          fieldName: "frontcountryCabinReservationUrl"
        },
        {
          label: "Book shelter",
          fieldName: "backcountryShelterReservationUrl"
        }
      ]
    }
  }

  const getReservationButtons = (code) => {
    if (reservationUrlRules[code]) {
      let buttons = reservationUrlRules[code].buttons
      if (code === "group-camping" && parkOperation) {
        const hasFrontcountry = parkOperation.frontcountryGroupReservationUrl
        // Remove backcountry group button if frontcountry group url exists
        if (hasFrontcountry) {
          buttons = buttons.filter(button => button.fieldName !== "backcountryGroupReservationUrl")
        }
      }
      return buttons
    }
    return []
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
  const parkSubAreaId = _.kebabCase(subArea.parkSubArea)

  return (
    <Accordion
      className={`dates-accordion is-open--${openAccordions[eventKey]}`}
    >
      {itemCount > 1 ? (
        <CustomToggle
          eventKey={eventKey}
          toggleId={parkSubAreaId}
          ariaControls={subArea.parkSubArea}
          handleClick={() => toggleAccordion(eventKey, subArea.parkSubArea)}
        >
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
        </CustomToggle>
      ) : (
        <div id={parkSubAreaId} className="accordion-toggle">
          <HtmlContent className="accordion-header">
            {subArea.parkSubArea}
          </HtmlContent>
        </div>
      )}
      <Accordion.Collapse eventKey={eventKey} in={openAccordions[eventKey]}>
        <SubArea data={subArea} />
      </Accordion.Collapse>
    </Accordion>
  )
}

export default function ParkDates({ data, parkOperation }) {
  const subAreas = data.subAreas.sort((a, b) => (a.parkSubArea >= b.parkSubArea ? 1 : -1))
  const [hash, setHash] = useState("")
  const [openAccordions, setOpenAccordions] = useState({})

  const expandLabel = (campingType) => {
    return allExpanded ?
      `Collapse all ${campingType.toLowerCase()}` : `Expand all ${campingType.toLowerCase()}`
  }

  const toggleAccordion = (index, subAreaName) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
    trackSnowplowEvent(
      openAccordions[index] ? "accordion_close" : "accordion_open",
      null,
      null,
      null,
      subAreaName,
      {}
    )
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

  const checkHash = useCallback(() => {
    // Check hash in url
    // if we find a matching parkSubArea, open that subArea accordion
    if (typeof window !== "undefined") {
      const windowHash = window?.location?.hash
      if (!windowHash || windowHash === hash) return
      const matchingSubAreaIndex = subAreas.findIndex(
        (subArea) => windowHash === "#" + _.kebabCase(subArea.parkSubArea)
      )
      if (matchingSubAreaIndex === -1) return
      if (!openAccordions[matchingSubAreaIndex]) {
        setOpenAccordions((prev) => ({
          ...prev,
          [matchingSubAreaIndex]: true,
        }))
      }
      setHash(windowHash)
    }
  }, [subAreas, hash, openAccordions])

  useEffect(() => {
    window.addEventListener("hashchange", function (e) {
      checkHash()
    })
    checkHash()
  }, [checkHash])

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
          <Row className="align-items-center my-4">
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
                    aria-label={expandLabel(data.campingType.pluralName)}
                    className="btn btn-link expand-link expand-icon"
                  >
                    {expandLabel(data.campingType.pluralName)}{" "}
                    {allExpanded ?
                      <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />
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