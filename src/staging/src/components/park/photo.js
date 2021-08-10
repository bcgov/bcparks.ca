import React from "react"
import { Divider, Paper } from "@material-ui/core"
import Img, { FixedObject } from "gatsby-image"

export default function Photo({ photos }) {
  return (
    <>
      {photos && (
        <Img
          fixed={photos.thumbnail.localFile.childImageSharp.fixed}
          alt="image file"
        />
      )}
    </>
  )
}
