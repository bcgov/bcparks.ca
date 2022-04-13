import React from "react"
import { Paper, Grid } from "@material-ui/core"

import { capitalizeFirstLetter } from "../../utils/helpers";

import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

export default function ParkMapDetails({ data, type }) {
  return (
    <>
      {data && (
        <div id="park-map-details-container" className="anchor-link">
          <Grid item xs={12} className="anchor-link">
            <Paper elevation={0}>
              <Heading>{capitalizeFirstLetter(`${type} and activity maps`)}</Heading>
              <HtmlContent>{data}</HtmlContent>
            </Paper>
            <Spacer />
          </Grid>
        </div>
      )}
    </>
  )
}
