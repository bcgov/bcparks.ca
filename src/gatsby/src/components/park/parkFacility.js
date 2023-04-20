import React, { useState, useEffect, useCallback } from "react"
import "../../styles/cmsSnippets/parkInfoPage.scss"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Accordion from "react-bootstrap/Accordion"
import Container from "react-bootstrap/Container"

import Heading from "./heading"
import HtmlContent from "./htmlContent"
import StaticIcon from "./staticIcon"

import { isNullOrWhiteSpace } from "../../utils/helpers"
import "../../styles/cmsSnippets/parkInfoPage.scss"

export default function ParkFacility({ data }) {
  const [facilityData] = useState(
    JSON.parse(JSON.stringify(data)) // deep copy
  )
  const [expanded, setExpanded] = useState(Array(data.length).fill(false))
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
          {facilityData.map((facility, index) => (
            <Accordion
              key={"parkFacility" + index}
              activeKey={expanded[index] ? "parkFacility" + index : null}
              className="park-details mb-2"
            >
              <Accordion.Toggle
                as={Container}
                aria-controls={facility.facilityType.facilityName}
                eventKey={"parkFacility" + index}
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
              <Accordion.Collapse eventKey={"parkFacility" + index}>
                <div className="p-4">
                  <HtmlContent>
                    {!isNullOrWhiteSpace(facility.description.data) ?
                      facility.description.data : facility.facilityType.defaultDescription.data
                    }
                  </HtmlContent>
                </div>
              </Accordion.Collapse>
            </Accordion>
          ))}
        </Col>
      </Row>
    </div>
  )
}
