import React from "react"
import HtmlContent from "../htmlContent"

export default function SafetyInfo({ safetyInfo }) {
  return (
    <div id="visitor-guidelines" className="mb-4">
      {/* id="park-safety-info-container" should be removed once it's removed from the contents */}
      <h3 id="park-safety-info-container">Safety information</h3>
      <HtmlContent>{safetyInfo}</HtmlContent>
    </div>
  )
}
