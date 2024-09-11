import React from "react"
import PropTypes from "prop-types"
import { LazyLoadImage } from "react-lazy-load-image-component"
import "react-lazy-load-image-component/src/effects/blur.css"

export default function ParkPhoto({ type, src, alt }) {
  return (
    <div className={`park-photo park-photo--${type}`}>
      <LazyLoadImage src={src} alt={alt ?? ""} effect="opacity" />
    </div>
  )
}

ParkPhoto.propTypes = {
  type: PropTypes.oneOf(["big", "small", "blur"]),
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
}
