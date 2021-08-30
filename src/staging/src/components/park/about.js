import React from "react"
import { Paper, Container, Grid } from "@material-ui/core"
import Heading from "./heading"
import HtmlContent from "./htmlContent"

export default function About({ data }) {
  return (
    <Grid item xs={12} id="park-about-container" className="anchor-link">
      <Paper elevation={0}>
        <Heading>Learn more about this park</Heading>
        <Container>
          <HtmlContent>{data}</HtmlContent>
        </Container>
      </Paper>
    </Grid>
  )
}
