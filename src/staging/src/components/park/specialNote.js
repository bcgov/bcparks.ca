import React from "react"
import { Paper, Grid } from "@material-ui/core"

import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

export default function SpecialNote({ specialNotes }) {
  return (
    <>
      <Grid
        item
        xs={12}
        id="park-special-notes-container"
        className="anchor-link"
      >
        <Paper elevation={0}>
          <Heading>Special notes</Heading>
          {specialNotes && (
            <HtmlContent>{specialNotes}</HtmlContent>
          )}
          <Spacer />
        </Paper>
      </Grid>
    </>
  )
}
