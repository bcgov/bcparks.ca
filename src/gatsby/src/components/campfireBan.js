import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBan } from "@fortawesome/free-solid-svg-icons"

export default function CampfireBan() {
  return (
    <>
      <FontAwesomeIcon icon={faBan} />
      <p>Campfire ban in effect.</p>
    </>
  )
}