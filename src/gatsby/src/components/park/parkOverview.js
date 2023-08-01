import React, { useState, useEffect, useRef } from "react"
import { styled } from '@mui/material/styles';
import { Box, Paper, Link, Grid } from "@mui/material"

import { capitalizeFirstLetter } from "../../utils/helpers";

import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

import * as cheerio from 'cheerio';

const PREFIX = 'parkOverview';

const classes = {
  collapsed: `${PREFIX}-collapsed`,
  expanded: `${PREFIX}-expanded`,
  link: `${PREFIX}-link`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.collapsed}`]: {
    maxHeight: "260px",
    overflow: "hidden",
    display: "block",
    textOverflow: "ellipsis",
  },
  [`& .${classes.expanded}`]: {
    maxHeight: "none",
  },
  [`& .${classes.link}`]: {
    color: "#003366",
    marginTop: "24px",
  }
}));

export default function ParkOverview({ data: parkOverview, type }) {
  const [expanded, setExpanded] = useState(false)
  const [height, setHeight] = useState(0)
  const ref = useRef(null)

  useEffect(() => {
    setHeight(ref.current.clientHeight)
  }, [expanded])

  const isLong = height > 259

  const $ = cheerio.load(parkOverview);
  $('a').attr('tabindex', '-1')
  const collapsedParkOverview = $.html()

  return (
    <Root id="park-overview-container" className="anchor-link">
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
              underline="hover">
            {expanded ? "Read less" : "Read more"}
          </Link>
          }
          <Spacer />
        </Paper>
      </Grid>
    </Root>
  );
}
