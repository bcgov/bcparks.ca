import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import Container from "react-bootstrap/Container"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import NearByPark from "./nearByPark"

const NearByParks = ({ parks }) => {
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
    <div id="near-by-parks-container">
      <Container className="border">
        <h2>Near by parks</h2>
        <Row>
          {parks.map((park, index) =>
            <Col key={index} className="border">
              <NearByPark park={park} photos={filteredPhotos(park.orcs)} />
            </Col>
          )}
        </Row>
      </Container>
    </div>
  )
}

export default NearByParks