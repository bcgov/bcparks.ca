import React, { useState, useEffect, useMemo } from "react"
import PropTypes from "prop-types"
import { graphql, useStaticQuery, Link } from "gatsby"
import { format } from "date-fns"
import { PARK_DATE_TYPE } from "../../utils/constants"
import { WINTER_FULL_PARK_ADVISORY, WINTER_SUB_AREA_ADVISORY } from "../../utils/advisoryHelper"

import blueStatusIcon from "../../images/park/blue-status.svg"
import redStatusIcon from "../../images/park/red-status.svg"
import yellowStatusIcon from "../../images/park/yellow-status.svg"

// Seasonal advisories (WINTER_FULL_PARK_ADVISORY, WINTER_SUB_AREA_ADVISORY) use id=-1
const SEASONAL_ADVISORY_ID = -1

const ICONS = {
  blue: blueStatusIcon,
  yellow: yellowStatusIcon,
  red: redStatusIcon,
}

const today = format(new Date(), "yyyy-MM-dd");

function checkParkClosure(operatingDates) {
  if (!operatingDates || operatingDates.length === 0) {
    return false;
  }
  for (const d of operatingDates) {
    if (d.startDate && d.startDate > today) {
      return true;
    }
    if (d.endDate && d.endDate < today) {
      return true;
    }
  }
  return false;
}

function checkParkFeatureClosure(parkFeatures, staticData) {
  if (!parkFeatures || parkFeatures.length === 0) {
    return false;
  }
  const parkFeatureTypes = staticData?.allStrapiParkFeatureType.nodes || []
  for (const parkFeature of parkFeatures) {
    // determine if closure affects access status using isIgnored

    // in scheduler/elasticsearch/transformers/park/operatingDates.js
    // isIgnored: feature.closureAffectsAccessStatus === null ? null : !feature.closureAffectsAccessStatus
    // isIgnored is the inverse of closureAffectsAccessStatus
    let closureAffectsAccessStatus;

    // check if data has isIgnored field (from Elasticsearch - find a park page)
    if ('isIgnored' in parkFeature) {
      if (parkFeature.isIgnored == null) {
        // inherit from park feature type using parkFeatureTypeId
        if (parkFeature.parkFeatureTypeId) {
          const parkFeatureType = parkFeatureTypes.find(type => 
            type.featureTypeId === parkFeature.parkFeatureTypeId
          );
          if (parkFeatureType) {
            closureAffectsAccessStatus = parkFeatureType.closureAffectsAccessStatus;
          }
        }
      } else {
        // isIgnored is set, so closureAffectsAccessStatus is the inverse
        closureAffectsAccessStatus = !parkFeature.isIgnored;
      }
    } else {
      // data from Strapi API (park page and dates page) - use closureAffectsAccessStatus directly
      if (parkFeature.closureAffectsAccessStatus == null) {
        // inherit from park feature type
        if (parkFeature.parkFeatureType?.closureAffectsAccessStatus != null) {
          closureAffectsAccessStatus = parkFeature.parkFeatureType.closureAffectsAccessStatus;
        }
      } else {
        closureAffectsAccessStatus = parkFeature.closureAffectsAccessStatus;
      }
    }
    // skip features that don't affect access status
    if (!closureAffectsAccessStatus) {
      continue;
    }
    // skip inactive or closed features
    if (parkFeature.isActive !== true || parkFeature.isOpen !== true) {
      continue;
    }
    // check the dates to see if any parkFeatures are closed
    const dates = parkFeature.parkDates || [];
    for (const d of dates) {
      if (d.isActive !== true) { continue; }
      if (d.parkDateType?.dateTypeId !== PARK_DATE_TYPE.OPERATION) { continue; }
      if (d.startDate && d.startDate > today) {
        return true;
      }
      if (d.endDate && d.endDate < today) {
        return true;
      }
    }
  }
  return false;
}

