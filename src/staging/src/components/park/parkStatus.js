import React from "react"
import { Paper, Grid } from "@material-ui/core"
import ParkAccessStatus from "./parkAccessStatus"
import Advisory from "./advisory"
import CampfireBan from "./campfireBan"
import DayUseCamping from "./dayUseCamping"
import PetsOnLeash from "./petsOnLeash"
import ParkMap from "./parkMap"
import Accessibility from "./accessibility"
import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles({
  topGrid: {
    backgroundColor: "#e1ecf4",
  },
})

export default function ParkStatus({ data }) {
  const classes = useStyles()
  const { advisories, parkAccessStatus, park } = data
  const { hasCampfireBan, hasSmokingBan } = parkAccessStatus
  return (
    <div id="park-status-container" className="anchor-link">
      <Paper elevation={0}>
        <Grid container spacing={0}>
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
          <DayUseCamping
            data={{
              parkFacilities: parkAccessStatus.parkFacilities,
              isDayUsePass: park.isDayUsePass,
            }}
          />
          <ParkMap />
          <PetsOnLeash data={parkAccessStatus.parkActivities} />
          <Accessibility parkFacilities={parkAccessStatus.parkFacilities} />
        </Grid>
      </Paper>
    </div>
  )
}
