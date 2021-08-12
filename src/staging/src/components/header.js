import React from "react"
import { css } from "@emotion/react"
import { useStaticQuery, Link, graphql } from "gatsby"

import { rhythm } from "../utils/typography"

export default function Header({children}) {
    return (
    <header id='header' dangerouslySetInnerHTML={{ __html: children}}/>
  )
}