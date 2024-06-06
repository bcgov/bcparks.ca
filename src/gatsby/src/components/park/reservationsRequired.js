import React from "react"
import { Link } from "gatsby"

export default function ReservationsRequired({ subAreas, hasDayUsePass, hasReservations }) {
  // console.log("subAreas", subAreas)

  return (
    <>
      <h3>Reservations required</h3>
      <p>
        Review general guidelines for
      </p>
      <ul>
        <li>
          <Link to="/reservations/frontcountry-camping">
            Frontcountry camping
          </Link>
        </li>
        <li>
          <Link to="/reservations/group-camping">
            Group camping
          </Link>
        </li>
        <li>
          <Link to="/reservations/picnic-shelters">
            Picnic shelters
          </Link>
        </li>
        <li>
          <Link to="/reservations/backcountry-camping/reservations">
            Backcountry camping reservations
          </Link>
        </li>
        <li>
          <Link to="/reservations/backcountry-camping/permit-registration">
            Backcountry permit registration
          </Link>
        </li>
        <li>
          <Link to="/reservations/day-use-passes">
            Day-use pass
          </Link>
        </li>
      </ul>
    </>
  )
}
