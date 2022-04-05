import React, { useState, useEffect, useCallback } from "react"
import "../../styles/cmsSnippets/parkInfoPage.scss"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Accordion from "react-bootstrap/Accordion"
import Container from "react-bootstrap/Container"

import Heading from "./heading"
import HtmlContent from "./htmlContent"
import StaticIcon from "./staticIcon"

import "../../styles/cmsSnippets/parkInfoPage.scss"

export default function ParkFacility({ data }) {
  const [facilityData] = useState(
    JSON.parse(JSON.stringify(data)) // deep copy
  )
  const [expanded, setExpanded] = useState(Array(data.length).fill(false))
  const [numFacilities, setNumFacilities] = useState(0)
  const [hash, setHash] = useState("")

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

    if (typeof window !== "undefined") {
      h = window.location.hash
      if (h !== undefined && h !== hash) {
        facilityData.forEach(facility => {
          if (h === "#" + facility.facilityType.facilityCode) {
            if (!expanded[facility.uiId]) {
              toggleExpand(facility.uiId)
            }
          }
        })
        setHash(h)
      }
    }
  }, [expanded, facilityData, hash, toggleExpand])

  useEffect(() => {
    // Each element in the array needs a unique id for the accordions
    // to be togglable through code
    let i = 0
    for (const idx in facilityData) {
      const facility = facilityData[idx]
      facility.uiId = i
      i++
    }
    setNumFacilities(i)

    window.addEventListener("hashchange", function (e) {
      checkHash()
    })
    checkHash()
  }, [facilityData, checkHash])

  if (facilityData.length === 0) return null

  return (
    <div className="mb-5">
      <Row id="park-facility-container" className="anchor-link">
        <Col>
          <Heading>Facilities</Heading>
        </Col>
      </Row>
      <Row>
        <Col>
          {numFacilities &&
            facilityData.map((facility, index) => (
              <Accordion
                key={facility.uiId}
                activeKey={expanded[index] ? facility.uiId : null}
                className="park-details mb-2"
              >
                <Accordion.Toggle
                  as={Container}
                  aria-controls={facility.activityName}
                  eventKey={facility.uiId}
                  id={index}
                  onClick={() => toggleExpand(index)}
                >
                  <div
                    id={facility.facilityType.facilityCode}
                    className="d-flex justify-content-between p-3 accordion-toggle"
                  >
                    <div className="d-flex justify-content-left align-items-center pl-2">
                      <StaticIcon name={facility.facilityType.icon} size={48} />
                      <HtmlContent className="pl-3 accordion-header">
                        {facility.facilityType.facilityName}
                      </HtmlContent>
                    </div>
                    <div className="d-flex align-items-center expand-icon">
                      <i
                        className={
                          (expanded[index] ? "open " : "close ") +
                          "fa fa-angle-down mx-3"
                        }
                      ></i>
                    </div>
                  </div>
                </Accordion.Toggle>
                <Accordion.Collapse eventKey={facility.uiId}>
                  <div className="p-4">
                    <HtmlContent>{facility.description}</HtmlContent>
                  </div>
                </Accordion.Collapse>
              </Accordion>
            ))}
        </Col>
      </Row>
    </div>
  )
}
