import React from "react"

import campfireBanIcon from "../images/park/campfire-ban-48.png"

export default function CampfireBan() {
  return (
    <>
      <div>
        <img src={campfireBanIcon} alt="Campfires are prohibited" className="mr-1" />
      </div>
      <div>No campfires</div>
    </>
  )
}