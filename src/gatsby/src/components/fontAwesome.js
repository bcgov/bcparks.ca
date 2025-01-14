import React from "react"

const FontAwesome = ({ icon, size, className }) => {
	let iconSrc = null
	if (icon && icon.startsWith("https://")) {
		iconSrc = icon
	} else if (icon && icon.indexOf(".svg") === -1) {
		iconSrc = `/fontAwesomeIcons/${icon}.svg`
	} else if (icon) {
		iconSrc = `/fontAwesomeIcons/${icon}`
	} else {
		return null
	}

	return (
		<img src={iconSrc} alt="" width={size} height={size} className={className} />
	)
}

export default FontAwesome