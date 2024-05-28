import React from "react"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faFire } from "@fortawesome/free-solid-svg-icons"

export default function CampfireBan() {
  return (
    <>
      <FontAwesomeIcon icon={faFire} />
      <p>Campfire ban in effect</p>
    </>
  )
}