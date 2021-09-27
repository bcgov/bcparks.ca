import React from "react"
import { Paper, Grid } from "@material-ui/core"
import Heading from "./heading"
import Spacer from "./spacer"
import HtmlContent from "./htmlContent"

export default function ParkMapDetails({ data }) {
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
            <Heading>Park and activity maps</Heading>
            <HtmlContent>{data}</HtmlContent>
          </Paper>
          <Spacer />
        </Grid>
      )}
    </>
  )
}
