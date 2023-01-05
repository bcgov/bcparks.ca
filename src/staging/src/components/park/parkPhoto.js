import React from "react"
import PropTypes from "prop-types"

/* Simple image wrapper - essentially GatsbyImage for remote images */
export default function ParkPhoto({ type, src, alt }) {

  return (
    <div className={`park-photo park-photo--${type}`}>
      <img src={src} alt={alt ?? ""} />
    </div>
  )
}

ParkPhoto.propTypes = {
  type: PropTypes.oneOf(["big", "small", "blur"]),
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
}
