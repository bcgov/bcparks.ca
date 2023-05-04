import React from "react"
import { Paper, Container, Grid } from "@material-ui/core"

import Heading from "./heading"
import Spacer from "./spacer"

export default function AccessibilityDetails({ data }) {
  return (
    <>
      {data && (
        <Grid
          xs={12}
          id="accessibility-details-container"
          className="anchor-link"
        >
          <Paper elevation={0}>
            <Heading>Accessibility</Heading>
            <Container>
              <p>{data}</p>
            </Container>
            <Spacer />
          </Paper>
        </Grid>
      )}
    </>
  )
}
