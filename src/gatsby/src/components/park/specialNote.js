import React from "react"
import HtmlContent from "../htmlContent"

export default function SpecialNote({ specialNotes }) {
  return (
    <div id="visitor-guidelines" className="mb-4">
      {/* id="park-special-notes-container" should be removed once it's removed from the contents */}
      <h3 id="park-special-notes-container">Special notes</h3>
      <HtmlContent>{specialNotes}</HtmlContent>
    </div>
  )
}
