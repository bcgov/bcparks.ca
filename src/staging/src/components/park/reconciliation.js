import React from "react"
import { Paper, Container, Grid } from "@material-ui/core"
import Heading from "./heading"

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
        <Container>
          <p>{data}</p>
        </Container>
      </Paper>
    </Grid>
  )
}
