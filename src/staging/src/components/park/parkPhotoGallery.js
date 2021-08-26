import React, { useState } from "react"
import { makeStyles, useTheme } from "@material-ui/core/styles"
import { MobileStepper, Button } from "@material-ui/core"
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft"
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight"
import { GatsbyImage } from "gatsby-plugin-image"
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox"

const useStyles = makeStyles({
  root: {
    maxHeight: 300,
    flexGrow: 1,
    overflow: "hidden",
  },
  otherPhoto: {
    visibility: "hidden",
    maxHeight: 1,
  },
})

export default function ParkPhotoGallery({ photos }) {
  const classes = useStyles()
  const parkPhotos = photos.nodes.map((photo, index) => {
    return {
      index: index,
      caption: photo.caption || "_",
      image: photo.image.localFile.childImageSharp.gatsbyImageData,
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

  if (parkPhotos.length === 0) return null

  return (
    <>
      <div id="park-photo-carousel-container" className={classes.root}>
        <SimpleReactLightbox>
          <SRLWrapper>
            <GatsbyImage
              image={parkPhotos[activeStep].image}
              alt={parkPhotos[activeStep].caption}
            />
            {parkPhotos
              .filter(f => f.index !== activeStep)
              .map((photo, index) => (
                <GatsbyImage
                  className={classes.otherPhoto}
                  image={photo.image}
                  alt={photo.caption}
                  key={index}
                />
              ))}
          </SRLWrapper>
        </SimpleReactLightbox>
      </div>
      <MobileStepper
        variant="dots"
        steps={parkPhotos.length}
        position="static"
        activeStep={activeStep}
        nextButton={
          <Button
            size="small"
            onClick={handleNext}
            disabled={activeStep === parkPhotos.length - 1}
          >
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
    </>
  )
}
