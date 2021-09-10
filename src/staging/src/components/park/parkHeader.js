import React from "react"
import { Grid, Button, Box, Paper, Hidden } from "@material-ui/core"
import ParkAccessStatus from "./parkAccessStatus"
import Advisory from "./advisory"

export default function ParkHeader({ data }) {
  const { advisories, parkAccessStatus, park } = data
  return (
    <Paper elevation={0} id="park-header-container">
      <div className="col-12 no-padding">
        <Grid item xs={12}>
          <Box mt={0}>
            <h1 className="park-heading">{park.protectedAreaName}</h1>
          </Box>
        </Grid>
        <Hidden smDown implementation="css">
          <div className="flex-display p10t">
            <Grid item xs={12} sm={12} md={7} lg={7}>
              <Button
                className="yellow-button"
                href="https://discovercamping.ca/"
              >
                Book a campsite
              </Button>
              <Button className="blue-button ml10" href="#">
                Get a daypass
              </Button>
            </Grid>

            <Grid
              item
              xs={12}
              sm={12}
              md={5}
              lg={5}
              className="park-info-header-flex"
            >
              <div className="park-info-header">
                <ParkAccessStatus data={parkAccessStatus.accessStatus} />
              </div>
              <div className="park-info-header">
                <Advisory data={advisories} />
              </div>
            </Grid>
          </div>
        </Hidden>
        <Hidden smUp implementation="css">
          <Grid item xs={12} sm={12} className="park-info-header-flex">
            <div className="park-info-header">
              <ParkAccessStatus data={parkAccessStatus.accessStatus} />
            </div>
            <div className="park-info-header">
              <Advisory data={advisories} />
            </div>
          </Grid>
          <Grid item xs={12}>
            <div className="p20t">
              <Button
                className="yellow-button full-width"
                href="https://discovercamping.ca/"
              >
                Book a campsite
              </Button>
            </div>
            <div className="p10t">
              <Button className="blue-button full-width" href="#">
                Get a daypass
              </Button>
            </div>
          </Grid>{" "}
        </Hidden>
      </div>
    </Paper>
  )
}
