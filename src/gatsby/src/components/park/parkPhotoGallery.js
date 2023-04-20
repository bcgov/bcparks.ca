import React, { useState } from "react"
import { Button, Grid, Box, Divider } from "@material-ui/core"
import SimpleReactLightbox, { SRLWrapper } from "simple-react-lightbox"
import PhotoLibraryOutlinedIcon from "@material-ui/icons/PhotoLibraryOutlined"
import { useLightbox } from "simple-react-lightbox"

import ParkPhoto from "./parkPhoto"

const ShowPhotos = ({ text, setShowPhotos }) => {
  const { openLightbox } = useLightbox()

  return (
    <Button
      className="show-photo-text"
      onClick={() => {
        setShowPhotos(true)
        openLightbox()
      }}
    >
      <PhotoLibraryOutlinedIcon className="photo-icon" />
      {text}
    </Button>
  )
}

export default function ParkPhotoGallery({ photos }) {
  const [showPhoto, setShowPhoto] = useState(false)
  const parkPhotos = photos.map((photo, index) => {
    return {
      index: index,
      caption: photo.caption || "",
      imageUrl: photo.imageUrl,
    }
  })

  const srlOptions = {
    settings: {
      overlayColor: "rgb(0, 0, 0)",
      autoplaySpeed: 1500,
      transitionSpeed: 900,
    },
    thumbnails: {
      showThumbnails: true,
    },
    buttons: {
      showAutoplayButton: true,
      showDownloadButton: false,
      showFullscreenButton: false,
      showThumbnailsButton: true,
      size: "40px",
    },
  }

  return (
    <>
      <div className="d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
        {parkPhotos.length === 0 && (
          <Grid item xs={12}>
            <br />
            <Divider />
            <br />
          </Grid>
        )}
        {parkPhotos.length > 0 && (
          <Grid
            item
            xs={12}
            className="park-photo-container this-is-small-photos"
            onClick={() => {
              if (!showPhoto) {
                setShowPhoto(true)
              }
            }}
          >
            <br />
            <Box
              id="park-photo-gallery-container"
            >
              <SimpleReactLightbox>
                <SRLWrapper options={srlOptions}>
                  {parkPhotos.length === 1 && (
                    <>
                      <Grid item container spacing={1}>
                        <Grid item xs={12} md={6}>
                          <ParkPhoto
                            type="small"
                            src={parkPhotos[0].imageUrl}
                            alt={parkPhotos[0].caption}
                          />
                        </Grid>
                        <Grid item xs={12} md={6} className="show-photo-button">
                          <ParkPhoto
                            type="blur"
                            src={parkPhotos[0].imageUrl}
                            alt={parkPhotos[0].caption}
                          />
                          <div className="show-photos">
                            <ShowPhotos
                              text="Show Photos"
                              setShowPhotos={setShowPhoto}
                            />
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
                          <ParkPhoto
                            type="big"
                            src={parkPhotos[0].imageUrl}
                            alt={parkPhotos[0].caption}
                          />
                        </Grid>
                        <Grid item xs={12} md={6} className="show-photo-button">
                          <ParkPhoto
                            type="big"
                            src={parkPhotos[1].imageUrl}
                            alt={parkPhotos[1].caption}
                          />

                          <div className="show-photos">
                            <ShowPhotos
                              text="Show Photos"
                              setShowPhotos={setShowPhoto}
                            />
                          </div>
                          {parkPhotos
                            .filter(photo => photo.index > 1)
                            .map((photo, index) => (
                              <Grid
                                item
                                xs={6}
                                key={index}
                                className={`${showPhoto}? "" : hide-photo`}
                              >
                                <ParkPhoto
                                  type="small"
                                  src={photo.imageUrl}
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
                              <ParkPhoto
                                type="big"
                                src={photo.imageUrl}
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
                          <>
                            {parkPhotos
                              .filter(
                                photo => photo.index > 0 && photo.index <= 4
                              )
                              .map((photo, index) => (
                                <Grid item xs={6} key={index}>
                                  <ParkPhoto
                                    type="small"
                                    src={photo.imageUrl}
                                    alt={photo.caption}
                                    key={index}
                                  />
                                </Grid>
                              ))}
                            {parkPhotos
                              .filter(photo => photo.index > 4)
                              .map((photo, index) => (
                                <Grid
                                  item
                                  xs={6}
                                  key={index}
                                  className={`${showPhoto}? "" : hide-photo`}
                                >
                                  <ParkPhoto
                                    type="small"
                                    src={photo.imageUrl}
                                    alt={photo.caption}
                                    key={index}
                                  />
                                </Grid>
                              ))}
                            <div className="show-photos-5">
                              <ShowPhotos
                                text="Show Photos"
                                setShowPhotos={setShowPhoto}
                              />
                            </div>
                          </>
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
        )}
      </div>
      <div className="d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
        {parkPhotos.length === 0 && <div className="p20t"></div>}
        {parkPhotos.length > 0 && (
          <Grid
            item
            xs={12}
            className="park-photo-container"
            onClick={() => {
              if (!showPhoto) {
                setShowPhoto(true)
              }
            }}
          >
            <Box
              id="park-photo-gallery-container"
            >
              <SimpleReactLightbox>
                <SRLWrapper options={srlOptions}>
                  <Grid item container spacing={1}>
                    <Grid item xs={12} md={12}>
                      <ParkPhoto
                        type="big"
                        src={parkPhotos[0].imageUrl}
                        alt={parkPhotos[0].caption}
                      />
                      <div className="show-photos">
                        <ShowPhotos
                          text={parkPhotos.length}
                          setShowPhotos={setShowPhoto}
                        />
                      </div>
                      {parkPhotos
                        .filter(photo => photo.index > 0)
                        .map((photo, index) => (
                          <Grid
                            item
                            xs={6}
                            key={index}
                            className={`${showPhoto}? "" : hide-photo`}
                          >
                            <ParkPhoto
                              type="small"
                              src={photo.imageUrl}
                              alt={photo.caption}
                              key={index}
                            />
                          </Grid>
                        ))}
                    </Grid>
                  </Grid>
                </SRLWrapper>
              </SimpleReactLightbox>
            </Box>
          </Grid>
        )}
      </div>
    </>
  )
}
