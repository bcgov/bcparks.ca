import React, { useState } from "react"
import { Link } from "gatsby"
import Carousel from "react-bootstrap/Carousel"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleChevronRight, faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons"

import FeatureIcons from "../search/featureIcons"
import parksLogo from "../../images/park-card.png"
import { addSmallImagePrefix, handleImgError } from "../../utils/helpers"

const NearbyPark = ({ park, photos }) => {
  const [index, setIndex] = useState(0)
  const [isTabFocused, setIsTabFocused] = useState(false)
  const [hasError, setHasError] = useState(false)

  // event handlers
  const handleSelect = (selectedIndex, e) => {
    setIndex(selectedIndex)
  }
  const handleKeyDown = (e, photos) => {
    if (e.key === 'ArrowRight') {
      setIndex((oldIndex) => (oldIndex + 1) % photos.length)
    } else if (e.key === 'ArrowLeft') {
      setIndex((oldIndex) => (oldIndex - 1 + photos.length) % photos.length)
    }
  }

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

  return (
    <div className="park-card">
      {photos &&
        photos.length === 0 && (
          <div className="park-image-div-mobile park-image-logo-div">
            <img
              alt="logo"
              className="search-result-logo-image"
              src={parksLogo}
            />
          </div>
        )}
      {photos &&
        photos.length === 1 && (
          <div className={`${hasError ? "park-image-logo-div" : ""} park-image-div-mobile`}>
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
          <div className={`${hasError ? "park-image-logo-div" : ""} park-image-div-mobile`}>
            <Carousel
              fade
              interval={null}
              nextIcon={<FontAwesomeIcon icon={faCircleChevronRight} />}
              prevIcon={<FontAwesomeIcon icon={faCircleChevronLeft} />}
              onSelect={handleSelect}
              activeIndex={index}
              className={`park-carousel tab-focus-${isTabFocused}`}
            >
              {photos.map(
                (item, index) => {
                  return (
                    <Carousel.Item 
                    key={index} 
                    tabIndex={0}
                    onFocus={() => setIsTabFocused(true)}
                    onBlur={() => setIsTabFocused(false)}
                    onKeyDown={() => handleKeyDown(photos)}
                    >
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

      <div className="park-content-mobile">
        <h2 className="park-heading-text">
          <Link
            to={`/${park.slug}/`}
            className="underline-hover mobile-park-link"
          >
            {park.protectedAreaName}
            <FontAwesomeIcon icon={faCircleChevronRight} className="park-heading-icon" />
          </Link>
        </h2>
        <div>
          <FeatureIcons
            page="park"
            parkFacilities={facilities}
            parkActivities={activities}
            campingFacilities={campings}
          />
        </div>
      </div>
    </div>
  )
}

export default NearbyPark