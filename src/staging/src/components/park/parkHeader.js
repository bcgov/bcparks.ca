import React from "react"
import { Grid, Button, Box, Paper } from "@material-ui/core"
import ParkAccessStatus from "./parkAccessStatus"
import Advisory from "./advisory"

export default function ParkHeader({ data }) {
  const { advisories, parkAccessStatus, park } = data
  return (
    <Paper elevation={0} id="park-header-container">
      <Grid item container spacing={2}>
        <Grid item xs={12}>
          <Box mt={0}>
            <h1>{park.protectedAreaName}</h1>
          </Box>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Button className="blue-button">Get a daypass</Button>
          <Button className="yellow-button" href="https://discovercamping.ca/">
            Book a campsite
          </Button>
        </Grid>
        <Grid item xs={12} sm={3}>
          <ParkAccessStatus data={parkAccessStatus.accessStatus} />
        </Grid>
        <Grid item xs={12} sm={3}>
          <Advisory data={advisories} />
        </Grid>
      </Grid>
    </Paper>
  )
}
