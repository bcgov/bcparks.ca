import React from "react"
import { Paper, Grid } from "@material-ui/core"

import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

export default function NatureAndCulture({ data }) {
  return (
    <Grid
      item
      xs={12}
      id="park-nature-and-culture-container"
      className="anchor-link"
    >
      <Paper elevation={0}>
        <Heading>Nature and culture</Heading>
        <HtmlContent>{data}</HtmlContent>
        <Spacer />
      </Paper>
    </Grid>
  )
}
