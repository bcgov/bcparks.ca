import React, { useState, useEffect, useCallback, useMemo } from "react"
import Accordion from "react-bootstrap/Accordion"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"

import HtmlContent from "./htmlContent"
import CustomToggle from "./customToggle"
import { isNullOrWhiteSpace } from "../../utils/helpers"
import { trackSnowplowEvent } from "../../utils/snowplowHelper"
import "../../styles/cmsSnippets/parkInfoPage.scss"

export const AccordionList = ({ eventKey, data, openAccordions, toggleAccordion }) => {
  return (
    <Accordion
      className={`about-accordion is-open--${openAccordions[eventKey]}`}
    >
      <CustomToggle
        eventKey={eventKey}
        toggleId={data.code}
        ariaControls={data.title}
        handleClick={() => toggleAccordion(eventKey, data.title)}
      >
        <div className="d-flex align-items-center">
          <HtmlContent className="accordion-header">
            {data.title}
          </HtmlContent>
        </div>
        <div className="d-flex align-items-center">
          {openAccordions[eventKey] ?
            <FontAwesomeIcon icon={faChevronUp} /> : <FontAwesomeIcon icon={faChevronDown} />
          }
        </div>
      </CustomToggle>
      <Accordion.Collapse eventKey={eventKey} in={openAccordions[eventKey]}>
        <div className="accordion-content">
          <HtmlContent>
            {!isNullOrWhiteSpace(data.description) && data.description}
          </HtmlContent>
        </div>
      </Accordion.Collapse>
    </Accordion>
  )
}

export default function About({
  parkType, conservation, culturalHeritage, history, wildlife, biogeoclimaticZones, terrestrialEcosections, marineEcosections
}) {
  const dataList = [
    { "title": "Cultural heritage", "code": "cultural-heritage", "description": culturalHeritage },
    { "title": "History", "code": "history", "description": history },
    { "title": "Conservation", "code": "conservation", "description": conservation },
    { "title": "Wildlife", "code": "wildlife", "description": wildlife }
  ].filter(data => data.description)

  const [hash, setHash] = useState("")
  const [openAccordions, setOpenAccordions] = useState({})

  const toggleAccordion = (index, accordionName) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
    trackSnowplowEvent(
      openAccordions[index] ? "accordion_close" : "accordion_open",
      null,
      null,
      null,
      accordionName,
      {}
    )
  }

  const toggleExpandAll = () => {
    const newExpandAll = !allExpanded
    const newOpenAccordions = dataList.reduce((acc, _, index) => {
      acc[index] = newExpandAll
      return acc
    }, {})
    setOpenAccordions(newOpenAccordions)
  }

  const allExpanded = useMemo(() => {
    return dataList.length > 0 &&
      Object.keys(openAccordions).length === dataList.length &&
      Object.values(openAccordions).every((isOpen) => isOpen)
  }, [openAccordions, dataList.length])

  const checkHash = useCallback(() => {
    // Check hash in url
    // if we find a matching activityCode, open that activity accordion
    let h = ""
    let idx = 0
    if (typeof window !== "undefined") {
      h = window.location.hash
      if (h !== undefined && h !== hash) {
        dataList.forEach(data => {
          if (h === "#" + data.code) {
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
  }, [dataList, hash, openAccordions])

  useEffect(() => {
    window.addEventListener("hashchange", function (e) {
      checkHash()
    })
    checkHash()
  }, [dataList, checkHash])

  useEffect(() => {
    if (dataList.length === 1) {
      setOpenAccordions({ 0: true })
    }
  }, [dataList.length])

  return (
    <div id="about-this-park" className="anchor-link" >
      {/* id="park-about-container" should be removed once it's removed from the contents */}
      <span id="park-about-container"></span>
      {/* id="park-nature-and-culture-container" should be removed once it's removed from the contents */}
      <h2 id="park-nature-and-culture-container" className="section-heading">
        About this {parkType}
      </h2>
      <div>
        {biogeoclimaticZones?.length > 0 && (
          <p className="ecological-list">
            <a href="https://catalogue.data.gov.bc.ca/dataset/bec-zones-generalized-1-2m-">
              Biogeoclimatic zone:
            </a>
            {biogeoclimaticZones.map((bioZone, index) => (
              <span key={index}>
                {bioZone.zone}
                {biogeoclimaticZones.length > 1 && index + 1 !== biogeoclimaticZones.length && (", ")}
              </span>
            ))}
          </p>
        )}
        {terrestrialEcosections?.length > 0 && (
          <p className="ecological-list">
            <a href="https://catalogue.data.gov.bc.ca/dataset/ecosections-ecoregion-ecosystem-classification-of-british-columbia">
              Terrestrial ecosection:
            </a>
            {terrestrialEcosections.map((terreSection, index) => (
              <span key={index}>
                {terreSection.terrestrialEcosection}
                {terrestrialEcosections.length > 1 && index + 1 !== terrestrialEcosections.length && (",")}
              </span>
            ))}
          </p>
        )}
        {marineEcosections?.length > 0 && (
          <p className="ecological-list">
            <a href="https://catalogue.data.gov.bc.ca/dataset/marine-ecosections-coastal-resource-information-management-system-crims">
              Marine ecosection:
            </a>
            {marineEcosections.map((marineSection, index) => (
              <span key={index}>
                {marineSection.marineEcosection}
                {marineEcosections.length > 1 && index + 1 !== marineEcosections.length && (",")}
              </span>
            ))}
          </p>
        )}
      </div>
      {dataList.length > 0 && (
        // if parkType is ecological reserve, display conservation description without accordion
        parkType === "ecological reserve" ? (
          <HtmlContent>{dataList[0].description}</HtmlContent>
        ) : (
          <Row>
            <Col>
              {dataList.length > 1 && (
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
              {dataList.map((data, index) => (
                <AccordionList
                  key={index}
                  eventKey={index.toString()}
                  data={data}
                  openAccordions={openAccordions}
                  toggleAccordion={toggleAccordion}
                />
              ))}
            </Col>
          </Row>
        )
      )}
    </div>
  )
}