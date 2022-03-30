import React from "react"
import { capitalize } from "lodash"
import { Paper, Grid } from "@material-ui/core"

import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

export default function ParkMapDetails({ data, type }) {
  return (
    <>
      {data && (
        <Grid
          item
          xs={12}
          id="park-map-details-container"
          className="anchor-link"
        >
          <Paper elevation={0}>
            <Heading>{capitalize(`${type} and activity maps`)}</Heading>
            <HtmlContent>{data}</HtmlContent>
          </Paper>
          <Spacer />
        </Grid>
      )}
    </>
  )
}
