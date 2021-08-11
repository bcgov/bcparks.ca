import React from "react"
import { Paper, Grid } from "@material-ui/core"
import ParkAccessStatus from "./parkAccessStatus"
import ParkEvent from "./parkEvent"
import CampfireBan from "./campfireBan"
import DayUse from "./dayUse"
import PetsOnLeash from "./petsOnLeash"
import ParkMapHeader from "./parkMapHeader"
import Accessibility from "./accessibility"

export default function ParkHeader({ data }) {
  const { advisories, parkAccessStatus, park } = data
  const { hasCampfireBan, hasSmokingBan } = parkAccessStatus
  return (
    <div id="park-header">
      <Paper elevation={0}>
        <Grid container spacing={0}>
          <ParkAccessStatus data={parkAccessStatus.accessStatus} />
          <ParkEvent data={advisories} />
          <CampfireBan
            data={{
              hasCampfireBan,
              hasSmokingBan,
            }}
          />
          <DayUse
            data={{
              parkFacilities: parkAccessStatus.parkFacilities,
              isDayUsePass: park.isDayUsePass,
            }}
          />
          <ParkMapHeader />
          <PetsOnLeash data={parkAccessStatus.parkActivities} />
          <Accessibility />
        </Grid>
      </Paper>
    </div>
  )
}
