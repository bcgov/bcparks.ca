import React from "react"
import { Paper, Grid } from "@material-ui/core"
import { StaticImage } from "gatsby-plugin-image"
import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

export default function MapLocation({ data }) {
  return (
    <Grid item xs={12} id="park-map-container" className="anchor-link">
      <Paper elevation={0}>
        <Heading>Maps and Location</Heading>
        <StaticImage
          src="../../images/map-placeholder.png"
          alt="map"
          placeholder="blurred"
          aspectRatio={3 / 2}
        />
        <HtmlContent>{data}</HtmlContent>
        <Spacer />
      </Paper>
    </Grid>
  )
}
