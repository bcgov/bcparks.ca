import React, { useState } from "react"
import { Link } from "gatsby"
import Carousel from "react-bootstrap/Carousel"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleChevronRight, faCircleChevronLeft } from "@fortawesome/free-solid-svg-icons"

import ParkAccessStatus from "../../components/park/parkAccessStatus"

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

const locationLabel = (parkLocations) => {
  if (!parkLocations || !parkLocations.length) {
    return "";
  }
  const arrList = parkLocations.map(p => { return p.searchArea });
  const distinctLocations = [...new Set(arrList)]
  return distinctLocations.join(", ");
}

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
  const iconSize = 32;
  const facilities = park.parkFacilities.filter(f => [6].includes(f.num)) || [];
  const activities = park.parkActivities.filter(a => [1, 3, 8, 9].includes(a.num)) || [];
  const campings = park.campingFacilities.filter(c => [1, 36].includes(c.num)) || [];

  return (
    <>
      {campings.some(x => x.code === 'frontcountry-camping') &&
        <Icon src={campingIcon} label="Frontcountry camping" size={iconSize} />
      }
      {campings.some(x => x.code === 'backcountry-camping') &&
        <Icon src={backcountryCampingIcon} label="Backcountry camping" size={iconSize} />
      }
      {activities.some(x => x.code === 'hiking') &&
        <Icon src={hikingIcon} label="Hiking" size={iconSize} />
      }
      {facilities.some(x => x.code === 'picnic-areas') &&
        <Icon src={picincIcon} label="Picnic areas" size={iconSize} />
      }
      {activities.some(x => x.code === 'swimming') &&
        <Icon src={swimmingIcon} label="Swimming" size={iconSize} />
      }
      {activities.some(x => x.code === 'cycling') &&
        <Icon src={cyclingIcon} label="Cycling" size={iconSize} />
      }
      {activities.some(x => x.code === 'pets-on-leash') &&
        <Icon src={petsIcon} label="Pets on leash" size={iconSize} />
      }
      {campings.length ? (
        <Link to={`/${park.slug}/#park-camping-details-container`}>
          <p aria-label="See all facilities and activities">see all</p>
        </Link>
      ) : (
        (activities.length > 0 || facilities.length > 0) && (
          facilities.length ? (
            <Link to={`/${park.slug}/#park-facility-container`}>
              <p aria-label="See all facilities and activities">see all</p>
            </Link>
          ) : (
            <Link to={`/${park.slug}/#park-activity-container`}>
              <p aria-label="See all facilities and activities">see all</p>
            </Link>
          )
        )
      )}
    </>
  )
}

const ParkCard = ({ r }) => {
  const [hasError, setHasError] = useState(false)

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
                  className="park-carousel"
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
                <FeatureIcons park={r} />
              </div>
              <div className="park-content-bottom--right">
                <ParkAccessStatus
                  advisories={r.advisories}
                  slug={r.slug}
                  subAreas={r.parkOperationSubAreas}
                  operationDates={r.parkOperationDates}
                />
                {r.hasCampfireBan &&
                  <div className="campfire-ban-icon">
                    <Icon src={campfireBanIcon} label="Campfire ban" size="24" />
                    <span>No campfires</span>
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
            <FeatureIcons park={r} />
          </div>
          <div className="text-blue">
            <ParkAccessStatus
              advisories={r.advisories}
              slug={r.slug}
              subAreas={r.parkOperationSubAreas}
              operationDates={r.parkOperationDates}
            />
            {r.hasCampfireBan &&
              <div className="campfire-ban-icon">
                <Icon src={campfireBanIcon} label="Campfire ban" size="24" />
                <span>No campfires</span>
              </div>
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default ParkCard