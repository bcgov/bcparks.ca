import React, { useState, useEffect } from "react"
import Accordion from "react-bootstrap/Accordion"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"

import HtmlContent from "./htmlContent"
import SubArea from "./subArea"

export const AccordionList = ({ eventKey, subArea, open }) => {
  const [isShow, setIsShow] = useState(false)

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
        aria-controls={subArea.parkSubArea}
        eventKey={eventKey}
        onClick={() => setIsShow(!isShow)}
      >
        <div className="d-flex justify-content-between accordion-toggle">
          <div className="d-flex align-items-center">
            <HtmlContent className="accordion-header">
              {subArea.parkSubArea}
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
        <SubArea data={subArea} />
      </Accordion.Collapse>
    </Accordion>
  )
}

export default function ParkDates({ data }) {
  const subAreas = data.sort((a, b) => (a.parkSubArea >= b.parkSubArea ? 1 : -1))
  const [open, setOpen] = useState(false)

  useEffect(() => {
    if (subAreas.length === 1) {
      setOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subAreas.length])

  useEffect(() => {
    if (subAreas.length === 1) {
      setOpen(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subAreas.length])

  return (
    <>
      {
        subAreas.length > 0 ? (
          <h4>
            {subAreas[0].parkSubAreaType.campingType.campingTypeName} campgrounds
          </h4>) : ""
      }
      <Row className="mb-5">
        <Col>
          <>
            {subAreas.length > 1 && (
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
            {subAreas
              .filter(subArea => subArea.isActive)
              .map((subArea, index) => (
                <AccordionList
                  key={index}
                  eventKey={index.toString()}
                  subArea={subArea}
                  open={open}
                />
              ))}
          </>
        </Col>
      </Row>
    </>
  )
}
