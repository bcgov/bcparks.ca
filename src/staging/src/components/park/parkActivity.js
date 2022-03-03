import React, { useState } from "react"
import "../../styles/cmsSnippets/parkInfoPage.scss"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import Accordion from "react-bootstrap/Accordion"
import Container from "react-bootstrap/Container"
import Heading from "./heading"
import HtmlContent from "./htmlContent"
import StaticIcon from "./staticIcon"

export default function ParkActivity({ data }) {
  const activityData = data
  const [expanded, setExpanded] = useState(
    Array(activityData.length).fill(false)
  )

  if (activityData.length === 0) return null;


  const toggleExpand = index => {
    expanded[index] = !expanded[index]
    setExpanded([...expanded])
  }

  return (
    <div className="mb-5">
      <Row
        id="park-camping-details-container"
        className="anchor-link"
      >
        <Col>
          <Heading>Activities</Heading>
        </Col>
      </Row>
      <Row>
        <Col>
          {activityData.map((activity, index) => (
            <Accordion
              key={"parkActivity" + index}
              className="park-details mb-2"
            >
              <Accordion.Toggle as={Container}
                aria-controls={activity.activityType.activityName}
                eventKey="0"
                id={index}
                onClick={() => toggleExpand(index)}
              >
                <div className="d-flex justify-content-between p-3 accordion-toggle">
                  <div className="d-flex justify-content-left align-items-center pl-2">
                    <StaticIcon name={activity.activityType.icon} size={48} />
                    <HtmlContent className="pl-3 accordion-header">{activity.activityType.activityName}</HtmlContent>
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
                  <HtmlContent>{activity.description}</HtmlContent>
                </div>
              </Accordion.Collapse>
            </Accordion>
          ))}
        </Col>
      </Row>
    </div>
  )
}
