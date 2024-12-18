import React, { useState } from "react"
import Row from "react-bootstrap/Row"
import Col from "react-bootstrap/Col"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faImages } from "@fortawesome/free-solid-svg-icons"
import Lightbox from "yet-another-react-lightbox"
import Captions from "yet-another-react-lightbox/plugins/captions"
import Thumbnails from "yet-another-react-lightbox/plugins/thumbnails"
import Zoom from "yet-another-react-lightbox/plugins/zoom"
import Slideshow from "yet-another-react-lightbox/plugins/slideshow"
import Fullscreen from "yet-another-react-lightbox/plugins/fullscreen"
import "yet-another-react-lightbox/styles.css"
import "yet-another-react-lightbox/plugins/captions.css"
import "yet-another-react-lightbox/plugins/thumbnails.css"

import ParkPhoto from "./parkPhoto"

const ShowPhotos = ({ text, setPhotoIndex }) => {
  return (
    <button
      aria-label="Show photos"
      className="btn show-photo-button"
      onClick={() => setPhotoIndex(0)}
    >
      <FontAwesomeIcon icon={faImages} className="photo-icon" />
      {text}
    </button>
  )
}

export default function ParkPhotoGallery({ photos }) {
  const [photoIndex, setPhotoIndex] = useState(-1)
  const photoSlides = []
  const parkPhotos = photos.map((photo, index) => {
    const getCaptionText = (photo) => {
      const caption = photo.caption.data?.caption || "";
      const showCredit = (photo?.showPhotoCredit && photo?.photographer) ?
        `<span class="photo-credit">| Photo by ${photo.photographer}</span>` : ""
      return `${caption}${showCredit}`
    }
    const captionText = getCaptionText(photo)
    return {
      index: index,
      caption: captionText,
      altText: captionText.replace(/(<([^>]+)>)/ig, ''), // strip html tags
      imageUrl: photo.imageUrl,
    }
  })
  parkPhotos.map((photo) =>
    photoSlides.push({
      src: photo.imageUrl,
      description: React.createElement("div", { dangerouslySetInnerHTML: { __html: photo.caption } })
    })
  )

  return (
    <>
      <Lightbox
        index={photoIndex}
        open={photoIndex >= 0}
        close={() => setPhotoIndex(-1)}
        slides={photoSlides}
        carousel={{ finite: "false" }}
        captions={{ descriptionTextAlign: "center", descriptionMaxLines: 5 }}
        thumbnails={{ border: 0 }}
        plugins={[Captions, Thumbnails, Zoom, Slideshow, Fullscreen]}
      />
      {/* photo gallery for pc */}
      <div className="park-photo-gallery d-none d-md-block">
        {parkPhotos.length > 0 && (
          <div
            id="park-photo-gallery-container"
            className="park-photo-gallery-container"
          >
            {parkPhotos.length === 1 && (
              <Row className="g-0">
                <Col className="px-0">
                  <ParkPhoto
                    type="big"
                    photoIndex={0}
                    setPhotoIndex={setPhotoIndex}
                    src={parkPhotos[0].imageUrl}
                    alt={parkPhotos[0].altText}
                  />
                  <div className="show-photos">
                    <ShowPhotos
                      text="Show photo"
                      setPhotoIndex={setPhotoIndex}
                    />
                  </div>
                </Col>
              </Row>
            )}
            {(parkPhotos.length === 2 ||
              parkPhotos.length === 3 ||
              parkPhotos.length === 4) && (
                <Row className="g-0">
                  <Col xs={12} md={6} className="ps-0 pe-1">
                    <ParkPhoto
                      type="big"
                      photoIndex={0}
                      setPhotoIndex={setPhotoIndex}
                      src={parkPhotos[0].imageUrl}
                      alt={parkPhotos[0].altText}
                    />
                  </Col>
                  <Col xs={12} md={6} className="ps-1 pe-0">
                    <ParkPhoto
                      type="big"
                      photoIndex={1}
                      setPhotoIndex={setPhotoIndex}
                      src={parkPhotos[1].imageUrl}
                      alt={parkPhotos[1].altText}
                    />

                    <div className="show-photos">
                      <ShowPhotos
                        text="Show photos"
                        setPhotoIndex={setPhotoIndex}
                      />
                    </div>
                  </Col>
                </Row>
              )}
            {parkPhotos.length > 4 && (
              <Row className="g-0">
                <Col xs={12} md={6} className="ps-0 pe-1">
                  {parkPhotos
                    .filter(f => f.index === 0)
                    .map((photo, index) => (
                      <ParkPhoto
                        type="big"
                        photoIndex={0}
                        setPhotoIndex={setPhotoIndex}
                        src={photo.imageUrl}
                        alt={photo.altText}
                        key={index}
                      />
                    ))}
                </Col>
                <Col xs={12} md={6} className="px-0">
                  <Row className="position-relative g-0">
                    {parkPhotos
                      .filter(
                        photo => photo.index > 0 && photo.index <= 4
                      )
                      .map((photo, index) => (
                        <Col xs={6} key={index} className="ps-2 pb-2">
                          <ParkPhoto
                            type="small"
                            photoIndex={index + 1}
                            setPhotoIndex={setPhotoIndex}
                            src={photo.imageUrl}
                            alt={photo.altText}
                            key={index}
                          />
                        </Col>
                      ))}
                    <div className="show-photos">
                      <ShowPhotos
                        text="Show photos"
                        setPhotoIndex={setPhotoIndex}
                      />
                    </div>
                  </Row>
                </Col>
              </Row>
            )}
          </div>
        )}
      </div>
      {/* photo gallery for mobile */}
      <div className="park-photo-gallery d-block d-md-none">
        {parkPhotos.length > 0 && (
          <div
            id="park-photo-gallery-container"
            className="park-photo-gallery-container"
          >
            <Row className="g-0">
              <Col className="px-0">
                <ParkPhoto
                  type="big"
                  photoIndex={0}
                  setPhotoIndex={setPhotoIndex}
                  src={parkPhotos[0].imageUrl}
                  alt={parkPhotos[0].altText}
                />
                <div className="show-photos">
                  <ShowPhotos
                    text={parkPhotos.length}
                    setPhotoIndex={setPhotoIndex}
                  />
                </div>
              </Col>
            </Row>
          </div>
        )}
      </div>
    </>
  )
}
