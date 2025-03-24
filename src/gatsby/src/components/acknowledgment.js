import React from "react"
import "../styles/acknowledgment.scss"

export default function Acknowledgment({ color, condition }) {
  return (
    <div className={`acknowledgment is-bg-${color}--${condition}`}>
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
