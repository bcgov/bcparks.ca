import React, { useState } from "react"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import { Paper, MobileStepper, Button, Typography } from "@material-ui/core"
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight"
import { GatsbyImage } from "gatsby-plugin-image"

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
    flexGrow: 1,
  },
})

export default function ParkPhotos({ photos }) {
  const classes = useStyles()
  const parkPhotosData = photos.nodes.map(photo => {
    return {
      label: photo.caption || "_",
      image: photo.thumbnail.localFile.childImageSharp.gatsbyImageData,
    }
  })

  const theme = useTheme()
  const [activeStep, setActiveStep] = useState(0)

  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }

  if (parkPhotosData.length === 0) return null

  return (
    <div className={classes.root}>
      <Paper square elevation={0}>
        <Typography noWrap>{parkPhotosData[activeStep].label}</Typography>
      </Paper>
      <GatsbyImage
        image={parkPhotosData[activeStep].image}
        alt={parkPhotosData[activeStep].label}
      />
      <MobileStepper
        variant="dots"
        steps={6}
        position="static"
        activeStep={activeStep}
        className={classes.root}
        nextButton={
          <Button size="small" onClick={handleNext} disabled={activeStep === 5}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowLeft />
            ) : (
              <KeyboardArrowRight />
            )}
          </Button>
        }
        backButton={
          <Button size="small" onClick={handleBack} disabled={activeStep === 0}>
            {theme.direction === "rtl" ? (
              <KeyboardArrowRight />
            ) : (
              <KeyboardArrowLeft />
            )}
          </Button>
        }
      />
    </div>
  )
}
