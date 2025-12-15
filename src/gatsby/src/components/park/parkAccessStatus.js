import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { graphql, useStaticQuery, Link } from "gatsby"
import { format } from "date-fns"

import blueStatusIcon from "../../images/park/blue-status.svg"
import redStatusIcon from "../../images/park/red-status.svg"
import yellowStatusIcon from "../../images/park/yellow-status.svg"

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
    
    if (parkFeature.isIgnored === null || parkFeature.isIgnored === undefined) {
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
    if (dates.length === 0) { continue; }
    for (const d of dates) {
      if (d.isActive !== true) { continue; }
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

function parkAccessFromAdvisories(advisories, mainGateClosure, areaClosure, staticData) {

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

  if (parkStatusText === "Open" && (mainGateClosure || areaClosure)) {
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

  useEffect(() => {
    const mainGateClosure = checkParkClosure(operationDates);
    const areaClosure = checkParkFeatureClosure(parkFeatures, staticData);
    const status = parkAccessFromAdvisories(advisories, mainGateClosure, areaClosure, staticData);
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
  }, [operationDates, parkFeatures, advisories]);


  return (
    <div className="access-status-icon">
      {accessStatus &&
        <>
          <img src={accessStatus.parkStatusIcon} alt="" />
          {accessStatus.parkStatusText}{(!hideComma && advisories.length > 0) && ", "}
          {advisories.length > 0 &&
            <Link to={`/${slug}/#advisories`}>
              {hideComma ? "C": "c"}heck advisories {`(${advisories.length})`}
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
