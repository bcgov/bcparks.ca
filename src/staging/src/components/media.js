import React from "react"
import { css } from "@emotion/react"
import { useStaticQuery, Link, graphql } from "gatsby"
import {StaticImage} from "gatsby-plugin-image"

import { rhythm } from "../utils/typography"

export default function Media(props)
{
  if (!props.isVisible) {
    return null;
  }
    return (
    <img src={props.url} />
  )
}