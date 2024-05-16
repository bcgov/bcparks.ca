import React, { useState } from "react"
import { Link as GatsbyLink, StaticQuery } from "gatsby"
import Carousel from "react-bootstrap/Carousel"
// import Carousel from "react-material-ui-carousel"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons"

import ParkAccessStatus from "./parkAccessStatus"

import parksLogo from "../../images/park-card.png"
import campingIcon from "../../../static/icons/frontcountry-camping.svg"
import backcountryCampingIcon from "../../../static/icons/wilderness-camping.svg"
import hikingIcon from "../../../static/icons/hiking.svg"
import picincIcon from "../../../static/icons/picnic-areas.svg"
import swimmingIcon from "../../../static/icons/swimming.svg"
import cyclingIcon from "../../../static/icons/cycling.svg"
import petsIcon from "../../../static/icons/pets-on-leash.svg"
import campfireBanIcon from "../../../static/icons/campfire-ban.svg"

import { addSmallImagePrefix, handleImgError } from "../../utils/helpers"

const Icon = ({ src, label, size }) => {
  return (
    <img src={src}
      alt={label}
      aria-label={label}
      className="mr-2"
      width={size}
      height={size}>
    </img>
  )
}

const FeatureIcons = ({ park }) => {
  // console.log("park", park)
  const iconSize = 32;
  let facilities = [];
  let activities = [];
  let campings = [];
  // convert facilities
  if (park.parkFacilities?.length) {
    facilities = park.parkFacilities.filter(f => {
      return f.isActive && f.facilityType?.isActive && !f.facilityType?.isCamping;
    }).map(f => {
      return {
        code: f.facilityType.facilityCode,
        num: f.facilityType.facilityNumber
      };
    });
    // convert camping facilities
    campings = park.parkFacilities.filter(f => {
      return f.isActive && f.facilityType?.isActive && f.facilityType?.isCamping;
    }).map(f => {
      let facilityCode = f.facilityType.facilityCode;
      let facilityNumber = f.facilityType.facilityNumber;
      if (facilityCode === 'wilderness-camping') {
        facilityCode = 'backcountry-camping'
        facilityNumber = 36
      }
      return {
        code: facilityCode,
        num: facilityNumber
      };
    });
  }
  // convert activities
  if (park.parkActivities?.length) {
    activities = park.parkActivities.filter(a => {
      return a.isActive && a.activityType?.isActive;
    }).map(a => {
      return {
        code: a.activityType.activityCode,
        num: a.activityType.activityNumber
      };
    });
  }

  const filteredFacilities = facilities.length && facilities.filter(f => [6].includes(f.num)) || [];
  const filteredActivities = activities.filter(a => [1, 3, 8, 9].includes(a.num)) || [];
  const filteredCampings = campings.filter(c => [1, 36].includes(c.num)) || [];

  console.log("facilities", facilities)

  return (
    <>
      {filteredCampings.some(x => x.code === 'frontcountry-camping') &&
        <Icon src={campingIcon} label="Frontcountry camping" size={iconSize} />
      }
      {filteredCampings.some(x => x.code === 'backcountry-camping') &&
        <Icon src={backcountryCampingIcon} label="Backcountry camping" size={iconSize} />
      }
      {filteredActivities.some(x => x.code === 'hiking') &&
        <Icon src={hikingIcon} label="Hiking" size={iconSize} />
      }
      {filteredFacilities.some(x => x.code === 'picnic-areas') &&
        <Icon src={picincIcon} label="Picnic areas" size={iconSize} />
      }
      {filteredActivities.some(x => x.code === 'swimming') &&
        <Icon src={swimmingIcon} label="Swimming" size={iconSize} />
      }
      {filteredActivities.some(x => x.code === 'cycling') &&
        <Icon src={cyclingIcon} label="Cycling" size={iconSize} />
      }
      {filteredActivities.some(x => x.code === 'pets-on-leash') &&
        <Icon src={petsIcon} label="Pets on leash" size={iconSize} />
      }
      {filteredCampings.length ? (
        <GatsbyLink to={`/${park.slug}/#park-camping-details-container`}>
          <p aria-label="See all facilities and activities">see all</p>
        </GatsbyLink>
      ) : (
        (filteredActivities.length > 0 || filteredFacilities.length > 0) && (
          filteredFacilities.length ? (
            <GatsbyLink to={`/${park.slug}/#park-facility-container`}>
              <p aria-label="See all facilities and activities">see all</p>
            </GatsbyLink>
          ) : (
            <GatsbyLink to={`/${park.slug}/#park-activity-container`}>
              <p aria-label="See all facilities and activities">see all</p>
            </GatsbyLink>
          )
        )
      )}
    </>
  )
}

const NearByPark = ({ park, photos }) => {
  const [hasError, setHasError] = useState(false)
  // console.log("park", park)
  // console.log("photos", photos)
  // console.log(hasError)

  return (
    <div className="park-card border">
      <div className="park-card">
        <div className="row no-gutters">
          {photos &&
            photos.length === 0 && (
              <div className="col-12 park-image-div-mobile park-image-logo-div">
                <img
                  alt="logo"
                  className="search-result-logo-image"
                  src={parksLogo}
                />
              </div>
            )}
          {photos &&
            photos.length === 1 && (
              <div className={`${hasError ? "park-image-logo-div" : ""} col-12 park-image-div-mobile`}>
                <img
                  alt="park"
                  className={`${hasError ? "search-result-logo-image" : "search-result-image"}`}
                  src={hasError ? parksLogo : addSmallImagePrefix(photos[0].imageUrl)}
                  onError={(e) => { handleImgError(e, photos[0], setHasError) }}
                />
              </div>
            )}
          {photos &&
            photos.length > 1 && (
              <div className={`${hasError ? "park-image-logo-div" : ""} col-12 park-image-div-mobile`}>
                <Carousel fade className="park-carousel-mobile">
                  {photos.map(
                    (item, index) => {
                      return (
                        <Carousel.Item key={index}>
                          <img
                            alt="park carousel"
                            className={`${hasError ? "search-result-logo-image" : "search-result-image"}`}
                            src={hasError ? parksLogo : addSmallImagePrefix(item.imageUrl)}
                            onError={(e) => { handleImgError(e, item, setHasError) }}
                          />
                        </Carousel.Item>
                      )
                    }
                  )}
                </Carousel>
              </div>
            )}

          <div className="col-12 park-content-mobile">
            <h2 className="park-heading-text">
              <GatsbyLink
                to={`/${park.slug}/`}
                className="underline-hover mobile-park-link"
              >
                {park.protectedAreaName}
                <FontAwesomeIcon icon={faCircleChevronRight} className="park-heading-icon" />
              </GatsbyLink>
            </h2>
            <div>
              <FeatureIcons park={park} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NearByPark