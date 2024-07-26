import React, { useState } from "react"
import { Link } from "gatsby"
import Carousel from "react-bootstrap/Carousel"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faBan, faCircleChevronRight, faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons"

import FeatureIcons from "./featureIcons"
import ParkAccessStatus from "../../components/park/parkAccessStatus"

import parksLogo from "../../images/park-card.png"

import { addSmallImagePrefix, handleImgError } from "../../utils/helpers"

const locationLabel = (parkLocations) => {
  if (!parkLocations || !parkLocations.length) {
    return "";
  }
  const arrList = parkLocations.map(p => { return p.searchArea });
  const distinctLocations = [...new Set(arrList)]
  return distinctLocations.join(", ");
}

const ParkCard = ({ r }) => {
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

  return (
    <div className="m20t">
      {/* card for pc */}
      <div className="d-none d-lg-block park-card park-card-desktop">
        <div className="row no-gutters">
          {r.parkPhotos &&
            r.parkPhotos.length === 0 && (
              <div className="col-lg-auto park-image-div park-image-logo-div">
                <img
                  alt="logo"
                  className="search-result-logo-image"
                  src={parksLogo}
                />
              </div>
            )}
          {r.parkPhotos &&
            r.parkPhotos.length === 1 && (
              <div className={`${hasError ? "park-image-logo-div" : ""} col-lg-auto park-image-div`}>
                <img
                  alt="park"
                  className={`${hasError ? "search-result-logo-image" : "search-result-image"}`}
                  src={hasError ? parksLogo : addSmallImagePrefix(r.parkPhotos[0])}
                  onError={(e) => { handleImgError(e, r.parkPhotos[0], setHasError) }}
                />
              </div>
            )}
          {r.parkPhotos &&
            r.parkPhotos.length > 1 && (
              <div className={`${hasError ? "park-image-logo-div" : ""} col-lg-auto park-image-div`}>
                <Carousel
                  fade
                  interval={null}
                  nextIcon={<FontAwesomeIcon icon={faCircleChevronRight} />}
                  prevIcon={<FontAwesomeIcon icon={faCircleChevronLeft} />}
                  onSelect={handleSelect}
                  activeIndex={index}
                  className={`park-carousel tab-focus-${isTabFocused}`}
                >
                  {r.parkPhotos.map(
                    (item, index) => {
                      return (
                        <Carousel.Item
                          key={index}
                          tabIndex={0}
                          onFocus={() => setIsTabFocused(true)}
                          onBlur={() => setIsTabFocused(false)}
                          onKeyDown={() => handleKeyDown(r.parkPhotos)}
                        >
                          <img
                            alt="park carousel"
                            key={index}
                            className={`${hasError ? "search-result-logo-image" : "search-result-image"}`}
                            src={hasError ? parksLogo : addSmallImagePrefix(item)}
                            onError={(e) => { handleImgError(e, item, setHasError) }}
                          />
                        </Carousel.Item>
                      )
                    }
                  )}
                </Carousel>
              </div>
            )}

          <div className="col park-content">
            <div className="park-content-top">
              <h2 className="park-heading-text">
                <Link
                  to={`/${r.slug}/`}
                  className="underline-hover desktop-park-link"
                >
                  {r.protectedAreaName}
                  <FontAwesomeIcon icon={faCircleChevronRight} className="park-heading-icon" />
                </Link>
              </h2>
              <p className="mb-0">{locationLabel(r.parkLocations)}</p>
            </div>
            <div className="park-content-bottom">
              <div className="park-content-bottom--left">
                <FeatureIcons
                  page="find a park"
                  slug={r.slug}
                  iconSize={32}
                  parkFacilities={r.parkFacilities}
                  parkActivities={r.parkActivities}
                  parkCampingTypes={r.parkCampingTypes}
                />
              </div>
              <div className="park-content-bottom--right">
                <ParkAccessStatus
                  advisories={r.advisories}
                  slug={r.slug}
                  subAreas={r.parkOperationSubAreas}
                  operationDates={r.parkOperationDates}
                  hideComma={true}
                />
                {r.hasCampfireBan &&
                  <div className="campfire-ban-icon">
                    <FontAwesomeIcon icon={faBan} />
                    No campfires
                  </div>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* card for mobile */}
      <div className="d-block d-lg-none park-card">
        {r.parkPhotos &&
          r.parkPhotos.length === 0 && (
            <div className="park-image-div-mobile park-image-logo-div">
              <img
                alt="logo"
                className="search-result-logo-image"
                src={parksLogo}
              />
            </div>
          )}
        {r.parkPhotos &&
          r.parkPhotos.length === 1 && (
            <div className={`${hasError ? "park-image-logo-div" : ""} park-image-div-mobile`}>
              <img
                alt="park"
                className={`${hasError ? "search-result-logo-image" : "search-result-image"}`}
                src={hasError ? parksLogo : addSmallImagePrefix(r.parkPhotos[0])}
                onError={(e) => { handleImgError(e, r.parkPhotos[0], setHasError) }}
              />
            </div>
          )}
        {r.parkPhotos &&
          r.parkPhotos.length > 1 && (
            <div className={`${hasError ? "park-image-logo-div" : ""} park-image-div-mobile`}>
              <Carousel
                fade
                interval={null}
                nextIcon={<FontAwesomeIcon icon={faCircleChevronRight} />}
                prevIcon={<FontAwesomeIcon icon={faCircleChevronLeft} />}
                className="park-carousel-mobile"
              >
                {r.parkPhotos.map(
                  (item, index) => {
                    return (
                      <Carousel.Item key={index} tabIndex={0}>
                        <img
                          alt="park carousel"
                          key={index}
                          className={`${hasError ? "search-result-logo-image" : "search-result-image"}`}
                          src={hasError ? parksLogo : addSmallImagePrefix(item)}
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
              to={`/${r.slug}/`}
              className="underline-hover mobile-park-link"
            >
              {r.protectedAreaName}
              <FontAwesomeIcon icon={faCircleChevronRight} className="park-heading-icon" />
            </Link>
          </h2>
          <p>{locationLabel(r.parkLocations)}</p>
          <div>
            <FeatureIcons
              page="find a park"
              slug={r.slug}
              iconSize={32}
              parkFacilities={r.parkFacilities}
              parkActivities={r.parkActivities}
              parkCampingTypes={r.parkCampingTypes}
            />
          </div>
          <div className="text-blue">
            <ParkAccessStatus
              advisories={r.advisories}
              slug={r.slug}
              subAreas={r.parkOperationSubAreas}
              operationDates={r.parkOperationDates}
              hideComma={true}
            />
            {r.hasCampfireBan &&
              <div className="campfire-ban-icon">
                <FontAwesomeIcon icon={faBan} />
                No campfires
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParkCard