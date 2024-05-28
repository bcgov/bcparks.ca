import React from "react"
import ParkStatus from "./parkStatus"
import CampfireBan from "../campfireBan"
import { datePhrase } from "../../utils/parkDatesHelper"

import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faLocationDot } from "@fortawesome/free-solid-svg-icons"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"

// URLs
const reservationsURL = "https://camping.bcparks.ca"
const dayUsePassURL = "https://reserve.bcparks.ca/dayuse"
const portalURL = "https://governmentofbc.maps.arcgis.com"
// Helper function to get the park operation dates
const getParkOperationDates = (operationDates, thisYear) => {
  const fmt = "MMMM D, yyyy"
  const yr = "year-round"
  const parkOperationDates = operationDates.find(d => d.operatingYear === +thisYear) || {}
  let parkDates = datePhrase(parkOperationDates.gateOpenDate, parkOperationDates.gateCloseDate, fmt, yr, " to ", "")
  if (parkDates !== yr && !parkDates.includes(thisYear)) {
    parkDates = ""
  }
  return parkDates
}

export default function ParkHeader({
  orcs,
  slug,
  parkName,
  parkType,
  mapZoom,
  latitude,
  longitude,
  hasCampfireBan,
  hasDayUsePass,
  hasReservations,
  advisories,
  advisoryLoadError,
  isLoadingAdvisories,
  parkOperation,
  operationDates,
  subAreas,
  onStatusCalculated
}) {
  const linkZoom = mapZoom + 1
  const externalLink =
    `${portalURL}/apps/webappviewer/index.html?id=077ef73a1eae4ca88f2bafbb831215af&query=British_Columbia_Parks_Ecological_Reserves_and_Protected_Areas_8747,ORCS_PRIMARY,${orcs}&center=${longitude},${latitude}&level=${linkZoom}`
  // Get the park operation dates
  const thisYear = new Date().getFullYear()
  const parkDates = getParkOperationDates(operationDates, thisYear)

  return (
    <div id="park-header-container" className="d-flex">
      <div className="park-header park-header--left">
        <h1>{parkName}</h1>
        {!isLoadingAdvisories && !advisoryLoadError && (
          <>
            <div className="park-header-child">
              <FontAwesomeIcon icon={faLocationDot} />
              {latitude && longitude && (
                <a href={externalLink}>View detailed map.</a>
              )}
            </div>
            <div className="park-header-child">
              <ParkStatus
                advisories={advisories}
                slug={slug}
                subAreas={subAreas}
                operationDates={operationDates}
                onStatusCalculated={onStatusCalculated}
              />
            </div>
            {hasCampfireBan &&
              <div className="park-header-child">
                <CampfireBan />
              </div>
            }
            <div className="park-header-child">
              <FontAwesomeIcon icon={faCalendar} />
              <div>
                {parkDates ? (
                  <p>
                    The {parkType.toLowerCase()} {parkOperation.hasParkGate !== false && "gate"} is open {parkDates}.
                    {(parkOperation.gateOpenTime && parkOperation.gateCloseTime) && (
                      <>
                        Gates are open from {parkOperation.gateOpenTime} to {parkOperation.gateCloseTime}.
                      </>
                    )}
                  </p>
                ) : (
                  <p>Operating dates are unavailable</p>
                )}
                <p>
                  <a href="#park-camping-details-container">Check campgrounds</a> and{" "}
                  <a href="#park-facility-container">facilities</a> for additional dates.
                </p>
              </div>
            </div>
          </>
        )}
        <div className="mt-4">
          {hasReservations && (
            <a href={reservationsURL} className="btn btn-secondary mr-lg-3">Book camping</a>
          )}
          {hasDayUsePass && (
            <a href={dayUsePassURL} className="btn btn-secondary">Get a day-use pass</a>
          )
          }
        </div>
      </div>
      <div className="park-header--right">
        image
      </div>
    </div >
  )
}

ParkHeader.propTypes = {
  orcs: PropTypes.number.isRequired,
  slug: PropTypes.string.isRequired,
  parkName: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.string.isRequired
  ]),
  parkType: PropTypes.string.isRequired,
  mapZoom: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  hasCampfireBan: PropTypes.bool,
  hasDayUsePass: PropTypes.bool,
  hasReservations: PropTypes.bool,
  advisories: PropTypes.array,
  advisoryLoadError: PropTypes.any,
  isLoadingAdvisories: PropTypes.bool.isRequired,
  parkOperation: PropTypes.object.isRequired,
  operationDates: PropTypes.array.isRequired,
  subAreas: PropTypes.array.isRequired,
  onStatusCalculated: PropTypes.func
}
