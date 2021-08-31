import React from "react"
import { Paper, Grid } from "@material-ui/core"
import Heading from "./heading"
import Spacer from "./spacer"

export default function Reconciliation({ data }) {
  return (
    <Grid
      item
      xs={12}
      id="park-reconciliation-container"
      className="anchor-link"
    >
      <Paper elevation={0}>
        <Heading>Reconciliation with Indigenous peoples</Heading>
        <p>{data}</p>
        <Spacer />
      </Paper>
    </Grid>
  )
}
