import React from "react"
import "../styles/acknowledgment.scss"

export default function Acknowledgment({ color }) {
  // pass color prop if a page has a background color 
  const acknowledgmentClassName = `acknowledgment${color ? ` bg-${color}` : ""}`
  return (
    <div className={acknowledgmentClassName}>
      <div className="acknowledgment-container">
        <div className="acknowledgment__text">
          We acknowledge all First Nations on whose territories BC Parks were
          established. We honour their connection to the land and respect the
          importance of their diverse teachings, traditions, and practices
          within these territories.
        </div>
      </div>
    </div>
  )
}
