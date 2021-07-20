import React from "react"
import { css } from "@emotion/react"
import { useStaticQuery, Link, graphql } from "gatsby"

import { rhythm } from "../utils/typography"

export default function Menu({children}) {
  return (
    <div  id='menu' dangerouslySetInnerHTML={{ __html: children}}/>
  )
}