import React, { useState } from "react"
import { Box, Paper, Link, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

const useStyles = makeStyles(theme => ({
  collapsed: {
    maxHeight: "263px",
    overflow: "hidden",
    display: "block",
    textOverflow: "ellipsis",
  },
  expanded: {
    maxHeight: "auto",
  },
  link: { color: "#003366" },
}))

export default function ParkOverview({ data: parkOverview }) {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)

  return (
    <Grid item xs={12} id="park-overview-container" className="anchor-link">
      <div className="anchor-link">
        <Paper elevation={0}>
          <Box className={expanded ? classes.expanded : classes.collapsed}>
            <Heading>Park overview</Heading>
            <HtmlContent className="park-overview-html">
              {parkOverview}
            </HtmlContent>
          </Box>
          <Link
            component="button"
            href="#park-overview-container"
            className={classes.link}
            onClick={() => {
              setExpanded(!expanded)
            }}
          >
            <br />
            {expanded ? "Read less" : "Read more"}
          </Link>
          <Spacer />
        </Paper>
      </div>
    </Grid>
  )
}
