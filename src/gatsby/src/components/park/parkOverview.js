import React, { useState, useEffect, useRef, useCallback } from "react"

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
  const [oldHash, setOldHash] = useState("");
  const ref = useRef(null)

  const checkHash = useCallback(() => {
    const hash = window.document.location.hash;
    const idInOverview = !!window.document.querySelector(`#park-overview-container ${hash}`);
    if (hash && idInOverview) {
      setExpanded(true)
    }
  }, [setExpanded])

  useEffect(() => {
    // when the user clicks an anchor link, check if they are navigating to something in the 
    // park overview section and expand the section if it's collapsed
    window.addEventListener("hashchange", function (e) {
      checkHash();
    })
    checkHash();
  }, [parkOverview, checkHash])

  useEffect(() => {
    setHeight(ref.current.clientHeight);
    const hash = window.document.location.hash;
    if (oldHash !== hash) {
      window.document.getElementById(hash.slice(1)).scrollIntoView();
      setOldHash(hash);
    }
  }, [expanded, oldHash, setOldHash])

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
