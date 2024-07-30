import React from "react"
import { Link } from "gatsby"

export default function ReservationsRequired({
  subAreas,
  reservationLinks,
  hasDayUsePass,
  hasReservations,
  hasPicnic,
  hasBackcountryPermits,
  hasBackcountryReservations
}) {
  const frontcountryCodes = ["frontcountry-camping", "group-camping", "walk-in-camping", "cabins-huts"]
  const backcountryCodes = ["backcountry-camping", "wilderness-camping"]
  const backcountryPermitCode = ["backcountry-camping"]
  const groupCampingCode = ["group-camping"]
  const hasFrontcountry = subAreas.some(s => frontcountryCodes.includes(s.facilityType?.facilityCode))
  const hasBackcountry = subAreas.some(s => backcountryCodes.includes(s.facilityType?.facilityCode))
  const hasBackcountryPermit = subAreas.some(s => backcountryPermitCode.includes(s.facilityType?.facilityCode))
  const hasGroupCamping = subAreas.some(s => groupCampingCode.includes(s.facilityType?.facilityCode))
  const hasAnyReservations =
    (hasFrontcountry && hasReservations) ||
    (hasGroupCamping && hasReservations) ||
    hasPicnic ||
    (hasBackcountry && hasBackcountryReservations) ||
    (hasBackcountryPermit && hasBackcountryPermits) ||
    hasDayUsePass ||
    reservationLinks?.length > 0

  return hasAnyReservations && (
    <>
      <h3 id="reservations-required">Reservations required</h3>
      <p>
        Review general guidelines for
      </p>
      <ul>
        {(hasFrontcountry && hasReservations) &&
          <li>
            <Link to="/reservations/frontcountry-camping">
              Frontcountry camping
            </Link>
          </li>
        }
        {(hasGroupCamping && hasReservations) &&
          <li>
            <Link to="/reservations/group-camping">
              Group camping
            </Link>
          </li>
        }
        {hasPicnic &&
          <li>
            <Link to="/reservations/picnic-shelters">
              Picnic shelters
            </Link>
          </li>
        }
        {(hasBackcountry && hasBackcountryReservations) &&
          <li>
            <Link to="/reservations/backcountry-camping/reservations">
              Backcountry camping reservations
            </Link>
          </li>
        }
        {(hasBackcountryPermit && hasBackcountryPermits) &&
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
