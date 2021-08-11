import React, { useState } from "react"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import { Paper, MobileStepper, Button, Typography } from "@material-ui/core"
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight"
import Img, { FixedObject } from "gatsby-image"

const useStyles = makeStyles({
  root: {
    maxWidth: 400,
    flexGrow: 1,
  },
})

export default function ParkPhotos({ photos }) {
  const classes = useStyles()
  console.log(photos)
  const parkPhotosData = photos.nodes.map(photo => {
    return {
      label: photo.caption,
      imgPath: photo.thumbnail.localFile.childImageSharp.fluid,
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
      <Paper square elevation={0} className={classes.header}>
        <Typography>{parkPhotosData[activeStep].label}</Typography>
      </Paper>
      <Img
        fluid={parkPhotosData[activeStep].imgPath}
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
