import React, { useState, useEffect, useRef } from "react"
import { navigate } from "gatsby"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import * as cheerio from "cheerio"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"

import ParkDates from "./parkDates"
import HtmlContent from "./htmlContent"
import StaticIcon from "./staticIcon"
import { isNullOrWhiteSpace } from "../../utils/helpers"
import "../../styles/cmsSnippets/parkInfoPage.scss"

export const CampingType = ({ camping }) => {
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(0)
  const [sectionHeight, setSectionHeight] = useState(0)
  const ref = useRef(null)
  const isLong = height > 259
  const campingDescription = !isNullOrWhiteSpace(camping.description?.data) ?
    camping.description.data :
    !isNullOrWhiteSpace(camping?.campingType?.defaultDescription?.data) ?
      camping.campingType.defaultDescription.data : ""

  const $ = cheerio.load(campingDescription)
  $('a').attr('tabindex', '-1')
  const collapsedDescription = $.html()
  const hasHr = $('hr').length > 0
  const hrAtEnd = campingDescription.trim().endsWith('<hr>')

  useEffect(() => {
    setHeight(ref.current.clientHeight)
  }, [expanded, camping])

  useEffect(() => {
    if (ref.current) {
      const h3 = ref.current.querySelector('h3.park-camping-title');
      const hr = ref.current.querySelector('hr');
      if (h3 && hr) {
        // height from the <h3> to the <hr>
        const height = hr?.getBoundingClientRect().top - h3.getBoundingClientRect().top
        setSectionHeight(height)
      }
    }
  }, [])

  return (
    <div className="park-camping">
      <div
        ref={ref}
        className={`expandable-description ${expanded ? "expanded" : "collapsed"} ${((hasHr || isLong) && !hrAtEnd) && "gradient"}`}
        style={{ maxHeight: expanded ? "none" : `${hasHr ? sectionHeight : 260}px` }}
      >
        <div className="d-flex align-items-center mb-4">
          <StaticIcon name={camping?.campingType?.icon || "information"} size={36} />
          <h3 className="park-camping-title ml-3 mb-0">
            {camping?.campingType?.campingTypeName}
          </h3>
        </div>
        <HtmlContent className="park-camping-description">
          {expanded ? campingDescription : collapsedDescription}
        </HtmlContent>
        <ParkDates data={camping} />
      </div>
      {(hasHr || isLong) && !hrAtEnd &&
        <button
          className="btn btn-link expand-icon park-camping-link"
          onClick={() => {
            setExpanded(!expanded)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              setExpanded(!expanded)
            }
          }}
        >
          {expanded ?
            <>
              Show less about {camping?.campingType?.campingTypeName.toLowerCase()}
              <FontAwesomeIcon icon={faChevronUp} className="ml-1" />
            </>
            :
            <>
              Show more about {camping?.campingType?.campingTypeName.toLowerCase()}
              <FontAwesomeIcon icon={faChevronDown} className="ml-1" />
            </>
          }
        </button>
      }
    </div>
  )
}

export default function CampingDetails({ data }) {
  const activeCampings = data.activeCampings
  const parkOperation = data.parkOperation
  const subAreas = data.subAreas || []
  subAreas.sort((a, b) => (a.parkSubArea >= b.parkSubArea ? 1 : -1))

  if (activeCampings.length === 0) return null

  const toFrontCountryReservations = () => {
    const reservationsURL = "https://camping.bcparks.ca"
    const parkReservationsURL = parkOperation?.reservationUrl || reservationsURL
    navigate(parkReservationsURL)
  }

  if (activeCampings.length === 0) return null

  return (
    <div id="camping" className="anchor-link">
      <Row>
        <Col>
          {/* id="park-camping-details-container" should be removed once it's removed from the contents */}
          <h2 id="park-camping-details-container" className="section-heading">
            Camping
          </h2>
        </Col>
        {data.hasReservations && (
          <Col className="mb-3" xs="auto">
            <button
              aria-label="Book camping"
              className="btn btn-secondary"
              onClick={() => toFrontCountryReservations()}
            >
              Book camping
            </button>
          </Col>
        )}
      </Row>
      <Row>
        <Col>
          {activeCampings.map((camping, index) => (
            <CampingType
              key={index}
              eventKey={index.toString()}
              camping={camping}
            />
          ))}
        </Col>
      </Row>
    </div>
  )
}
