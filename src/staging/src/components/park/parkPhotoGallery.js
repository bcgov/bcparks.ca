import React, { useState, useEffect } from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Button, Grid, Box, Divider, Hidden } from "@material-ui/core"
import { GatsbyImage } from "gatsby-plugin-image"
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox"
import PhotoLibraryOutlinedIcon from "@material-ui/icons/PhotoLibraryOutlined"

const useStyles = makeStyles({
  bigPhoto: {
    objectFit: "cover",
    overflow: "hidden",
    height: 280,
    zIndex: 2,
  },
  blurPhoto: {
    objectFit: "cover",
    overflow: "hidden",
    height: 280,
    zIndex: 2,
    filter: "blur(2px)",
  },
  smallPhoto: {
    objectFit: "cover",
    overflow: "hidden",
    height: 136,
    zIndex: 2,
  },
})

export default function ParkPhotoGallery({ photos }) {
  const classes = useStyles()
  const [showPhoto, setShowPhoto] = useState(false)
  const parkPhotos = photos.nodes.map((photo, index) => {
    return {
      index: index,
      caption: photo.caption || "",
      image: photo.image.localFile.childImageSharp.gatsbyImageData,
    }
  })

  useEffect(() => {
    return
  }, [showPhoto])

  const srlOptions = {
    settings: {
      overlayColor: "rgb(0, 0, 0)",
      autoplaySpeed: 1500,
      transitionSpeed: 900,
    },
    thumbnails: {
      showThumbnails: false,
    },
    buttons: {
      showAutoplayButton: false,
      showDownloadButton: false,
      showFullscreenButton: false,
      showThumbnailsButton: false,
      size: "40px",
    },
  }

  if (parkPhotos.length === 0)
    return (
      <Grid item xs={12}>
        <br />
        <Divider />
        <br />
      </Grid>
    )

  return (
    <>
      {parkPhotos.length > 0 && (
        <>
          <Hidden smDown implementation="css">
            <Grid item xs={12} className="park-photo-container">
              <br />
              <Box
                id="park-photo-gallery-container"
                className={classes.photoGallery}
              >
                <SimpleReactLightbox>
                  <SRLWrapper options={srlOptions}>
                    {parkPhotos.length === 1 && (
                      <>
                        <Grid item container spacing={1}>
                          <Grid item xs={12} md={6}>
                            <GatsbyImage
                              className={classes.bigPhoto}
                              image={parkPhotos[0].image}
                              alt={parkPhotos[0].caption}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            className="show-photo-button"
                          >
                            <GatsbyImage
                              className={classes.blurPhoto}
                              image={parkPhotos[0].image}
                              alt={parkPhotos[0].caption}
                            />
                            <div className="show-photos">
                              <Button
                                className="show-photo-text"
                                onClick={() => {
                                  document
                                    .getElementsByTagName("picture")[0]
                                    .click()
                                }}
                              >
                                <PhotoLibraryOutlinedIcon className="photo-icon" />
                                Show Photos
                              </Button>
                            </div>
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {(parkPhotos.length === 2 ||
                      parkPhotos.length === 3 ||
                      parkPhotos.length === 4) && (
                      <>
                        <Grid item container spacing={1}>
                          <Grid item xs={12} md={6}>
                            <GatsbyImage
                              className={classes.bigPhoto}
                              image={parkPhotos[0].image}
                              alt={parkPhotos[0].caption}
                            />
                          </Grid>
                          <Grid
                            item
                            xs={12}
                            md={6}
                            className="show-photo-button"
                          >
                            <GatsbyImage
                              className={classes.bigPhoto}
                              image={parkPhotos[1].image}
                              alt={parkPhotos[1].caption}
                            />
                            <div className="show-photos">
                              <Button
                                className="show-photo-text"
                                onClick={() => {
                                  document
                                    .getElementsByTagName("picture")[0]
                                    .click()
                                }}
                              >
                                <PhotoLibraryOutlinedIcon className="photo-icon" />
                                Show Photos
                              </Button>
                            </div>
                            {parkPhotos
                              .filter(f => f.index > 1)
                              .map((photo, index) => (
                                <Grid
                                  item
                                  xs={6}
                                  key={index}
                                  className={`${showPhoto}? "" : hide-photo`}
                                >
                                  <GatsbyImage
                                    className={classes.smallPhoto}
                                    image={photo.image}
                                    alt={photo.caption}
                                    key={index}
                                  />
                                </Grid>
                              ))}
                          </Grid>
                        </Grid>
                      </>
                    )}
                    {parkPhotos.length > 4 && (
                      <>
                        <Grid item container spacing={1}>
                          <Grid item xs={12} md={6}>
                            {parkPhotos
                              .filter(f => f.index === 0)
                              .map((photo, index) => (
                                <GatsbyImage
                                  className={classes.bigPhoto}
                                  image={photo.image}
                                  alt={photo.caption}
                                  key={index}
                                />
                              ))}
                          </Grid>
                          <Grid
                            item
                            container
                            xs={12}
                            md={6}
                            spacing={1}
                            className="show-photo-button"
                          >
                            {parkPhotos
                              .filter(f => f.index !== 0)
                              .map((photo, index) => (
                                <div key={index}>
                                  {index < 3 && (
                                    <Grid item xs={6} key={index}>
                                      <GatsbyImage
                                        className={classes.smallPhoto}
                                        image={photo.image}
                                        alt={photo.caption}
                                        key={index}
                                      />
                                    </Grid>
                                  )}
                                  {index === 4 && (
                                    <>
                                      <Grid item xs={6} key={index}>
                                        <GatsbyImage
                                          className={classes.smallPhoto}
                                          image={photo.image}
                                          alt={photo.caption}
                                          key={index}
                                        />
                                      </Grid>
                                    </>
                                  )}
                                  {index > 4 && (
                                    <>
                                      <Grid
                                        item
                                        xs={6}
                                        key={index}
                                        className={`${showPhoto}? "" : hide-photo`}
                                      >
                                        <GatsbyImage
                                          className={classes.smallPhoto}
                                          image={photo.image}
                                          alt={photo.caption}
                                          key={index}
                                        />
                                      </Grid>
                                    </>
                                  )}
                                </div>
                              ))}
                            <div className="show-photos-5">
                              <Button
                                className="show-photo-text"
                                onClick={() => {
                                  setShowPhoto(true)
                                  document
                                    .getElementsByTagName("picture")[0]
                                    .click()
                                }}
                              >
                                <PhotoLibraryOutlinedIcon className="photo-icon" />
                                Show Photos
                              </Button>
                            </div>
                          </Grid>
                        </Grid>
                      </>
                    )}
                  </SRLWrapper>
                </SimpleReactLightbox>
              </Box>
              <br />
              <br />
            </Grid>
          </Hidden>
          <Hidden smUp implementation="css">
            <Grid item xs={12} className="park-photo-container">
              <Box
                id="park-photo-gallery-container"
                className={classes.photoGallery}
              >
                <SimpleReactLightbox>
                  <SRLWrapper options={srlOptions}>
                    <Grid item container spacing={1}>
                      <Grid item xs={12} md={6}>
                        <GatsbyImage
                          className={classes.bigPhoto}
                          image={parkPhotos[0].image}
                          alt={parkPhotos[0].caption}
                        />
                        <div className="show-photos">
                          <Button
                            className="show-photo-text"
                            onClick={() => {
                              document
                                .getElementsByTagName("picture")[0]
                                .click()
                            }}
                          >
                            <PhotoLibraryOutlinedIcon className="photo-icon" />
                            {parkPhotos.length}
                          </Button>
                        </div>
                      </Grid>
                    </Grid>
                  </SRLWrapper>
                </SimpleReactLightbox>
              </Box>
              <br />
              <br />
            </Grid>
          </Hidden>
        </>
      )}
    </>
  )
}
