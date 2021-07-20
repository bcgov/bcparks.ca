import React from "react"
import { css } from "@emotion/react"
import { useStaticQuery, Link, graphql } from "gatsby"

import { rhythm } from "../utils/typography"

export default function HTMLArea(props)
{
  if (!props.isVisible) {
    return null;
  }
    return (
    <div dangerouslySetInnerHTML={{ __html: props.children}}/>
  )
}