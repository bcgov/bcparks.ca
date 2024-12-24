import React, { useState } from "react"
import HtmlContent from "../htmlContent"
import ParkAccessStatus from "./parkAccessStatus"
import CampfireBan from "../campfireBan"
import FontAwesome from "../fontAwesome"
import { datePhrase } from "../../utils/parkDatesHelper"

import PropTypes from "prop-types"
import { parseISO, format } from "date-fns"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCalendar } from "@fortawesome/free-regular-svg-icons"
import lowerMainland from "../../images/area-maps/area-maps-with-labels/1-lower-mainland-label.svg"
import southIsland from "../../images/area-maps/area-maps-with-labels/2-south-island-label.svg"
import okanagan from "../../images/area-maps/area-maps-with-labels/3-okanagan-label.svg"
import seaToSky from "../../images/area-maps/area-maps-with-labels/4-sea-to-sky-label.svg"
import kootenay from "../../images/area-maps/area-maps-with-labels/5-kootenay-label.svg"
import thompson from "../../images/area-maps/area-maps-with-labels/6-thompson-label.svg"
import cariboo from "../../images/area-maps/area-maps-with-labels/7-cariboo-label.svg"
import haidaGwaii from "../../images/area-maps/area-maps-with-labels/8-haida-gwaii-label.svg"
import northIsland from "../../images/area-maps/area-maps-with-labels/9-north-island-label.svg"
import omineca from "../../images/area-maps/area-maps-with-labels/10-omineca-label.svg"
import peace from "../../images/area-maps/area-maps-with-labels/11-peace-label.svg"
import skeenaEast from "../../images/area-maps/area-maps-with-labels/12-skeena-east-label.svg"
import skeenaWest from "../../images/area-maps/area-maps-with-labels/13-skeena-west-label.svg"
import southCentralCoast from "../../images/area-maps/area-maps-with-labels/14-south-central-coast-label.svg"

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
// Helper function to get the area map image
const convertToCamelCase = (str) => {
  return str.split(" ").map((word, index) =>
    index === 0 ? word.toLowerCase() : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join("")
}
const mapImages = {
  lowerMainland, southIsland, okanagan, seaToSky, kootenay, thompson, cariboo, haidaGwaii, northIsland, omineca, peace, skeenaEast, skeenaWest, southCentralCoast
}
// Helper function to format gate open/close time e.g. "08:00:00" to "8 am"
const formattedTime = (time) => {
  // Prepend a dummy date to the time string to parse it
  const dateTime = parseISO(`1970-01-01T${time}`)
  const minutes = format(dateTime, 'mm');
  if (minutes === '00') {
    return format(dateTime, 'h aa').toLowerCase()
  } else {
    return format(dateTime, 'h:mm aa').toLowerCase()
  }
}
// Helper function to render the gate open/close times
const renderGateTimes = (parkOperation) => {
  if (!parkOperation) return null
  const { gateOpenTime, gateCloseTime, gateOpensAtDawn, gateClosesAtDusk, gateOpen24Hours } = parkOperation

  if (gateOpen24Hours) {
    return <>, 24 hours a day.</>
    // Either gateOpenTime or gateOpensAtDawn is available, then either gateCloseTime or gateClosesAtDusk must also be available
  } else if ((gateOpenTime || gateOpensAtDawn) && (gateCloseTime || gateClosesAtDusk)) {
    return (
      <>
        , from <span className="no-wrap">
          {gateOpensAtDawn ? "dawn" : formattedTime(gateOpenTime)}
        </span>{" "}
        to <span className="no-wrap">
          {gateClosesAtDusk ? "dusk" : formattedTime(gateCloseTime)}
        </span>, daily.
      </>
    )
  } else {
    return <>.</>
  }
}

export default function ParkHeader({
  orcs,
  slug,
  parkName,
  parkType,
  mapZoom,
  latitude,
  longitude,
  campings,
  facilities,
  hasCampfireBan,
  hasDayUsePass,
  hasReservations,
  advisories,
  advisoryLoadError,
  isLoadingAdvisories,
  protectedAreaLoadError,
  isLoadingProtectedArea,
  searchArea,
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
  const parkReservationsURL = parkOperation?.reservationUrl || reservationsURL
  const parkDayUsePassURL = parkOperation?.dayUsePassUrl || dayUsePassURL
  // Check if park access status is "Closed"
  const [isParkOpen, setIsParkOpen] = useState(null)

  return (
    <div id="park-header-container" className="d-flex park-info-container">
      <div className="park-header park-header--left">
        <h1>{parkName}</h1>
        {searchArea?.searchAreaName && (
          <div className="park-header-child">
            <FontAwesome icon="location-dot" />
            {searchArea.searchAreaName}.&nbsp;
            {latitude && longitude && (
              <><a href={externalLink}>View detailed map</a>.</>
            )}
          </div>
        )}
        <div className="park-header-child">
          {(!isLoadingAdvisories && !advisoryLoadError) ?
            <ParkAccessStatus
              advisories={advisories}
              slug={slug}
              subAreas={subAreas}
              operationDates={operationDates}
              onStatusCalculated={onStatusCalculated}
              punctuation="."
              setIsParkOpen={setIsParkOpen}
            />
            :
            // Display a space if it's loading advisories
            <>&nbsp;</>
          }
        </div>
        {parkDates && (
          <div className="park-header-child">
            <FontAwesomeIcon icon={faCalendar} />
            <div>
              {/* Hide here if park access status is "Closed" */}
              {isParkOpen !== false &&
                <p>
                  The {parkType} {parkOperation?.hasParkGate !== false && "gate"} is open {parkDates}
                  {renderGateTimes(parkOperation)}
                </p>
              }
              {parkOperation?.openNote?.data?.openNote &&
                <HtmlContent>{parkOperation.openNote.data.openNote}</HtmlContent>
              }
              {(campings.length > 0 || facilities.length > 0) && (
                <p>
                  {campings.length > 0 && <>Check <a href="#camping">camping</a></>}
                  {facilities.length > 0 &&
                    <>
                      {campings.length > 0 ? " and " : "Check "}
                      <a href="#facilities">facilities</a>
                    </>
                  } for additional dates.
                </p>
              )}
            </div>
          </div>
        )}
        {(!isLoadingProtectedArea && !protectedAreaLoadError && hasCampfireBan) &&
          <div className="park-header-child">
            <CampfireBan />
          </div>
        }
        {(hasReservations || hasDayUsePass) &&
          <div>
            {hasReservations && (
              <a href={parkReservationsURL} className="btn btn-secondary">Book camping</a>
            )}
            {hasDayUsePass && (
              <a href={parkDayUsePassURL} className="btn btn-secondary">Get a day-use pass</a>
            )}
          </div>
        }
      </div>
      <div className="park-header--right">
        {searchArea?.searchAreaName && (
          <img
            alt={searchArea.searchAreaName}
            src={mapImages[convertToCamelCase(searchArea.searchAreaName)]}
          />
        )}
      </div>
    </div >
  )
}

ParkHeader.propTypes = {
  orcs: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  slug: PropTypes.string.isRequired,
  parkName: PropTypes.oneOfType([
    PropTypes.object.isRequired,
    PropTypes.string.isRequired
  ]),
  parkType: PropTypes.string.isRequired,
  mapZoom: PropTypes.number.isRequired,
  latitude: PropTypes.number.isRequired,
  longitude: PropTypes.number.isRequired,
  campings: PropTypes.array,
  facilities: PropTypes.array,
  hasCampfireBan: PropTypes.bool,
  hasDayUsePass: PropTypes.bool,
  hasReservations: PropTypes.bool,
  advisories: PropTypes.array,
  advisoryLoadError: PropTypes.any,
  isLoadingAdvisories: PropTypes.bool.isRequired,
  protectedAreaLoadError: PropTypes.any,
  isLoadingProtectedArea: PropTypes.bool.isRequired,
  searchArea: PropTypes.object.isRequired,
  parkOperation: PropTypes.object,
  operationDates: PropTypes.array.isRequired,
  subAreas: PropTypes.array.isRequired,
  onStatusCalculated: PropTypes.func
}
