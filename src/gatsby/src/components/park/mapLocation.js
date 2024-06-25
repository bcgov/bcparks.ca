import React from "react"
import HtmlContent from "./htmlContent"

export default function MapLocation({ maps, locationNotes }) {
  return (
    <div id="park-maps-location-container" className="anchor-link">
      {/* id="park-map-details-container" can be removed once it's no longer used */}
      <h2 id="park-map-details-container" className="section-heading">
        Maps and location
      </h2>
      {maps && (
        <HtmlContent>{maps}</HtmlContent>
      )}
      {locationNotes && (
        <>
          <h3>Getting there</h3>
          <HtmlContent>{locationNotes}</HtmlContent>
        </>
      )}
    </div>
  )
}
