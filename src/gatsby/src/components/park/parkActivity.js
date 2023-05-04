import React, { useState, useEffect, useCallback } from "react"
import Accordion from "react-bootstrap/Accordion"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"

import Heading from "./heading"
import HtmlContent from "./htmlContent"
import StaticIcon from "./staticIcon"

import { isNullOrWhiteSpace } from "../../utils/helpers"
import "../../styles/cmsSnippets/parkInfoPage.scss"

export default function ParkActivity({ data }) {
  const activityData = data
  const [expanded, setExpanded] = useState(
    Array(activityData.length).fill(false)
  )
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
    // if we find a matching activityCode, open that activity accordion
    let h = ""
    let idx = 0
    if (typeof window !== "undefined") {
      h = window.location.hash
      if (h !== undefined && h !== hash) {
        activityData.forEach(activity => {
          if (h === "#" + activity.activityType.activityCode) {
            if (!expanded[idx]) {
              toggleExpand(idx)
            }
          }
          idx++
        })
        setHash(h)
      }
    }
  }, [expanded, activityData, hash, toggleExpand])

  useEffect(() => {
    window.addEventListener("hashchange", function (e) {
      checkHash()
    })
    checkHash()
  }, [activityData, checkHash])

  if (activityData.length === 0) return null

  return (
    <div className="mb-5">
      <Row id="park-activity-container" className="anchor-link">
        <Col>
          <Heading>Activities</Heading>
        </Col>
      </Row>
      <Row>
        <Col>
          {activityData.map((activity, index) =>  (
            <Accordion
              key={"parkActivity" + index}
              activeKey={expanded[index] ? "parkActivity" + index : null}
              className="park-details mb-2"
            >
              <Accordion.Toggle
                as={Container}
                aria-controls={activity.activityType.activityName}
                eventKey={"parkActivity" + index}
                id={index}
                onClick={() => toggleExpand(index)}
              >
                <div
                  id={activity.activityType.activityCode}
                  className="d-flex justify-content-between p-3 accordion-toggle"
                >
                  <div className="d-flex justify-content-left align-items-center pl-2">
                    <StaticIcon name={activity.activityType.icon} size={48} />
                    <HtmlContent className="pl-3 accordion-header">
                      {activity.activityType.activityName}
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
              <Accordion.Collapse eventKey={"parkActivity" + index}>
                <div className="p-4">
                  <HtmlContent>
                    {!isNullOrWhiteSpace(activity.description.data) ? 
                      activity.description.data : activity.activityType.defaultDescription.data
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
