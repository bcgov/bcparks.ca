import React from "react"
import { Paper, Container } from "@material-ui/core"
import Heading from "./heading"

export default function Reconciliation({ data }) {
  return (
    <div id="park-reconciliation-container">
      <Paper elevation={0}>
        <Heading title="Reconciliation with Indigenous peoples" />
        <Container>
          <p>{data}</p>
        </Container>
      </Paper>
    </div>
  )
}
