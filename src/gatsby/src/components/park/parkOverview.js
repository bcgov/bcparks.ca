import React, { useState, useEffect, useRef } from "react"
import { Box, Paper, Link, Grid } from "@mui/material"
import makeStyles from '@mui/styles/makeStyles'

import { capitalizeFirstLetter } from "../../utils/helpers";

import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

import * as cheerio from 'cheerio';

// when rewriting this to bootstrap, let's measure the height of the
// container and animate the window changing size
const useStyles = makeStyles(theme => ({
  collapsed: {
    maxHeight: "260px",
    overflow: "hidden",
    display: "block",
    textOverflow: "ellipsis",
  },
  expanded: {
    maxHeight: "none",
  },
  link: {
    color: "#003366",
    marginTop: "24px",
  },
}))

export default function ParkOverview({ data: parkOverview, type }) {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    setHeight(ref.current.clientHeight)
  }, [expanded])

  const isLong = height >= 260

  const $ = cheerio.load(parkOverview);
  $('a').attr('tabindex', '-1')
  const collapsedParkOverview = $.html()

  return (
    <div id="park-overview-container" className="anchor-link">
      <Grid item xs={12} className="anchor-link">
        <Paper elevation={0}>
          <Box className={expanded ? classes.expanded : classes.collapsed} ref={ref}>
            <Heading>{capitalizeFirstLetter(`${type} overview`)}</Heading>
            <HtmlContent className="park-overview-html">
              {expanded ? parkOverview : collapsedParkOverview}
            </HtmlContent>
          </Box>
          {isLong && 
            <Link
              component="button"
              href="#park-overview-container"
              className={classes.link}
              onClick={() => {
                setExpanded(!expanded)
              }}
            >
            {expanded ? "Read less" : "Read more"}
          </Link>
          }
          <Spacer />
        </Paper>
      </Grid>
    </div>
  )
}
