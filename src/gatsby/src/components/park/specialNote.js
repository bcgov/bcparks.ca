import React from "react"

import HtmlContent from "./htmlContent"

export default function SpecialNote({ specialNotes }) {
  return (
    <div
      id="park-special-notes-container"
      className="anchor-link"
    >
      <h2 className="section-heading">Special notes</h2>
      {specialNotes && (
        <HtmlContent>{specialNotes}</HtmlContent>
      )}
    </div>
  )
}
