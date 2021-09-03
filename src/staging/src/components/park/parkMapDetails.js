import React from "react"
import { Paper, Grid } from "@material-ui/core"
import Heading from "./heading"
import Spacer from "./spacer"

export default function ParkMapDetails({ data }) {
  return (
    <Grid item xs={12} id="park-map-details-container" className="anchor-link">
      <Paper elevation={0}>
        <Heading>Park and Activity</Heading>
        <Spacer />
      </Paper>
    </Grid>
  )
}
