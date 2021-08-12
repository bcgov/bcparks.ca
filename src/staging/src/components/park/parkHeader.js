import React from "react"
import { Paper, Grid } from "@material-ui/core"
import ParkAccessStatus from "./parkAccessStatus"
import Advisory from "./advisory"
import CampfireBan from "./campfireBan"
import DayUseCamping from "./dayUseCamping"
import PetsOnLeash from "./petsOnLeash"
import ParkMap from "./parkMap"
import Accessibility from "./accessibility"

export default function ParkHeader({ data }) {
  const { advisories, parkAccessStatus, park } = data
  const { hasCampfireBan, hasSmokingBan } = parkAccessStatus
  return (
    <div id="park-header-container">
      <Paper elevation={0}>
        <Grid container spacing={0}>
          <ParkAccessStatus data={parkAccessStatus.accessStatus} />
          <Advisory data={advisories} />
          <CampfireBan
            data={{
              hasCampfireBan,
              hasSmokingBan,
            }}
          />
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
