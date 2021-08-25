import React from "react"
import { Paper, Container } from "@material-ui/core"
import Heading from "./heading"
import HtmlContent from "./htmlContent"

export default function About({ data }) {
  return (
    <div id="park-about-container" className="anchor-link">
      <Paper elevation={0}>
        <Heading>Learn more about this park</Heading>
        <Container>
          <HtmlContent>{data}</HtmlContent>
        </Container>
      </Paper>
    </div>
  )
}
