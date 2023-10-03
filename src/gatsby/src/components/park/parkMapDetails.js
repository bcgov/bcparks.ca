import React from "react"

import { capitalizeFirstLetter } from "../../utils/helpers";

import HtmlContent from "./htmlContent"

export default function ParkMapDetails({ data, type }) {
  return (
    <>
      {data && (
        <div id="park-map-details-container" className="anchor-link">
          <h2 className="section-heading">{capitalizeFirstLetter(`${type} and activity maps`)}</h2>
          <HtmlContent>{data}</HtmlContent>
        </div>
      )}
    </>
  )
}
