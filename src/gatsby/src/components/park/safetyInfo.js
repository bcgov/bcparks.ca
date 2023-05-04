import React from "react"
import { Paper, Grid } from "@material-ui/core"

import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

// TODO: this component needs to be converted to bootstrap but
// it should be done at the same time as the other sections
// to match spacing
export default function SafetyInfo({ safetyInfo }) {
  return (
    <>
      <Grid
        item
        xs={12}
        id="park-safety-info-container"
        className="anchor-link"
      >
        <Paper elevation={0}>
          <Heading>Safety info</Heading>
          {safetyInfo && (
            <HtmlContent>{safetyInfo}</HtmlContent>
          )}
          <Spacer />
        </Paper>
      </Grid>
    </>
  )
}
