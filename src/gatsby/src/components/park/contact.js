import React from "react"
import HtmlContent from "./htmlContent"

export default function About({ contact }) {
  return (
    <div id="park-contact-container" className="anchor-link">
      <h2 className="section-heading">Contact</h2>
      <HtmlContent>{contact}</HtmlContent>
    </div>
  )
}
