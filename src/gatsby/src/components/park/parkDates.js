import React, { useState, useEffect, useMemo, useCallback } from "react"
import _ from "lodash"
import Accordion from "react-bootstrap/Accordion"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"

import HtmlContent from "../htmlContent"
import ParkFeature from "./parkFeature"
import CustomToggle from "./customToggle"
import { trackSnowplowEvent } from "../../utils/snowplowHelper"

export const ReservationButtons = ({ campingTypeCode, parkOperation }) => {
  const reservationUrlRules = {
    "backcountry-camping": {
      buttons: [
        {
          label: "Make reservation",
          fieldName: "backcountryReservationUrl"
        },
        {
          label: "Register for permit",
          fieldName: "backcountryPermitUrl"
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

export const AccordionList = ({ eventKey, feature, openAccordions, toggleAccordion, itemCount }) => {
  const displayName = feature.displayName || ""
  const parkFeatureId = _.kebabCase(displayName)

  return (
    <Accordion
      className={`dates-accordion is-open--${openAccordions[eventKey]}`}
    >
      {itemCount > 1 ? (
        <CustomToggle
          eventKey={eventKey}
          toggleId={parkFeatureId}
          ariaControls={displayName}
          handleClick={() => toggleAccordion(eventKey, displayName)}
        >
          <div className="d-flex align-items-center">
            <HtmlContent className="accordion-header">
              {displayName}
            </HtmlContent>
          </div>
          <div className="d-flex align-items-center">
            {openAccordions[eventKey] ?
              <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />
            }
            </div>
        </CustomToggle>
      ) : (
        <div id={parkFeatureId} className="accordion-toggle">
          <HtmlContent className="accordion-header">
            {displayName}
          </HtmlContent>
        </div>
      )}
      <Accordion.Collapse eventKey={eventKey} in={openAccordions[eventKey]}>
        <div className="accordion-content">
          <ParkFeature data={feature} />
        </div>
      </Accordion.Collapse>
    </Accordion>
  )
}

export default function ParkDates({ data, parkOperation, isLoadingParkFeatures, parkFeaturesLoadError }) {
 const parkFeatures = useMemo(() => {
    return data.parkFeatures || []
  }, [data.parkFeatures])

  const [hash, setHash] = useState("")
  const [openAccordions, setOpenAccordions] = useState({})

  const expandLabel = (campingType) => {
    return allExpanded ?
      `Collapse all ${campingType.toLowerCase()}` : `Expand all ${campingType.toLowerCase()}`
  }

  const toggleAccordion = (index, name) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
    trackSnowplowEvent(
      openAccordions[index] ? "accordion_close" : "accordion_open",
      null,
      null,
      null,
      name,
      {}
    )
  }

  const toggleExpandAll = () => {
    const newExpandAll = !allExpanded
    const newOpenAccordions = parkFeatures.reduce((acc, _, index) => {
      acc[index] = newExpandAll
      return acc
    }, {})
    setOpenAccordions(newOpenAccordions)
  }

  const allExpanded = useMemo(() => {
    return parkFeatures.length > 0 &&
      Object.keys(openAccordions).length === parkFeatures.length &&
      Object.values(openAccordions).every((isOpen) => isOpen)
  }, [openAccordions, parkFeatures.length])

  const checkHash = useCallback(() => {
    // Check hash in url
    // if we find a matching displayName, open that feature accordion
    if (typeof window !== "undefined") {
      const windowHash = window?.location?.hash
      if (!windowHash || windowHash === hash) return
      const matchingFeatureIndex = parkFeatures.findIndex(
        (feature) => windowHash === "#" + _.kebabCase(feature.displayName)
      )
      if (matchingFeatureIndex === -1) return
      if (!openAccordions[matchingFeatureIndex]) {
        setOpenAccordions((prev) => ({
          ...prev,
          [matchingFeatureIndex]: true,
        }))
      }
      setHash(windowHash)
    }
  }, [parkFeatures, hash, openAccordions])

  useEffect(() => {
    window.addEventListener("hashchange", function (e) {
      checkHash()
    })
    checkHash()
  }, [checkHash])

  useEffect(() => {
    if (parkFeatures.length === 1) {
      setOpenAccordions({ 0: true })
    }
  }, [parkFeatures.length])

  if (parkFeatures.length === 0) return null

  return (
    <>
      {!isLoadingParkFeatures && !parkFeaturesLoadError && parkFeatures.length > 0 && (
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
                {parkFeatures.length > 1 && (
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
                {parkFeatures
                  .filter(feature => feature.isActive)
                  .map((feature, index) => (
                    <AccordionList
                      key={index}
                      eventKey={index.toString()}
                      feature={feature}
                      openAccordions={openAccordions}
                      toggleAccordion={toggleAccordion}
                      itemCount={parkFeatures.length}
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