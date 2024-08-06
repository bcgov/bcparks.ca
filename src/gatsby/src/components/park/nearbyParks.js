import React from "react"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import NearbyPark from "./nearbyPark"

const NearbyParks = ({ parks }) => {
  return (
    <div id="nearby-parks-container">
      <Container>
        <h2>More parks to visit nearby</h2>
        <Row>
          {/* limit 3 nearby parks */}
          {parks.slice(0, 3).map((park, index) =>
            park !== null &&
            <Col key={index} xs={12} lg={4} className="col">
              <NearbyPark park={park} />
            </Col>
          )}
        </Row>
      </Container>
    </div>
  )
}

export default NearbyParks