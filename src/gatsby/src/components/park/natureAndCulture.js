import React from "react"

import HtmlContent from "./htmlContent"

export default function NatureAndCulture({ natureAndCulture, parkType }) {
  return (
    <div id="park-nature-and-culture-container" className="anchor-link" >
      <h2 className="section-heading">About this {parkType}</h2>
      <HtmlContent>{natureAndCulture}</HtmlContent>
    </div>
  )
}