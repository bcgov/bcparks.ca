import React from "react"
import { Grid, Box } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import Advisory from "./advisory"
import CampfireBan from "./campfireBan"
import ParkAccessStatus from "./parkAccessStatus"

const useStyles = makeStyles({
  topGrid: {
    backgroundColor: "#e1ecf4",
  },
})

export default function ParkStatus({ data }) {
  const classes = useStyles()
  const { advisories, parkAccessStatus } = data
  const { hasCampfireBan, hasSmokingBan } = parkAccessStatus
  return (
    <Grid item xs={12} id="park-status-container" className="anchor-link">
      <Box m={2}>
        <Grid container item spacing={0} xs={12} className={classes.topGrid}>
          <ParkAccessStatus data={parkAccessStatus.accessStatus} />
          <Advisory data={advisories} />
          <CampfireBan
            data={{
              hasCampfireBan,
              hasSmokingBan,
            }}
          />
        </Grid>
      </Box>
    </Grid>
  )
}
