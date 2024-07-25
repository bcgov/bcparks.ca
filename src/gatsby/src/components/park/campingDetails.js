import React from "react"
import { navigate } from "gatsby"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"

import ParkDates from "./parkDates"
import HtmlContent from "./htmlContent"
import StaticIcon from "./staticIcon"
import { isNullOrWhiteSpace } from "../../utils/helpers"
import "../../styles/cmsSnippets/parkInfoPage.scss"

export const CampingType = ({ camping }) => {
  return (
    <>
      <div className="d-flex align-items-center mb-4">
        <StaticIcon name={camping?.campingType?.icon || "information"} size={36} />
        <h3 className="ml-3 mb-0">
          {camping?.campingType?.campingTypeName}
        </h3>
      </div>
      <HtmlContent className="park-camping-type-description">
        {!isNullOrWhiteSpace(camping.description?.data) ?
          camping.description.data : (camping?.campingType?.defaultDescription.data)
        }
      </HtmlContent>
      <ParkDates data={camping.subAreas} />
    </>
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
          <Col className="mb-3" lg="4">
            <button
              aria-label="Book camping"
              className="btn btn-warning w-100"
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
