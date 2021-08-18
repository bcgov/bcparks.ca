import React from "react"
import { Paper, Container } from "@material-ui/core"
import Heading from "./heading"

export default function Reconciliation({ data }) {
  return (
    <div id="park-reconciliation-container" className="anchor-link">
      <Paper elevation={0}>
        <Heading>Reconciliation with Indigenous peoples</Heading>
        <Container>
          <p>{data}</p>
        </Container>
      </Paper>
    </div>
  )
}
