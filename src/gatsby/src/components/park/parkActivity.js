import React, { useState, useEffect, useCallback, useMemo } from "react"
import Accordion from "react-bootstrap/Accordion"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"

import HtmlContent from "./htmlContent"
import StaticIcon from "./staticIcon"
import CustomToggle from "./customToggle"
import DiscoverParksLogo from "../../images/discover-parks-instagram-dark-green-icon-with-text.png"
import { isNullOrWhiteSpace } from "../../utils/helpers"
import { trackSnowplowEvent } from "../../utils/snowplowHelper"
import "../../styles/cmsSnippets/parkInfoPage.scss"

export const AccordionList = ({ eventKey, activity, openAccordions, toggleAccordion }) => {
  return (
    <Accordion
      className={`is-open--${openAccordions[eventKey]}`}
    >
      <CustomToggle
        eventKey={eventKey}
        toggleId={activity.activityType.activityCode}
        ariaControls={activity.activityType.activityName}
        handleClick={() => toggleAccordion(eventKey, activity.activityType.activityName)}
      >
        <div className="d-flex align-items-center">
          <StaticIcon name={activity.activityType.icon || "information"} size={36} />
          <HtmlContent className="accordion-header">
            {activity.activityType.activityName}
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
            {!isNullOrWhiteSpace(activity.description.data) ?
              activity.description.data : activity.activityType.defaultDescription.data
            }
          </HtmlContent>
          {!activity.hideStandardCallout &&
            !isNullOrWhiteSpace(activity.activityType.appendStandardCalloutText.data) && (
              <blockquote className="callout-box">
                <HtmlContent>
                  {activity.activityType.appendStandardCalloutText.data}
                </HtmlContent>
              </blockquote>
            )}
        </div>
      </Accordion.Collapse>
    </Accordion>
  )
}

export default function ParkActivity({ data, slug, hasDiscoverParksLink }) {
  const [activityData] = useState(
    JSON.parse(JSON.stringify(data)) // deep copy
  )
  const [hash, setHash] = useState("")
  const [openAccordions, setOpenAccordions] = useState({})

  const toggleAccordion = (index, activityName) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [index]: !prev[index],
    }))
    trackSnowplowEvent(
      openAccordions[index] ? "accordion_close" : "accordion_open",
      null,
      null,
      null,
      activityName,
      {}
    )
  }

  const toggleExpandAll = () => {
    const newExpandAll = !allExpanded
    const newOpenAccordions = activityData.reduce((acc, _, index) => {
      acc[index] = newExpandAll
      return acc
    }, {})
    setOpenAccordions(newOpenAccordions)
  }

  const allExpanded = useMemo(() => {
    return activityData.length > 0 &&
      Object.keys(openAccordions).length === activityData.length &&
      Object.values(openAccordions).every((isOpen) => isOpen)
  }, [openAccordions, activityData.length])

  const checkHash = useCallback(() => {
    // Check hash in url
    // if we find a matching activityCode, open that activity accordion
    let h = ""
    let idx = 0
    if (typeof window !== "undefined") {
      h = window.location.hash
      if (h !== undefined && h !== hash) {
        activityData.forEach(activity => {
          if (h === "#" + activity.activityType.activityCode) {
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
  }, [activityData, hash, openAccordions])

  useEffect(() => {
    window.addEventListener("hashchange", function (e) {
      checkHash()
    })
    checkHash()
  }, [activityData, checkHash])

  useEffect(() => {
    if (activityData.length === 1) {
      setOpenAccordions({ 0: true })
    }
  }, [activityData.length])

  if (activityData.length === 0) return null

  return (
    <div id="things-to-do" className="anchor-link">
      {/* id="park-activity-container" should be removed once it's removed from the contents */}
      <h2 id="park-activity-container" className="section-heading">
        Things to do
      </h2>
      <Row>
        <Col>
          {activityData.length > 1 && (
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
          {activityData.map((activity, index) => (
            <AccordionList
              key={index}
              eventKey={index.toString()}
              activity={activity}
              openAccordions={openAccordions}
              toggleAccordion={toggleAccordion}
            />
          ))}
        </Col>
      </Row>
      {hasDiscoverParksLink && (
        <Row className="discpver-parks mt-3">
          <Col className="discpver-parks__col">
            <div className="discpver-parks__col--left">
              <img
                src={DiscoverParksLogo}
                alt="Discover Parks Logo"
                className="discover-parks-logo"
              />
            </div>
            <div>
              For more events and activities happening at this park,
              visit <a href={`https://www.discoverparks.ca/locations/${slug}`}>
                discoverparks.ca</a>. Discover Parks is developed
              by <a href="https://bcparksfoundation.ca">
                BC Parks Foundation</a>, our official charitable partner.
            </div>
          </Col>
        </Row>
      )}
    </div>
  )
}
