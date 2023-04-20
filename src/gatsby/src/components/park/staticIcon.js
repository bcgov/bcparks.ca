/* Static SVG icon */
import React from "react"
import PropTypes from "prop-types"

export default function StaticIcon({ name, size }) {
  let iconSrc = null
  // Icons now reference a local file, but previously used a URL
  // Handle both cases for the time being
  if (name && name.startsWith("https://")) {
    iconSrc = name
  } else if (name && name.indexOf(".svg") === -1) {
    iconSrc = `/icons/${name}.svg`
  } else if (name) {
    iconSrc = `/icons/${name}`
  } else {
    return null
  }

  return <img src={iconSrc} alt="" width={size} height={size} />
}

StaticIcon.propTypes = {
  name: PropTypes.string.isRequired,
  size: PropTypes.number.isRequired,
}
