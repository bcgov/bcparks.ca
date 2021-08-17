import React from "react"
import { Grid, Container, Button, Box } from "@material-ui/core"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

export default function ParkHeader({ data }) {
  if (!data.photo)
    return (
      <>
        <h1>{data.protectedAreaName}</h1>
      </>
    )
  const image = getImage(data.photo.image.localFile)
  return (
    <>
      <div id="park-header-container">
        <GatsbyImage image={image} alt={data.protectedAreaName} />
        <div className="park-header">
          <Grid container>
            <Grid item xs={12} sm={6}>
              <h1>{data.protectedAreaName}</h1>
            </Grid>
            <Grid
              item
              xs={12}
              sm={6}
              container
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Box m={1}>
                <Button variant="contained" className="yellow-button">
                  Get a daypass
                </Button>
              </Box>
              <Box m={1}>
                <Button variant="contained" className="blue-button">
                  Book a campsite
                </Button>
              </Box>
            </Grid>
          </Grid>
        </div>
      </div>
    </>
  )
}
