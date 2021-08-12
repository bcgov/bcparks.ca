import React from "react"
import { Paper, Container } from "@material-ui/core"
import Heading from "./heading"
import mapImage from "../../images/map-placeholder.png"

export default function MapLocation({ data }) {
  return (
    <div id="park-reconciliation-container">
      <Paper elevation={0}>
        <Heading title="Maps and Location" />
        <Container>
          <img src={mapImage} alt="map place holder" />
        </Container>
        <br />
      </Paper>
    </div>
  )
}
