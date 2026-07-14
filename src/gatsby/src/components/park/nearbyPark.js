import React, { useState } from "react"
import { Link } from "gatsby"
import Carousel from "react-bootstrap/Carousel"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleChevronRight, faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons"

import FeatureIcons from "../search/featureIcons"
import parksLogo from "../../images/park-card.png"
import { addSmallImagePrefix, handleImgError } from "../../utils/helpers"

const NearbyPark = ({ park }) => {
  // sort photos to keep the same conditions as the find a park page
  // ref: scheduler/elasticsearch/transformers/park/main.js
  const photos = park.parkPhotos
    .filter(p => p.isActive)
    .sort((a, b) => {
      if (a.isFeatured && !b.isFeatured) {
        return -1
      } else if (!a.isFeatured && b.isFeatured) {
        return 1
      } else {
        return a.sortOrder - b.sortOrder
      }
    })
    .slice(0, 5)

  // useStates
  const [index, setIndex] = useState(0)
  const [isTabFocused, setIsTabFocused] = useState(false)
  const [errorStates, setErrorStates] = useState(Array(photos.length).fill(false))

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
      return f.isActive && f.facilityType?.isActive;
    }).map(f => {
      return {
        code: f.facilityType.facilityCode,
        num: f.facilityType.facilityNumber
      };
    });
  }
  if (park.parkCampingTypes?.length) {
    // convert camping facilities
    campings = park.parkCampingTypes.filter(ct => {
      return ct.isActive && ct.campingType?.isActive;
    }).map(ct => {
      let campingTypeCode = ct.campingType.campingTypeCode;
      let campingTypeNumber = ct.campingType.campingTypeNumber;
      if (campingTypeCode === 'wilderness-camping') {
        campingTypeCode = 'backcountry-camping'
        campingTypeNumber = 36
      }
      return {
        code: campingTypeCode,
        num: campingTypeNumber
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
          <div className="park-image-div-mobile">
            <img
              alt="logo"
              className="search-result-logo-image"
              src={parksLogo}
            />
          </div>
        )}
      {photos &&
        photos.length === 1 && (
          <div className="park-image-div-mobile">
            <img
              alt="park"
              className={`${errorStates[0] ? "search-result-logo-image" : "search-result-image"}`}
              src={errorStates[0] ? parksLogo : addSmallImagePrefix(photos[0].imageUrl)}
              onError={() => handleImgError(setErrorStates, 0)}
            />
          </div>
        )}
      {photos &&
        photos.length > 1 && (
          <div className="park-image-div-mobile">
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
                        className={`${errorStates[index] ? "search-result-logo-image" : "search-result-image"}`}
                        src={errorStates[index] ? parksLogo : addSmallImagePrefix(item.imageUrl)}
                        onError={() => handleImgError(setErrorStates, index)}
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
        <div className="w-100">
          <FeatureIcons
            page="park"
            slug={park.slug}
            iconSize={36}
            parkFacilities={facilities}
            parkActivities={activities}
            parkCampingTypes={campings}
          />
        </div>
      </div>
    </div>
  )
}

export default NearbyPark