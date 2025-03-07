import React from "react"

import SkipToContent from "./skipToContent"
import MegaMenu from "./megaMenu.js"
import EmergencyAlert from "./emergencyAlert"
import { useScreenSize } from "../utils/helpers"

export default function Header({ content = [] }) {
  const screenSize = useScreenSize()
  return (
    <>
      {screenSize.width > 991 && <SkipToContent></SkipToContent>}
      <EmergencyAlert />
      <MegaMenu content={content} menuMode="responsive" />
    </>
  )  
}