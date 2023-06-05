import React from "react"

import SkipToContent from "./skipToContent"
import MegaMenu from "./megaMenu.js"

export default function Header({ content = [] }) {

  return (
    <>
      <SkipToContent></SkipToContent>
      <MegaMenu content={content} menuMode="responsive" />
    </>
  )  
}