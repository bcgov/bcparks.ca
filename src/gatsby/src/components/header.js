import React from "react"

import SkipToContent from "./skipToContent"
import MegaMenu from "./megaMenu.js"
import EmergencyAlert from "./emergencyAlert"

export default function Header({ content = [] }) {

  return (
    <>
      <SkipToContent></SkipToContent>
      <EmergencyAlert />
      <MegaMenu content={content} menuMode="responsive" />
    </>
  )  
}