function parkAccessFromAdvisories(advisories, mainGateClosure, areaClosure, staticData, hidesSeasonalAdvisory) {

  let accessStatuses = []
  const accessStatusList = staticData?.allStrapiAccessStatus.nodes

  let parkStatusIcon = blueStatusIcon
  let parkStatusText = "Open"
  let parkStatusColor = "blue"

  for (let advisory of advisories) {
    if (advisory.accessStatus) {
      // data is coming from /api/public-advisories/items and already includes the accessStatus
      accessStatuses.push({
        precedence: advisory.accessStatus.precedence,
        color: advisory.accessStatus.color,
        text: advisory.accessStatus.groupLabel,
      })
    } else {
      let accessStatus = accessStatusList.find(status => {
        return status.strapi_id === advisory.accessStatusId
      })
      if (!accessStatus) {
        break
      } else {
        accessStatuses.push({
          precedence: accessStatus.precedence,
          color: accessStatus.color,
          text: accessStatus.groupLabel,
        })
      }
    }
  }

  accessStatuses.sort((a, b) => {
    return a.precedence - b.precedence
  })

  if (
    accessStatuses.length > 0 &&
    typeof ICONS[accessStatuses[0].color] !== "undefined"
  ) {
    parkStatusIcon = ICONS[accessStatuses[0].color]
    parkStatusText = accessStatuses[0].text
    parkStatusColor = accessStatuses[0].color
  }

  if (parkStatusText === "Open" && (mainGateClosure || areaClosure) && !hidesSeasonalAdvisory) {
    parkStatusText = "Seasonal restrictions";
  }

  return {
    parkStatusIcon: parkStatusIcon,
    parkStatusText: parkStatusText,
    parkStatusColor: parkStatusColor,
    mainGateClosure: mainGateClosure,
    areaClosure: areaClosure
  }
}

export default function ParkAccessStatus({
  advisories,
  slug,
  parkFeatures,
  operationDates,
  onStatusCalculated,
  punctuation,
  hideComma,
  setIsParkOpen
}) {

  const staticData = useStaticQuery(
    graphql`
      {
        allStrapiAccessStatus {
          nodes {
            id
            strapi_id
            color
            accessStatus
            groupLabel
            precedence
          }
        }
        allStrapiParkFeatureType {
          nodes {
            featureTypeId
            parkFeatureType
            closureAffectsAccessStatus
          }
        }
      }
    `
  )

  const [accessStatus, setAccessStatus] = useState(null)

  // Calculate closure status
  const closureStatus = useMemo(() => ({
    mainGateClosure: checkParkClosure(operationDates),
    areaClosure: checkParkFeatureClosure(parkFeatures, staticData)
  }), [operationDates, parkFeatures, staticData])

  // Inject seasonal advisories based on closure status
  const advisoriesWithSeasonal = useMemo(() => {
    const newAdvisories = [...(advisories || [])]
    
    // Don't inject if already added or if another advisory hides seasonal advisories
    if (newAdvisories.some(
      advisory => advisory.id === SEASONAL_ADVISORY_ID ||
      advisory.accessStatus?.hidesSeasonalAdvisory
    )) {
      return newAdvisories
    }

    // Inject pseudo-advisory based on closure type
    if (closureStatus.mainGateClosure) {
      newAdvisories.push(WINTER_FULL_PARK_ADVISORY)
    } else if (closureStatus.areaClosure) {
      newAdvisories.push(WINTER_SUB_AREA_ADVISORY)
    }

    return newAdvisories
  }, [advisories, closureStatus])

  useEffect(() => {
    const hidesSeasonalAdvisory = advisories?.some(
      advisory => advisory.accessStatus?.hidesSeasonalAdvisory
    ) || false;
    
    const status = parkAccessFromAdvisories(
      advisoriesWithSeasonal, 
      closureStatus.mainGateClosure, 
      closureStatus.areaClosure, 
      staticData,
      hidesSeasonalAdvisory
    );
    // add advisoriesWithSeasonal to the status object
    status.advisoriesWithSeasonal = advisoriesWithSeasonal;

    setAccessStatus(status)
    if (onStatusCalculated !== undefined) {
      // return the accessStatus to the parent component if a function prop was passed in
      onStatusCalculated(status);
    }
    // set the park open state for park header
    if (status && status.parkStatusText === "Closed") {
      if (typeof setIsParkOpen === "function") {
        setIsParkOpen(false)
      }
    } 
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [operationDates, parkFeatures, advisories, closureStatus]);


  return (
    <div className="access-status-icon">
      {accessStatus &&
        <>
          <img src={accessStatus.parkStatusIcon} alt="" />
          {accessStatus.parkStatusText}{(!hideComma && advisoriesWithSeasonal.length > 0) && ", "}
          {advisoriesWithSeasonal.length > 0 &&
            <Link to={`/${slug}/#advisories`}>
              {hideComma ? "C": "c"}heck advisories {`(${advisoriesWithSeasonal.length})`}
            </Link>
          } 
          {punctuation}
        </>
      }
    </div>
  )
}

ParkAccessStatus.propTypes = {
  advisories: PropTypes.array.isRequired,
  slug: PropTypes.string.isRequired,
  parkFeatures: PropTypes.array.isRequired,
  operationDates: PropTypes.array.isRequired,
  onStatusCalculated: PropTypes.func,
  punctuation: PropTypes.string,
  setIsParkOpen: PropTypes.func
}
