import React from "react"
import { Grid, Button } from "@material-ui/core"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

export default function ParkHeader({ data }) {
  let image = null
  if (data.photo) image = getImage(data.photo.image.localFile)
  return (
    <>
      <div id="park-header-container">
        {data.photo && (
          <div className="park-header-photo">
            <GatsbyImage image={image} alt={data.protectedAreaName} />
          </div>
        )}
        <div className="park-header">
          <Grid container spacing={3} className="park-header-title">
            <Grid item xs={12} sm={6}>
              <h1>{data.protectedAreaName}</h1>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              spacing={3}
              container
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Button variant="contained" className="yellow-button">
                Get a daypass
              </Button>
              <Button variant="contained" className="blue-button">
                Book a campsite
              </Button>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  )
}
