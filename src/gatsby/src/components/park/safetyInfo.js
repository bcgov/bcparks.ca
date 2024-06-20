import React from "react"
import HtmlContent from "./htmlContent"

export default function SafetyInfo({ safetyInfo }) {
  return (
    <div id="park-safety-info-container" className="mb-4">
      <h3>Safety information</h3>
      <HtmlContent>{safetyInfo}</HtmlContent>
    </div>
  )
}
