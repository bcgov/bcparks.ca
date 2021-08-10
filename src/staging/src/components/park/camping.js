import React from "react"
import { Grid } from "@material-ui/core"

export default function Camping({ hasCampingsFacility }) {
  if (hasCampingsFacility !== "Y") return null
  return (
    <>
      <Grid item xs={4}>
        Camping
      </Grid>
    </>
  )
}
