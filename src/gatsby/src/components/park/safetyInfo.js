import React from "react"

import HtmlContent from "./htmlContent"

// TODO: this component needs to be converted to bootstrap but
// it should be done at the same time as the other sections
// to match spacing
export default function SafetyInfo({ safetyInfo }) {
  return (
    <div
      id="park-safety-info-container"
      className="anchor-link"
    >
      <h2 className="section-heading">Safety info</h2>
      {safetyInfo && (
        <HtmlContent>{safetyInfo}</HtmlContent>
      )}
    </div>
  )
}
