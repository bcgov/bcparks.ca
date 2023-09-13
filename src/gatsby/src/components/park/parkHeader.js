import React from "react"
import PropTypes from "prop-types"

import Advisory from "./advisory"
import ParkAccessStatus from "./parkAccessStatus"
import CampfireBan from "../campfireBan"

export default function ParkHeader({
  slug,
  parkName,
  hasReservations,
  hasDayUsePass,
  hasCampfireBan,
  isLoadingAdvisories,
  advisoryLoadError,
  advisories,
}) {
  const reservationsURL = "https://camping.bcparks.ca"
  const dayUsePassURL = "https://reserve.bcparks.ca/dayuse"

  return (
    <>
      {/* eventually get rid of these zeroed out padding/margin once their properly nested bootstrap structure */}
      <div className="pt-4" id="park-header-container">
        <h1 className="pt-2">{parkName}</h1>

        <div className="row mx-0 pt-2">
          {!isLoadingAdvisories && !advisoryLoadError && (
            <div className="col-12 col-lg-6 d-flex justify-content-around flex-column flex-lg-row order-lg-1 card-parent">
              <div className="row d-flex align-items-center mb-3 mb-lg-0 card-child">
                <ParkAccessStatus advisories={advisories} slug={slug} />
              </div>
              {hasCampfireBan &&
                <div className="row d-flex align-items-center mb-3 mb-lg-0 card-child">
                  <CampfireBan />
                </div>
              }
              <div className="row d-flex align-items-center mb-3 mb-lg-0 card-child">
                <Advisory advisories={advisories} />
              </div>
            </div>
          )}
          <div className="col-12 col-lg-6 button-parent pb-4 pb-lg-0">
            <div className="row">
            {hasReservations && (
                <a href={reservationsURL} className="btn btn-lg btn-warning mr-lg-3">Book camping</a>
              )}
              {hasDayUsePass && (
                <a href={dayUsePassURL} className="btn btn-lg btn-primary">Get a day-use pass</a>
              )}
            </div>
          </div>
        </div>

      </div>
    </>
  )
}

ParkHeader.propTypes = {
  parkName: PropTypes.oneOfType([
    PropTypes.object.isRequired, PropTypes.string.isRequired
  ]),
  isLoadingAdvisories: PropTypes.bool.isRequired,
  advisoryLoadError: PropTypes.any,
  hasReservations: PropTypes.bool,
  advisories: PropTypes.array,
}
