import React, { useState, useEffect } from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons"
import { ProgressBar } from "react-bootstrap"

import Acknowledgment from "../../components/acknowledgment"
import Breadcrumbs from "../../components/breadcrumbs"
import Header from "../../components/header"
import Footer from "../../components/footer"
import Seo from "../../components/seo"
import ScrollToTop from "../../components/scrollToTop"
import ParkAccessStatus from "../../components/park/parkAccessStatus"
import StaticIcon from "../../components/park/staticIcon"
import NoSearchResults from "../../components/search/noSearchResults"
import { preProcessParkFeatures } from "../../utils/parkFeaturesHelper"
import { getAllParkFeatures } from "../../utils/apiHelper"
import { getParkDates } from "../../utils/parkDatesHelper"
import {
  loadAllAdvisories,
  WINTER_FULL_PARK_ADVISORY,
  WINTER_SUB_AREA_ADVISORY,
} from "../../utils/advisoryHelper"
import "../../styles/listPage.scss"

const ParkLink = ({
  park,
  advisories,
  parkFeatures = [],
  advisoryLoadError,
  isLoadingAdvisories,
}) => {
  const parkOperation = park.parkOperation
  const [parkAccessStatus, setParkAccessStatus] = useState({})
  const [addedSeasonalAdvisory, setAddedSeasonalAdvisory] = useState(false)
  // Check if park access status is "Closed"
  const [isParkOpen, setIsParkOpen] = useState(null)

  const parkDates = parkFeatures[0]?.protectedArea?.parkDates || []
  const parkGateDates = getParkDates(parkDates)

  if (!addedSeasonalAdvisory) {
    if (advisories.some(a => a.accessStatus?.hidesSeasonalAdvisory)) {
      setAddedSeasonalAdvisory(true)
    }
    if (parkAccessStatus?.mainGateClosure) {
      advisories.push(WINTER_FULL_PARK_ADVISORY)
      setAddedSeasonalAdvisory(true)
    } else if (parkAccessStatus?.areaClosure) {
      advisories.push(WINTER_SUB_AREA_ADVISORY)
      setAddedSeasonalAdvisory(true)
    }
  }

  const getReservationName = hasBackcountryReservations => {
    return hasBackcountryReservations ? "Reservations required" : "Reservations"
  }

  return (
    <div className="park-list operating-dates-list">
      <div className="d-md-flex justify-content-between">
        <h2 className="mb-3">
          <Link to={`/${park.slug}`}>
            {park.protectedAreaName}
            <FontAwesomeIcon
              icon={faCircleChevronRight}
              className="park-heading-icon"
            />
          </Link>
        </h2>
      </div>
      <div className="mb-2">
        <>
          <span className="me-1">
            {!isLoadingAdvisories && !advisoryLoadError && (
              <ParkAccessStatus
                advisories={advisories}
                slug={park.slug}
                parkFeatures={parkFeatures}
                operationDates={parkDates}
                onStatusCalculated={setParkAccessStatus}
                punctuation="."
                setIsParkOpen={setIsParkOpen}
              />
            )}
          </span>
          {parkGateDates && isParkOpen !== false && (
            <span className="gate-text">
              The {park.type.toLowerCase()}{" "}
              {parkOperation.hasParkGate !== false && "gate"} is open{" "}
              {parkGateDates}.
            </span>
          )}
        </>
      </div>
      {/* display table list if the screen size is bigger than 768 px */}
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">Facility</th>
            <th scope="col">Operating season</th>
            <th scope="col">Reservations / registration</th>
          </tr>
        </thead>
        <tbody>
          {parkFeatures.map((feature, index) => (
            <tr key={index}>
              <td>
                <div className="subarea-name">
                  <StaticIcon name={feature.typeIcon} size={32} />
                  {feature.displayName}
                </div>
                {feature.isCleanAirSite && (
                  <>
                    <br />
                    {"("}Clean air site{")"}
                  </>
                )}
              </td>
              <td>
                <ul>
                  {feature.operationDates.map((dateRange, index) => (
                    <li key={index}>{dateRange}</li>
                  ))}
                </ul>
                {feature.winterFeeDates.length > 0 && (
                  <>
                    <div>
                      <small>Winter rate:</small>
                    </div>
                    <ul>
                      {feature.winterFeeDates.map((dateRange, index) => (
                        <li key={index}>
                          <small>{dateRange}</small>
                        </li>
                      ))}
                    </ul>
                  </>
                )}
              </td>
              <td>
              {feature.reservationDates.length > 0 || feature.backcountryDates.length > 0 ? (
                <>
                {feature.reservationDates.length > 0 && (
                  <>
                    <div>
                      <small>
                        {getReservationName(feature.hasBackcountryReservations)}
                      </small>
                    </div>
                    <ul>
                      {feature.reservationDates.map((dateRange, index) => (
                        <li key={index}>{dateRange}</li>
                      ))}
                    </ul>
                  </>
                )}
                {feature.backcountryDates.length > 0 && (
                  <>
                    <div>
                      <small>
                        Registration required
                      </small>
                    </div>
                    <ul>
                      {feature.backcountryDates.map((dateRange, index) => (
                        <li key={index}>{dateRange}</li>
                      ))}
                    </ul>
                  </>
                  )}
                </>
                ) : (
                  <>
                    No {"("}first come, first served{")"}
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* display table list if the screen size is bigger than 768 px */}
      <div className="card border-secondary">
        {parkFeatures.map((feature, index) => (
          <div className="card-body" key={index}>
            <div className="card-title">
              <div className="subarea-name">
                <StaticIcon name={feature.typeIcon} size={32} />
                <h4>{feature.displayName}</h4>
              </div>
              {feature.isCleanAirSite && (
                <h5 className="mt-2">
                  {"("}Clean air site{")"}
                </h5>
              )}
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="list-group-item--container">
                  <b>Operating season</b>
                  <ul>
                    {feature.operationDates.map((dateRange, index) => (
                      <li key={index}>{dateRange}</li>
                    ))}
                  </ul>
                  {feature.winterFeeDates.length > 0 && (
                    <>
                      <div>
                        <small>Winter rate:</small>
                      </div>
                      <ul>
                        {feature.winterFeeDates.map((dateRange, index) => (
                          <li key={index}>
                            <small>{dateRange}</small>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
                <div className="list-group-item--container">
                  {feature.reservationDates.length > 0 || feature.backcountryDates.length > 0 ? (
                  <>
                  {feature.reservationDates.length > 0 && (
                    <>
                      <b>
                        {getReservationName(feature.hasBackcountryReservations)}
                      </b>
                      <ul>
                        {feature.reservationDates.map((dateRange, index) => (
                          <li key={index}>{dateRange}</li>
                        ))}
                      </ul>
                    </>
                  )}
                  {feature.backcountryDates.length > 0 && (
                    <>
                      <b>Registration required</b>
                      <ul>
                        {feature.backcountryDates.map((dateRange, index) => (
                          <li key={index}>{dateRange}</li>
                        ))}
                      </ul>
                    </>
                    )}
                  </>
                  ) : (
                    <>
                      <b>Reservations / registration</b>
                      <br />
                      No {"("}first come, first served{")"}
                    </>
                  )}
                </div>
              </li>
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}

const ParkOperatingDatesPage = () => {
  const queryData = useStaticQuery(graphql`
    query {
      allStrapiProtectedArea(
        sort: { slug: ASC }
        filter: {
          isDisplayed: { eq: true }
          parkOperation: { isActive: { eq: true } }
          parkFeatures: { elemMatch: { isActive: { eq: true } } }
        }
      ) {
        nodes {
          orcs
          slug
          protectedAreaName
          marineProtectedArea
          type
          parkOperation {
            hasParkGate
          }
        }
      }
      allStrapiMenu(sort: { order: ASC }, filter: { show: { eq: true } }) {
        nodes {
          strapi_id
          title
          url
          order
          id
          show
          strapi_children {
            id
            title
            url
            order
            show
          }
          strapi_parent {
            id
            title
          }
        }
      }
      site {
        siteMetadata {
          apiURL
        }
      }
    }
  `)

  // constants
  const apiBaseUrl = `${queryData.site.siteMetadata.apiURL}/api`
  const menuContent = queryData?.allStrapiMenu?.nodes || []
  const parks = queryData?.allStrapiProtectedArea?.nodes || []
  const filters = [
    "All", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
  ]

  // states
  const [advisories, setAdvisories] = useState([])
  const [advisoryLoadError, setAdvisoryLoadError] = useState(false)
  const [parkFeatures, setParkFeatures] = useState([])
  const [parkFeaturesLoadError, setParkFeaturesLoadError] = useState(false)
  const [isLoadingParkFeatures, setIsLoadingParkFeatures] = useState(true)
  const [isLoadingAdvisories, setIsLoadingAdvisories] = useState(true)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const initialFilter = "A"
  const [currentFilter, setCurrentFilter] = useState(initialFilter)

  // functions
  const handleClick = e => {
    setCurrentFilter(e.target.value)
  }
  const filtering = char =>
    parks.filter(park => park.slug.charAt(0).toUpperCase() === char)
  const hasResult = filtering(currentFilter).length > 0
  const filterAdvisoriesByOrcs = orcs => {
    return advisories.filter(advisory =>
      advisory.protectedAreas.some(protectedArea => protectedArea.orcs === orcs)
    )
  }
  const filterParkFeaturesByOrcs = orcs => {
    return parkFeatures.filter(
      parkFeature => parkFeature.protectedArea.orcs === orcs
    )
  }
  // Pre-process park features to format dates
  const getProcessedParkFeatures = orcs => {
    const filteredParkFeatures = filterParkFeaturesByOrcs(orcs)
    return preProcessParkFeatures(filteredParkFeatures)
  }
  const fetchAdvisories = () => {
    setIsLoadingAdvisories(true)
    loadAllAdvisories(apiBaseUrl)
      .then(response => {
        setAdvisories(response.data.data)
        setAdvisoryLoadError(false)
      })
      .catch(error => {
        setAdvisories([])
        setAdvisoryLoadError(true)
        console.error("Error fetching advisories:", error)
      })
      .finally(() => {
        setIsLoadingAdvisories(false)
      })
  }

  // Fetches park feature data for the default filter, then fetches the full dataset
  const fetchParkFeatures = async () => {
    setIsInitialLoading(true)
    setIsLoadingParkFeatures(true)
    setParkFeaturesLoadError(false)

    try {
      // Initially, load just the visible data for the default filters
      const { data: initialData } = await getAllParkFeatures(
        apiBaseUrl,
        initialFilter
      )
      setParkFeatures(initialData)
      setIsInitialLoading(false)

      // Once the initial data is loaded, begin loading the full dataset in the background
      const { data: allData } = await getAllParkFeatures(apiBaseUrl)
      setParkFeatures(allData)
      setIsLoadingParkFeatures(false)
    } catch (error) {
      setParkFeatures([])
      setParkFeaturesLoadError(true)
      console.error("Error fetching park features:", error)
    }
  }

  // effects
  useEffect(() => {
    fetchAdvisories()
    fetchParkFeatures()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiBaseUrl])

  // components
  const breadcrumbs = [
    <Link key="1" to="/">
      Home
    </Link>,
    <Link key="2" to="/plan-your-trip">
      Plan your trip
    </Link>,
    <div key="3" className="breadcrumb-text">
      Park operating dates
    </div>,
  ]

  return (
    <div className="list-page">
      <div className="max-width-override">
        <Header mode="internal" content={menuContent} />
      </div>
      <div
        id="main-content"
        tabIndex={-1}
        className="static-content--header unique-page--header page-breadcrumbs"
      >
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      <div className="static-content-container">
        <h1 className="header-title">Park operating dates</h1>
      </div>
      <div className="static-content-container">
        <div className="intro-text-container">
          <p>
            This page provides a list of planned operating dates for BC Parks
            and their facilities. All dates are subject to change without
            notice. Be sure to{" "}
            <Link to="/find-a-park">check the park page</Link> or the{" "}
            <Link to="/active-advisories">active advisories page</Link> for
            warnings and closures.
          </p>
          <ul>
            <li>
              <b>Operating season: </b>
              The facility is open, services are provided, and fees may be
              charged. Outside these dates, there are no services provided,
              there are no fees, and access may not be available.
            </li>
            <li>
              <b>Winter rate: </b>
              When a frontcountry campground offers camping with reduced fees
              and services in its shoulder season.
            </li>
            <li>
              <b>Reservations / registration: </b>
              Either <Link to="/reservations">reservations</Link> can be made,
              or{" "}
              <Link to="/reservations/backcountry-camping/permit-registration">
                backcountry permit registration
              </Link>{" "}
              is required.
            </li>
          </ul>
        </div>
      </div>

      <div className="static-content-container">
        <div className="page-content-wrapper">
          <div>
            <h2 className="sub-heading">Filter by park name</h2>
            <div className="filters">
              {filters.map((filter, index) => (
                <button
                  key={index}
                  value={filter}
                  aria-label={filter}
                  onClick={e => handleClick(e, filter)}
                  className={`btn btn-selected--${
                    currentFilter === filter ? "true" : "false"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {parkFeaturesLoadError ? (
            // display the error message if park features failed to load
            <div className="mt-5">
              <h2 className="sub-heading">
                Something went wrong. Please try again later.
              </h2>
              <p>
                If the problem continues, please contact{" "}
                <a href="mailto:parkinfo@gov.bc.ca">parkinfo@gov.bc.ca</a>.
              </p>
            </div>
          ) : isInitialLoading ||
            (isLoadingParkFeatures && currentFilter !== initialFilter) ? (
            // Display loading indicator while loading initial data,
            // or if the user changes the filter before the full dataset is loaded
            <div className="mt-5">
              Loading...
              <ProgressBar animated now={100} className="mt-2" />
            </div>
          ) : (
            // display the list of parks if park features are loaded
            <div className="lists">
              {currentFilter === "All" ? (
                filters.map((filter, index) => (
                  <div key={index} className="list">
                    {filtering(filter).map((park, index) => (
                      <ParkLink
                        key={index}
                        park={park}
                        advisories={filterAdvisoriesByOrcs(park.orcs)}
                        parkFeatures={getProcessedParkFeatures(park.orcs)}
                        advisoryLoadError={advisoryLoadError}
                        isLoadingAdvisories={isLoadingAdvisories}
                      />
                    ))}
                  </div>
                ))
              ) : (
                <div className="list">
                  {hasResult ? (
                    filtering(currentFilter).map((park, index) => (
                      <ParkLink
                        key={index}
                        park={park}
                        advisories={filterAdvisoriesByOrcs(park.orcs)}
                        parkFeatures={getProcessedParkFeatures(park.orcs)}
                        advisoryLoadError={advisoryLoadError}
                        isLoadingAdvisories={isLoadingAdvisories}
                      />
                    ))
                  ) : (
                    <NoSearchResults page="park-operating-dates" />
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <Acknowledgment />
      <ScrollToTop />
      <Footer />
    </div>
  )
}

export default ParkOperatingDatesPage

export const Head = () => (
  <Seo
    title="Park operating dates"
    description="This page provides a list of planned operating dates for BC Parks and their facilities."
  />
)
