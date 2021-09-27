import React from "react"
import { Paper, Grid } from "@material-ui/core"
import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

export default function About({ data }) {
  return (
    <>
      {data && (
        <Grid item xs={12} id="park-about-container" className="anchor-link">
          <Paper elevation={0}>
            <Heading>Learn more about this park</Heading>
            <HtmlContent>{data}</HtmlContent>
            <Spacer />
          </Paper>
        </Grid>
      )}
    </>
  )
}
