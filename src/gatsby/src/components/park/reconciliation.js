import React from "react"

import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

export default function Reconciliation({ data }) {
  return (
    <div
      id="park-reconciliation-container"
      className="anchor-link"
    >
        <h2 className="section-heading">Reconciliation with Indigenous Peoples</h2>
        <HtmlContent>{data}</HtmlContent>
        <Spacer />
    </div>
  )
}
