import React from "react"

import SkipToContent from "./skipToContent"
import BetaBanner from "../components/betaBanner"
import MegaMenu from "./megaMenu.js"

export default function Header({ content = [] }) {

  return (
    <>
      <SkipToContent></SkipToContent>
      <BetaBanner></BetaBanner>
      <MegaMenu content={content} menuMode="responsive" />
    </>
  )  
}