import React, { useState } from "react"
import "../../styles/cmsSnippets/parkInfoPage.scss"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Accordion from "react-bootstrap/Accordion"
import Container from "react-bootstrap/Container"
import Heading from "./heading"
import HtmlContent from "./htmlContent"
import StaticIcon from "./staticIcon"

export default function ParkFacility({ data }) {
  const facilityData = data
  const [expanded, setExpanded] = useState(
    Array(facilityData.length).fill(false)
  )

  if (facilityData.length === 0) return null

  const toggleExpand = index => {
    expanded[index] = !expanded[index]
    setExpanded([...expanded])
  }


  return (
    <div className="mb-5">
      <Row
        id="park-facility-container"
        className="anchor-link"
      >
        <Col>
          <Heading>Facilities</Heading>
        </Col>
      </Row>
      <Row>
        <Col>
          {facilityData.map((facility, index) => (
            <Accordion
              key={"parkFacility" + index}
              className="park-details mb-2"
            >
              <Accordion.Toggle as={Container}
                aria-controls={facility.activityName}
                eventKey="0"
                id={index}
                onClick={() => toggleExpand(index)}
              >
                <div className="d-flex justify-content-between p-3 accordion-toggle">
                  <div className="d-flex justify-content-left align-items-center pl-2">
                    <StaticIcon name={facility.facilityType.icon} size={48} />
                    <HtmlContent className="pl-3 accordion-header">{facility.facilityType.facilityName}</HtmlContent>
                  </div>
                  <div className="d-flex align-items-center expand-icon">
                    <i className={(expanded[index] ? "open " : "close ") + "fa fa-angle-down mx-3"}></i>
                  </div>
                </div>
              </Accordion.Toggle>
              <Accordion.Collapse
                eventKey="0"
              >
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
