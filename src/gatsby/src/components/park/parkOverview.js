import React, { useState, useEffect, useRef } from "react"

import { capitalizeFirstLetter } from "../../utils/helpers";

import HtmlContent from "./htmlContent"

import * as cheerio from 'cheerio';

const PREFIX = 'park-overview';

const classes = {
  collapsed: `${PREFIX} collapsed`,
  expanded: `${PREFIX} expanded`
};

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
    <div id="park-overview-container" className="anchor-link">
      <div className={expanded ? classes.expanded : classes.collapsed} ref={ref}>
        <h2 className="section-heading">{capitalizeFirstLetter(`${type} overview`)}</h2>
        <HtmlContent className="park-overview-html">
          {expanded ? parkOverview : collapsedParkOverview}
        </HtmlContent>
      </div>
      {isLong && 
        <a
          href="#park-overview-container"
          className="park-overview-link"
          onClick={() => {
            setExpanded(!expanded)
          }}>
        {expanded ? "Read less" : "Read more"}
      </a>
      }
      </div>
  );
}
