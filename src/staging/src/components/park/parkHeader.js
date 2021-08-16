import React from "react"
import { GatsbyImage, getImage } from "gatsby-plugin-image"

export default function ParkHeader({ data }) {
  if (!data.photo)
    return (
      <>
        <h1>{data.protectedAreaName}</h1>
      </>
    )
  const image = getImage(data.photo.image.localFile)
  return (
    <>
      <div id="park-header-container">
        <h1>{data.protectedAreaName}</h1>
        <GatsbyImage image={image} alt={data.protectedAreaName} />
      </div>
    </>
  )
}
