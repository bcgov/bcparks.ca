import React, { useState } from "react"
import Lightbox from "react-image-lightbox"
import "react-image-lightbox/style.css"

export default function ParkPhotoGallery({ photos }) {
  const [index, setIndex] = useState(0)
  const [isOpen, setIsOpen] = useState(false)

  const handleCloseRequest = () => {
    setIsOpen(false)
  }

  const handleNext = () => {
    setIndex((index + 1) % images.length)
  }

  const handlePrevious = () => {
    setIndex((index + images.length - 1) % images.length)
  }

  const images = photos.nodes

  //   console.log(images[0].image.localFile.childImageSharp.gatsbyImageData.images.fallback.src)
  return (
    <>
      <Lightbox
        mainSrc={
          images[index].image.localFile.childImageSharp.gatsbyImageData.images
            .fallback.src
        }
        nextSrc={images[(index + 1) % images.length]}
        prevSrc={images[(index + images.length - 1) % images.length]}
        onCloseRequest={handleCloseRequest}
        onMovePrevRequest={handlePrevious}
        onMoveNextRequest={handleNext}
      />
    </>
  )
}
