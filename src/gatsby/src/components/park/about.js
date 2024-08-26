import React, { useState, useEffect, useCallback, useMemo } from "react"
import Accordion from "react-bootstrap/Accordion"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"

import HtmlContent from "./htmlContent"
import { isNullOrWhiteSpace } from "../../utils/helpers"
import "../../styles/cmsSnippets/parkInfoPage.scss"

export const AccordionList = ({ eventKey, data, openAccordions, toggleAccordion }) => {
  return (
    <Accordion
      className={`about-accordion is-open--${openAccordions[eventKey]}`}
    >
      <Accordion.Toggle
        as={"div"}
        aria-controls={data.title}
        eventKey={eventKey}
        onClick={() => toggleAccordion(eventKey)}
      >
        <div
          id={data.code}
          className="d-flex justify-content-between accordion-toggle"
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
        </div>
      </Accordion.Toggle>
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
  parkType, natureAndCulture, conservation, culturalHeritage, history, wildlife, biogeoclimaticZones, terrestrialEcosections, marineEcosections
}) {
  const dataList = [
    { "title": "Conservation", "code": "conservation", "description": conservation },
    { "title": "Cultural Heritage", "code": "cultural-heritage", "description": culturalHeritage },
    { "title": "History", "code": "history", "description": history },
    { "title": "Wildlife", "code": "wildlife", "description": wildlife }
  ].filter(data => data.description)

  const [hash, setHash] = useState("")
  const [openAccordions, setOpenAccordions] = useState({})

  const toggleAccordion = (index) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
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
      {/* display conservation/culturalHeritage/history/wildlife accordion, otherwise display natureAndCulture */}
      {dataList.length > 0 ? (
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
      ) : (
        <HtmlContent>{natureAndCulture}</HtmlContent>
      )}
      <ul>
        {biogeoclimaticZones?.length > 0 && (
          <li className="ecological-list">
            <strong>
              <a href="https://catalogue.data.gov.bc.ca/dataset/bec-zones-generalized-1-2m-">
                Biogeoclimatic zone:
              </a>
            </strong>
            <ul>
              {biogeoclimaticZones.map((bioZone, index) => (
                <li key={index}>
                  {bioZone.zone}
                  {biogeoclimaticZones.length > 1 && index + 1 !== biogeoclimaticZones.length && (",")}
                </li>
              ))}
            </ul>
          </li>
        )}
        {terrestrialEcosections?.length > 0 && (
          <li className="ecological-list">
            <strong>
              <a href="https://catalogue.data.gov.bc.ca/dataset/ecosections-ecoregion-ecosystem-classification-of-british-columbia">
                Terrestrial ecosection:
              </a>
            </strong>
            <ul>
              {terrestrialEcosections.map((terreSection, index) => (
                <li key={index}>
                  {terreSection.terrestrialEcosection}
                  {terrestrialEcosections.length > 1 && index + 1 !== terrestrialEcosections.length && (",")}
                </li>
              ))}
            </ul>
          </li>
        )}
        {marineEcosections?.length > 0 && (
          <li className="ecological-list">
            <strong>
              <a href="https://catalogue.data.gov.bc.ca/dataset/marine-ecosections-coastal-resource-information-management-system-crims">
                Marine ecosection:
              </a>
            </strong>
            <ul>
              {marineEcosections.map((marineSection, index) => (
                <li key={index}>
                  {marineSection.marineEcosection}
                  {marineEcosections.length > 1 && index + 1 !== marineEcosections.length && (",")}
                </li>
              ))}
            </ul>
          </li>
        )}
      </ul>
    </div>
  )
}