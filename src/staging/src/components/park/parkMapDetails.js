import React from "react"
import { Paper, Grid } from "@material-ui/core"

import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

export default function ParkMapDetails({ data }) {
  return (
    <>
      {data && (
        <Grid item xs={12} className="anchor-link">
          <Paper elevation={0}>
            <Heading>Park and activity maps</Heading>
            <HtmlContent>{data}</HtmlContent>
          </Paper>
          <Spacer />
        </Grid>
      )}
    </>
  )
}
