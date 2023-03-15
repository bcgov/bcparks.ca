import React from "react"
import { Link } from "@material-ui/core"
import Carousel from "react-material-ui-carousel"

import ParkAccessStatus from "../../components/park/parkAccessStatus"
import AdvisorySummary from "../../components/search/advisorySummary";

import { addSmallImagePrefix, handleImgError } from "../../utils/helpers"

import dayUseIcon from "../../images/park/day-use.png"
import parksLogo from "../../images/Mask_Group_5.png"

import "../../styles/search.scss"

export default function QuickView({ park, activityItemsLabels, facilityItemsLabels }) {

    return (
        <div className="row search-result-card no-gutters">
            {/* Photos */}
            {park.parkPhotos && park.parkPhotos.length < 1 && (
                <div className="col-12 close-margin park-image-div-mobile park-image-logo-div">
                    <img
                        alt="logo"
                        className="search-result-logo-image"
                        src={parksLogo}
                    />
                </div>
            )}
            {park.parkPhotos && park.parkPhotos.length === 1 && (
                <div className="col-12 close-margin park-image-div-mobile">
                    <img
                        alt="park"
                        className="search-result-image"
                        src={addSmallImagePrefix(park.parkPhotos[0])}
                        onError={(e) => {handleImgError(e, park.parkPhotos[0])}}
                    />
                </div>
            )}
            {park.parkPhotos && park.parkPhotos.length > 1 && (
                <div className="col-12 close-margin park-image-div-mobile">
                    <Carousel
                        className="park-carousel-mobile"
                        autoPlay={false}
                        indicators={false}
                        navButtonsAlwaysVisible={true}
                        animation="fade"
                        timeout={200}
                    >
                        {park.parkPhotos.map(
                            (item, index) => {
                                return (
                                    <img
                                        alt="park carousel"
                                        key={index}
                                        className="search-result-image"
                                        src={addSmallImagePrefix(item)}
                                        onError={(e) => {handleImgError(e, item)}}
                                    />
                                )
                            }
                        )}
                    </Carousel>
                </div>
            )}
            <div className="col-12 park-content-mobile p2030 container">
                {/* Park Access */}
                <div className="row">
                    <div className="col-12 park-overview-content text-blue small-font p5l">
                        <ParkAccessStatus advisories={park.advisories} />
                    </div>
                </div>
                {/* Header */}
                <div className="row">
                    <div className="col-12">
                        <Link
                            href={`/${park.slug}`}
                            className="p10t"
                        >
                            <h3 className="park-heading-text">
                                {park.protectedAreaName}
                            </h3>
                        </Link>
                    </div>
                </div>
                {/* Advisories */}
                <div className="row p10t">
                    <div className="col-12">
                        {park.advisories && park.advisories.length > 0 && (
                            <Link
                                href={`/${park.slug}#park-advisory-details-container`}
                            >
                                <AdvisorySummary
                                    advisories={park.advisories}
                                />
                            </Link>
                        )}
                    </div>
                </div>
                {/* DayUse */}
                <div className="row m15t mr5">
                    <div className="col-12">
                        {park.hasDayUsePass &&
                            park.hasReservations && (
                                <div className="flex-display">
                                    <img
                                        alt=""
                                        className="search-result-icon"
                                        src={dayUseIcon}
                                    />
                                    <div className="pl15 mtm7 text-blue">
                                        Day use and camping{" "}
                                        <br />
                                        offered at this park
                                    </div>
                                </div>
                            )}
                    </div>
                </div>
                {/* Activities */}
                <div className="row p20t mr5">
                    <div className="col-12">
                        {park.parkActivities &&
                            park.parkActivities.length >
                            0 && (
                                <>
                                    <div className="park-af-list pr3">
                                        <b>Activities:</b>
                                    </div>
                                    {park.parkActivities.map(
                                        (parkActivity, index) => (
                                            <div
                                                key={index}
                                                className="park-af-list pr3 text-black"
                                            >
                                                {index < 11 && (
                                                    <>
                                                        {activityItemsLabels[parkActivity.activityType]}
                                                        {index === 10
                                                            ? " ..."
                                                            : index ===
                                                                park
                                                                    .parkActivities
                                                                    .length -
                                                                1
                                                                ? ""
                                                                : ", "}
                                                    </>
                                                )}
                                            </div>
                                        )
                                    )}
                                    <br />
                                </>
                            )}
                    </div>
                </div>
                {/* Facilities */}
                <div className="row p20t mr5">
                    <div className="col-12">
                        {park.parkFacilities &&
                            park.parkFacilities.length >
                            0 && (
                                <>
                                    <div className="park-af-list pr3">
                                        <b>Facilities:</b>
                                    </div>

                                    {park.parkFacilities.map(
                                        (parkFacility, index) => (
                                            <div
                                                key={parkFacility.id}
                                                className="park-af-list pr3 text-black"
                                            >
                                                {index < 6 && (
                                                    <>
                                                        {facilityItemsLabels[parkFacility.facilityType]}
                                                        {index === 5
                                                            ? " ..."
                                                            : index ===
                                                                park
                                                                    .parkFacilities
                                                                    .length -
                                                                1
                                                                ? ""
                                                                : ", "}
                                                    </>
                                                )}
                                            </div>
                                        )
                                    )}
                                    <br />
                                </>
                            )}
                    </div>
                </div>
            </div>

        </div>

    )
}
