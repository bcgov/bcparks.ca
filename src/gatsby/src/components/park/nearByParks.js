import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import NearbyPark from "./nearbyPark"

const NearbyParks = ({ parks }) => {
  const data = useStaticQuery(graphql`
    query {
      allStrapiParkPhoto(
        filter: {
          isActive: {eq: true}
        }
        sort: [
          {orcs: ASC},
          {isFeatured: DESC},
          {sortOrder: ASC}
        ]
      ) {
        nodes {
          orcs
          imageUrl
          isFeatured
          sortOrder
        }
      }
    }
  `)

  const photos = data.allStrapiParkPhoto.nodes || []
  const filteredPhotos = (orcs) => photos.filter(p => p.orcs === orcs)

  return (
    <div id="nearby-parks-container">
      <Container>
        <h2>More parks to visit nearby</h2>
        <Row>
          {parks.map((park, index) =>
            <Col key={index} xs={12} lg={4} className="col">
              <NearbyPark park={park} photos={filteredPhotos(park.orcs)} />
            </Col>
          )}
        </Row>
      </Container>
    </div>
  )
}

export default NearbyParks