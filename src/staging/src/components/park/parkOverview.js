import React, { useState, useEffect, useRef } from "react"
import { Box, Paper, Link, Grid } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import { capitalizeFirstLetter } from "../../utils/helpers";

import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

const useStyles = makeStyles(theme => ({
  collapsed: {
    maxHeight: "260px",
    overflow: "hidden",
    display: "block",
    textOverflow: "ellipsis",
  },
  expanded: {
    maxHeight: "auto",
  },
  link: { color: "#003366" },
}))

export default function ParkOverview({ data: parkOverview, type }) {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    setHeight(ref.current.clientHeight)
  })
  const isLong = height >= 260

  return (
    <div id="park-overview-container" className="anchor-link">
      <Grid item xs={12} className="anchor-link">
        <Paper elevation={0}>
          <Box className={expanded ? classes.expanded : classes.collapsed} ref={ref}>
            <Heading>{capitalizeFirstLetter(`${type} overview`)}</Heading>
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
            {isLong && (expanded ? "Read less" : "Read more")}
          </Link>
          <Spacer />
        </Paper>
      </Grid>
    </div>
  )
}
