import React from "react"
import { Grid, Paper } from "@material-ui/core"

export default function CampfireBan({ data }) {
  const { hasCampfireBan, hasSmokingBan } = data
  if (hasCampfireBan !== "Y" && hasSmokingBan !== "Y") return null
  return (
    <>
      <Grid container item xs={12} sm={6} md={4}>
        <Paper>
          {hasCampfireBan === "Y" && <p>Campfire ban in effect</p>}
          {hasSmokingBan === "Y" && <p>Smoking ban in effect</p>}
        </Paper>
      </Grid>
    </>
  )
}
