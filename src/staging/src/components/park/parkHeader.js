import React from "react"
import { Grid, Button } from "@material-ui/core"

export default function ParkHeader({ data }) {
  return (
    <>
      <div id="park-header-container">
        <div className="park-header">
          <Grid container spacing={3} className="park-header-title">
            <Grid item xs={12} sm={8}>
              <h1>{data.protectedAreaName}</h1>
            </Grid>
            <Grid
              item
              xs={12}
              sm={4}
              spacing={3}
              container
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button className="yellow-button">Get a daypass</Button>
              <Button
                className="blue-button"
                href="https://discovercamping.ca/"
              >
                Book a campsite
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  )
}
