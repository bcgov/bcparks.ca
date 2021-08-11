import React from "react"
import { Paper, Container, Typography } from "@material-ui/core"
import Heading from "./heading"

export default function Reconciliation({ data }) {
  return (
    <div id="park-elevation">
      <Paper elevation={0}>
        <Heading title="Reconciliation with Indigenous peoples" />
        <Container>
          <Typography>{data}</Typography>
        </Container>
      </Paper>
    </div>
  )
}
