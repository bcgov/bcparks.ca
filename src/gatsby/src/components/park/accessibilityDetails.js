import React from "react"
import { Paper, Container, Grid } from "@mui/material"

import Spacer from "./spacer"

export default function AccessibilityDetails({ data }) {
  return (
    <>
      {data && (
        <div
          id="accessibility-details-container"
          className="anchor-link"
        >
          <h1>ZZZ - AccessibilityDetails</h1>
             <h2 className="section-heading">Accessibility</h2>
            <Container>
              <p>{data}</p>
            </Container>
            <Spacer />
        </div>
      )}
    </>
  )
}
