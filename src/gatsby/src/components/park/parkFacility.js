import React, { useState, useEffect, useCallback, useMemo } from "react"
import Accordion from "react-bootstrap/Accordion"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"

import HtmlContent from "../htmlContent"
import StaticIcon from "./staticIcon"
import { isNullOrWhiteSpace } from "../../utils/helpers"
import { trackSnowplowEvent } from "../../utils/snowplowHelper"
import "../../styles/cmsSnippets/parkInfoPage.scss"
import SubArea from "./subArea"
import CustomToggle from "./customToggle"

export const AccordionList = ({ eventKey, facility, openAccordions, toggleAccordion, groupPicnicReservationUrl }) => {
  const isPicnicFacility = facility.facilityType.facilityCode === "picnic-shelters"

  return (
    <Accordion
      className={`is-open--${openAccordions[eventKey]}`}
    >
      <CustomToggle
        eventKey={eventKey}
        toggleId={facility.facilityType.facilityCode}
        ariaControls={facility.facilityType.facilityName}
        handleClick={() => toggleAccordion(eventKey, facility.facilityType.facilityName)}
      >
        <div className="d-flex align-items-center">
          <StaticIcon name={facility.facilityType.icon || "information"} size={36} />
          <HtmlContent className="accordion-header">
            {facility.facilityType.facilityName}
          </HtmlContent>
        </div>
        <div className="d-flex align-items-center">
          {openAccordions[eventKey] ?
            <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />
          }
        </div>
      </CustomToggle>
      <Accordion.Collapse eventKey={eventKey} in={openAccordions[eventKey]}>
        <>
          {facility.parkFeatures.map((subArea, index) => (
            <SubArea key={index} data={subArea} showHeading={true} />
          ))}
          <div className="accordion-content">
            <HtmlContent>
              {!isNullOrWhiteSpace(facility.description?.data) ?
                facility.description.data : facility.facilityType.defaultDescription.data.defaultDescription
              }
            </HtmlContent>
            {!facility.hideStandardCallout &&
              !isNullOrWhiteSpace(facility.facilityType?.appendStandardCalloutText?.data?.appendStandardCalloutText) && (
                <blockquote className="callout-box">
                  <HtmlContent>
                    {facility.facilityType.appendStandardCalloutText.data.appendStandardCalloutText}
                  </HtmlContent>
                </blockquote>
              )}
            {/* picnic shelter reservation button */}
            {isPicnicFacility && groupPicnicReservationUrl && (
              <a href={groupPicnicReservationUrl} className="btn btn-secondary my-4">
                Book picnic shelter
              </a>
            )}
          </div>
        </>
      </Accordion.Collapse>
    </Accordion>
  )
}

export default function ParkFacility({ data, groupPicnicReservationUrl }) {
  const facilityData = useMemo(() => data || [], [data])
  const [hash, setHash] = useState("")
  const [openAccordions, setOpenAccordions] = useState({})

  const toggleAccordion = (index, facilityName) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
    trackSnowplowEvent(
      openAccordions[index] ? "accordion_close" : "accordion_open",
      null,
      null,
      null,
      facilityName,
      {}
    )
  }

  const toggleExpandAll = () => {
    const newExpandAll = !allExpanded
    const newOpenAccordions = facilityData.reduce((acc, _, index) => {
      acc[index] = newExpandAll
      return acc
    }, {})
    setOpenAccordions(newOpenAccordions)
  }

  const allExpanded = useMemo(() => {
    return facilityData.length > 0 &&
      Object.keys(openAccordions).length === facilityData.length &&
      Object.values(openAccordions).every((isOpen) => isOpen)
  }, [openAccordions, facilityData.length])

  const checkHash = useCallback(() => {
    // Check hash in url
    // if we find a matching facilityCode, open that facility accordion
    let h = ""
    let idx = 0
    if (typeof window !== "undefined") {
      h = window.location.hash
      if (h !== undefined && h !== hash) {
        facilityData.forEach(facility => {
          if (h === "#" + facility.facilityType.facilityCode) {
            if (!openAccordions[idx]) {
              setOpenAccordions((prev) => ({
                ...prev,
                [idx]: true,
              }))
            }
          }
          idx++
        })
        setHash(h)
      }
    }
  }, [facilityData, hash, openAccordions])

  useEffect(() => {
    window.addEventListener("hashchange", function (e) {
      checkHash()
    })
    checkHash()
  }, [facilityData, checkHash])

  useEffect(() => {
    if (facilityData.length === 1) {
      setOpenAccordions({ 0: true })
    }
  }, [facilityData.length])

  if (facilityData.length === 0) return null

  return (
    <div id="facilities" className="anchor-link">
      {/* id="park-facility-container" should be removed once it's removed from the contents */}
      <h2 id="park-facility-container" className="section-heading">
        Facilities
      </h2>
      <Row>
        <Col>
          {facilityData.length > 1 && (
            <button
              onClick={toggleExpandAll}
              aria-label={allExpanded ? "Collapse all facilities" : "Expand all facilities"}
              className="btn btn-link expand-link expand-icon"
            >
              {allExpanded ?
                <>Collapse all facilities <FontAwesomeIcon icon={faChevronUp} /></>
                :
                <>Expand all facilities <FontAwesomeIcon icon={faChevronDown} /></>
              }
            </button>
          )}
          {facilityData.map((facility, index) => (
            <AccordionList
              key={index}
              eventKey={index.toString()}
              facility={facility}
              openAccordions={openAccordions}
              toggleAccordion={toggleAccordion}
              groupPicnicReservationUrl={groupPicnicReservationUrl}
            />
          ))}
        </Col>
      </Row>
    </div>
  )
}
