import React from "react"
import { Link } from "gatsby"
import { Paper, Grid, Typography } from "@material-ui/core"
import ParkEvent from "../park/parkEvent"
import CampfireBan from "./campfireBan"
import DayUse from "../park/dayUse"
import PetsOnLeash from "../park/petsOnLeash"
import ParkActivityMap from "../park/parkActivityMap"
import Accessibility from "../park/accessibility"

export default function ParkStatus({ data }) {
  const { hasCampfireBan, hasSmokingBan } = data.parkAccessStatus
  return (
    <>
      <Paper>
        <Grid container spacing={2}>
          <Grid item md={4} sm={6} xs={12}>
            <Paper>
              <Typography>{data.parkAccessStatus.accessStatus}</Typography>
            </Paper>
          </Grid>
          <ParkEvent data={data.advisories} />
          <CampfireBan
            data={{
              hasCampfireBan,
              hasSmokingBan,
            }}
          />
          <DayUse data={data.parkAccessStatus.parkFacilities} />
          <ParkActivityMap />
          <PetsOnLeash />
          <Accessibility />
        </Grid>
      </Paper>
    </>
  )
}
