import React, { useState, useEffect, useCallback } from "react"
import Accordion from "react-bootstrap/Accordion"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"

import HtmlContent from "./htmlContent"
import StaticIcon from "./staticIcon"
import { isNullOrWhiteSpace } from "../../utils/helpers"
import "../../styles/cmsSnippets/parkInfoPage.scss"

export const AccordionList = ({ eventKey, facility, open }) => {
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    setIsShow(open)
  }, [open])

  return (
    <Accordion
      activeKey={isShow ? eventKey : ''}
      className={`is-open--${isShow}`}
    >
      <Accordion.Toggle
        as={"div"}
        aria-controls={facility.facilityType.facilityName}
        eventKey={eventKey}
        onClick={() => setIsShow(!isShow)}
      >
        <div
          id={facility.facilityType.facilityCode}
          className="d-flex justify-content-between accordion-toggle"
        >
          <div className="d-flex align-items-center">
            <StaticIcon name={facility.facilityType.icon} size={36} />
            <HtmlContent className="accordion-header">
              {facility.facilityType.facilityName}
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
            {!isNullOrWhiteSpace(facility.description.data) ?
              facility.description.data : facility.facilityType.defaultDescription.data
            }
          </HtmlContent>
          {!facility.hideStandardCallout &&
            !isNullOrWhiteSpace(facility.facilityType.appendStandardCalloutText.data) && (
              <blockquote className="callout-box">
                <HtmlContent>
                  {facility.facilityType.appendStandardCalloutText.data}
                </HtmlContent>
              </blockquote>
            )}
        </div>
      </Accordion.Collapse>
    </Accordion>
  )
}

export default function ParkFacility({ data }) {
  const [facilityData] = useState(
    JSON.parse(JSON.stringify(data)) // deep copy
  )
  const [expanded, setExpanded] = useState(Array(data.length).fill(false))
  const [hash, setHash] = useState("")
  const [open, setOpen] = useState(false)

  const toggleExpand = useCallback(
    index => {
      expanded[index] = !expanded[index]
      setExpanded([...expanded])
    },
    [expanded]
  )

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
            if (!expanded[idx]) {
              toggleExpand(idx)
            }
          }
          idx++
        })
        setHash(h)
      }
    }
  }, [expanded, facilityData, hash, toggleExpand])

  useEffect(() => {
    window.addEventListener("hashchange", function (e) {
      checkHash()
    })
    checkHash()
  }, [facilityData, checkHash])

  useEffect(() => {
    if (facilityData.length === 1) {
      setOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          {facilityData.map((facility, index) => (
            <AccordionList
              key={index}
              eventKey={index.toString()}
              facility={facility}
              open={open}
            />
          ))}
        </Col>
      </Row>
    </div>
  )
}
