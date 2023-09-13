import React from "react"

import Spacer from "./spacer"

export default function AccessibilityDetails({ data }) {
  return (
    <>
      {data && (
        <div
          id="accessibility-details-container"
          className="anchor-link"
        >
          <h1>AccessibilityDetails</h1>
             <h2 className="section-heading">Accessibility</h2>
            <div>
              <p>{data}</p>
            </div>
            <Spacer />
        </div>
      )}
    </>
  )
}
