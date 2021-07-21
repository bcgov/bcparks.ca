import React from "react"
import { css } from "@emotion/react"
import { useStaticQuery, Link, graphql } from "gatsby"

import { rhythm } from "../utils/typography"

export default function Footer({children}) {
  return (
    <footer id='footer' dangerouslySetInnerHTML={{ __html: children}}/>
  )
}