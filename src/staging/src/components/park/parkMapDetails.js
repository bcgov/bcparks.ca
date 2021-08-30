import React from "react"
import { Paper, Container, Grid } from "@material-ui/core"
import Heading from "./heading"

export default function ParkMapDetails({ data }) {
  return (
    <Grid item xs={12} id="park-map-details-container" className="anchor-link">
      <Paper elevation={0}>
        <Heading>Park and Activity</Heading>
        <Container>
          <p>TBD</p>
        </Container>
        <br />
      </Paper>
    </Grid>
  )
}
