import React from "react"

import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

export default function NatureAndCulture({ data }) {
  return (
    <div
      id="park-nature-and-culture-container"
      className="anchor-link"
    >
        <h2 className="section-heading">Nature and culture</h2>
        <HtmlContent>{data}</HtmlContent>
        <Spacer />
    </div>
  )
}