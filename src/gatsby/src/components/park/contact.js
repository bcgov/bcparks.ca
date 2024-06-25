import React from "react"
import HtmlContent from "./htmlContent"
import { capitalizeFirstLetter } from "../../utils/helpers"

export default function About({ parkType, contact }) {
  return (
    <div id="park-contact-container" className="anchor-link">
      <h2 className="section-heading">Contact</h2>
      <h3>{capitalizeFirstLetter(parkType)} contact</h3>
      <HtmlContent>{contact}</HtmlContent>
    </div>
  )
}
