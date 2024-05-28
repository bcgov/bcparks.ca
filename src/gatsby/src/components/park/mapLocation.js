import React, { useRef } from "react"

export default function MapLocation({ locationNotes }) {
  const mapRef = useRef("")
  return (
    <div id="park-maps-location-container" className="anchor-link" ref={mapRef}>
      <h2 className="section-heading">Maps and location</h2>
      {locationNotes && (
        <div
          id="park-location-notes-container"
          dangerouslySetInnerHTML={{ __html: locationNotes }}
        >
        </div>
      )}
    </div>
  )
}
