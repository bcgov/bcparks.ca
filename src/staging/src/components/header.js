import React from "react"

import BetaBanner from "../components/betaBanner"
import MegaMenu from "./megaMenu.js"

export default function Header({ content = [] }) {

  return (
    <>
      <BetaBanner></BetaBanner>
      <MegaMenu content={content} menuMode="responsive" />
    </>
  )  
}