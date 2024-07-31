import React from "react"
import { Link } from "gatsby"

export default function ReservationsRequired({ subAreas, operations }) {
  const hasDayUsePass = operations.hasDayUsePass
  const hasFirstComeFirstServed = operations.hasFirstComeFirstServed
  const hasCanoeCircuitReservations = operations.hasCanoeCircuitReservations
  const hasPicnicShelterReservations = operations.hasPicnicShelterReservations
  const hasFrontcountryReservations = operations.hasFrontcountryReservations
  const hasFrontcountryCabinReservations = operations.hasFrontcountryCabinReservations
  const hasBackcountryPermits = operations.hasBackcountryPermits
  const hasBackcountryReservations = operations.hasBackcountryReservations
  const hasBackcountryGroupReservations = operations.hasBackcountryGroupReservations
  const hasBackcountryShelterReservations = operations.hasBackcountryShelterReservations
  const hasBackcountryWildernessReservations = operations.hasBackcountryWildernessReservations
  const reservationLinks = operations.customReservationLinks
  const groupCampingCode = ["group-camping"]
  const hasGroupCamping = subAreas.some(s => groupCampingCode.includes(s.facilityType?.facilityCode))

  const hasAnyReservations =
    (hasFrontcountryReservations || hasFirstComeFirstServed || hasFrontcountryCabinReservations) ||
    (hasGroupCamping || hasBackcountryGroupReservations) ||
    hasPicnicShelterReservations ||
    (hasBackcountryReservations || hasBackcountryShelterReservations ||
      hasBackcountryWildernessReservations || hasCanoeCircuitReservations) ||
    hasBackcountryPermits ||
    hasDayUsePass ||
    reservationLinks?.length > 0

  return hasAnyReservations && (
    <>
      <h3 id="reservations-required">Reservations required</h3>
      <p>
        Review general guidelines for
      </p>
      <ul>
        {(hasFrontcountryReservations || hasFirstComeFirstServed || hasFrontcountryCabinReservations) &&
          <li>
            <Link to="/reservations/frontcountry-camping">
              Frontcountry camping
            </Link>
          </li>
        }
        {(hasGroupCamping || hasBackcountryGroupReservations) &&
          <li>
            <Link to="/reservations/group-camping">
              Group camping
            </Link>
          </li>
        }
        {hasPicnicShelterReservations &&
          <li>
            <Link to="/reservations/picnic-shelters">
              Picnic shelters
            </Link>
          </li>
        }
        {(hasBackcountryReservations || hasBackcountryShelterReservations ||
          hasBackcountryWildernessReservations || hasCanoeCircuitReservations) &&
          <li>
            <Link to="/reservations/backcountry-camping/reservations">
              Backcountry camping reservations
            </Link>
          </li>
        }
        {hasBackcountryPermits &&
          <li>
            <Link to="/reservations/backcountry-camping/permit-registration">
              Backcountry permit registration
            </Link>
          </li>
        }
        {hasDayUsePass &&
          <li>
            <Link to="/reservations/day-use-passes">
              Day-use pass
            </Link>
          </li>
        }
        {reservationLinks?.length > 0 && reservationLinks.map((link, i) => (
          <li
            key={i}
            dangerouslySetInnerHTML={{ __html: link.content.data.content.replace(/<\/?p>/g, '') }}>
          </li>
        ))}
      </ul>
    </>
  )
}
