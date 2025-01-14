import React from "react"

import HtmlContent from "../htmlContent"

export default function Reconciliation({ data }) {
  return (
    <div id="reconciliation" className="anchor-link">
      {/* id="park-reconciliation-container" should be removed once it's removed from the contents */}
      <h2 id="park-reconciliation-container" className="section-heading">
        Reconciliation with Indigenous Peoples
      </h2>
      <HtmlContent>{data}</HtmlContent>
    </div>
  )
}
