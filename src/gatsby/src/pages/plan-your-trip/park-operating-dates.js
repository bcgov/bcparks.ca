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
import { loadAllSubAreas, preProcessSubAreas } from "../../utils/subAreaHelper"
import { getParkDates } from "../../utils/parkDatesHelper"
import { loadAllAdvisories, WINTER_FULL_PARK_ADVISORY, WINTER_SUB_AREA_ADVISORY } from "../../utils/advisoryHelper"
import "../../styles/listPage.scss"

const ParkLink = ({ park, advisories, subAreas, advisoryLoadError, isLoadingAdvisories }) => {
  const thisYear = new Date().getFullYear()
  const parkOperation = park.parkOperation
  const [parkAccessStatus, setParkAccessStatus] = useState({})
  const [addedSeasonalAdvisory, setAddedSeasonalAdvisory] = useState(false)
  // Check if park access status is "Closed"
  const [isParkOpen, setIsParkOpen] = useState(null)

  const parkDates = getParkDates(park.parkOperationDates, thisYear)

  if (!addedSeasonalAdvisory) {
    if (advisories.some(a => a.accessStatus?.hidesSeasonalAdvisory)) {
      setAddedSeasonalAdvisory(true)
    }
    if (parkAccessStatus?.mainGateClosure) {
      advisories.push(WINTER_FULL_PARK_ADVISORY)
      setAddedSeasonalAdvisory(true)
    }
    else if (parkAccessStatus?.areaClosure) {
      advisories.push(WINTER_SUB_AREA_ADVISORY)
      setAddedSeasonalAdvisory(true)
    }
  }

  const getReservationName = (hasBackcountryReservations) => {
    return hasBackcountryReservations ? "Reservations required" : "Reservations"
  }

  return (
    <div className="park-list operating-dates-list">
      <div className="d-md-flex justify-content-between">
        <h2 className="mb-3">
          <Link to={`/${park.slug}`}>
            {park.protectedAreaName}
            <FontAwesomeIcon icon={faCircleChevronRight} className="park-heading-icon" />
          </Link>
        </h2>
      </div>
      <div className="mb-2">
        <>
          <span className="me-1">
            {(!isLoadingAdvisories && !advisoryLoadError) &&
              <ParkAccessStatus
                advisories={advisories}
                slug={park.slug}
                subAreas={subAreas}
                operationDates={park.parkOperationDates}
                onStatusCalculated={setParkAccessStatus}
                punctuation="."
                setIsParkOpen={setIsParkOpen}
              />
            }
          </span>
          {(parkDates && isParkOpen !== false) && (
            <span className="gate-text">The {park.type.toLowerCase()} {parkOperation.hasParkGate !== false && "gate"} is open {parkDates}.</span>
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
          {subAreas.map((subArea, index) => (
            <tr key={index}>
              <td>
                <div className="subarea-name">
                  <StaticIcon name={subArea.typeIcon} size={32} />
                  {subArea.parkSubArea}
                </div>
                {subArea.isCleanAirSite &&
                  <>
                    <br />
                    {"("}Clean air site{")"}
                  </>
                }
              </td>
              <td>
                <ul>
                  {subArea.serviceDates.map((dateRange, index) =>
                    <li key={index}>{dateRange}</li>
                  )}
                </ul>
                {subArea.offSeasonDates.length > 0 && (
                  <>
                    <div>
                      <small>Winter rate:</small>
                    </div>
                    <ul>
                      {subArea.offSeasonDates.map((dateRange, index) =>
                        <li key={index}><small>{dateRange}</small></li>
                      )}
                    </ul>
                  </>
                )}
              </td>
              <td>
                {/* TODO: Add Backcountry registration dates after API endpoint change */}
                <div>
                  <small>
                    {getReservationName(subArea.hasBackcountryReservations)}
                  </small>
                </div>
                {subArea.resDates.length > 0 ? (
                  <ul>
                    {subArea.resDates.map((dateRange, index) =>
                      <li key={index}>{dateRange}</li>
                    )}
                  </ul>
                ) : (
                  <>No {"("}first come, first served{")"}</>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {/* display table list if the screen size is bigger than 768 px */}
      <div className="card border-secondary">
        {subAreas.map((subArea, index) => (
          <div className="card-body" key={index}>
            <div className="card-title">
              <div className="subarea-name">
                <StaticIcon name={subArea.typeIcon} size={32} />
                <h4>{subArea.parkSubArea}</h4>
              </div>
              {subArea.isCleanAirSite &&
                <h5 className="mt-2">{"("}Clean air site{")"}</h5>
              }
            </div>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <div className="list-group-item--container">
                  <b>Operating season</b>
                  <ul>
                    {subArea.serviceDates.map((dateRange, index) =>
                      <li key={index}>{dateRange}</li>
                    )}
                  </ul>
                  {subArea.offSeasonDates.length > 0 && (
                    <>
                      <div>
                        <small>Winter rate:</small>
                      </div>
                      <ul>
                        {subArea.offSeasonDates.map((dateRange, index) =>
                          <li key={index}><small>{dateRange}</small></li>
                        )}
                      </ul>
                    </>
                  )}
                </div>
                {/* TODO: Add Backcountry registration dates after API endpoint change */}
                <div className="list-group-item--container">
                  {subArea.resDates.length > 0 ? (
                    <>
                      <b>
                        {getReservationName(subArea.hasBackcountryReservations)}
                      </b>
                      <ul>
                        {subArea.resDates.map((dateRange, index) =>
                        <li key={index}>{dateRange}</li>
                      )}
                    </ul>
                    </>
                  ) : (
                    <>
                      <b>Reservations / registration</b>
                      <br />No {"("}first come, first served{")"}
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
        sort: {slug: ASC}
        filter: {
          isDisplayed: {eq: true},
          parkOperation: {isActive: {eq: true}},
          parkOperationSubAreas: {elemMatch: {isActive: {eq: true}}}
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
          parkOperationDates {
            operatingYear
            gateOpenDate
            gateCloseDate
          }
        }
      }
      allStrapiMenu(
        sort: {order: ASC},
        filter: {show: {eq: true}}
      ) {
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
  const [isLoadingAdvisories, setIsLoadingAdvisories] = useState(true)
  const [subAreas, setSubAreas] = useState([])
  const [subAreaLoadError, setSubAreaLoadError] = useState(false)
  const [isInitialLoading, setIsInitialLoading] = useState(true)
  const [isLoadingSubAreas, setIsLoadingSubAreas] = useState(true)
  const [currentFilter, setCurrentFilter] = useState("A")

  // functions
  const handleClick = (e) => {
    setCurrentFilter(e.target.value)
  }
  const filtering = (char) =>
    parks.filter(park => park.slug.charAt(0).toUpperCase() === char)
  const hasResult = filtering(currentFilter).length > 0
  const filterAdvisoriesByOrcs = (orcs) => {
    return advisories.filter(advisory =>
      advisory.protectedAreas.some(protectedArea => protectedArea.orcs === orcs)
    )
  }
  const filterSubAreasByOrcs = (orcs) => {
    return subAreas.filter(subArea =>
      subArea.protectedArea.orcs === orcs
    )
  }
  // Pre-process subareas to format dates
  const getProcessedSubAreas = (orcs) => {
    const filteredSubAreas = filterSubAreasByOrcs(orcs)
    return preProcessSubAreas(filteredSubAreas)
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

  // Fetches subarea data for the default filter, then fetches the full dataset
  const fetchSubAreas = async () => {
    setIsInitialLoading(true)
    setIsLoadingSubAreas(true)
    setSubAreaLoadError(false)

    try {
      // Initially, load just the visible data for the default filters
      const {data: initialData} = await loadAllSubAreas(apiBaseUrl, currentFilter)
      setSubAreas(initialData)
      setIsInitialLoading(false)

      // Once the initial data is loaded, begin loading the full dataset in the background
      const {data: allData} = await loadAllSubAreas(apiBaseUrl)
      setSubAreas(allData)
      setIsLoadingSubAreas(false)
    } catch (error) {
      setSubAreas([])
      setSubAreaLoadError(true)
      console.error("Error fetching subareas:", error)
    } finally {
      setIsInitialLoading(false)
      setIsLoadingSubAreas(false)
    }
  }

  // effects
  useEffect(() => {
    fetchAdvisories()
    fetchSubAreas()
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
      <div id="main-content" tabIndex={-1} className="static-content--header unique-page--header page-breadcrumbs">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      <div className="static-content-container">
        <h1 className="header-title">
          Park operating dates
        </h1>
      </div>
      <div className="static-content-container">
        <div className="intro-text-container">
          <p>
            This page provides a list of planned operating dates for BC Parks and their facilities.
            All dates are subject to change without notice. Be sure to <Link to="/find-a-park">check the park page</Link>
            {" "}or the <Link to="/active-advisories">active advisories page</Link> for warnings and closures.
          </p>
          <ul>
            <li>
              <b>Operating season: </b>
              The facility is open, services are provided, and fees may be charged.
              Outside these dates, there are no services provided, there are no fees, and access may not be available.
            </li>
            <li>
              <b>Winter rate: </b>
              When a frontcountry campground offers camping with reduced fees and services in its shoulder season.
            </li>
            <li>
              <b>Reservations / registration: </b>
              Either <Link to="/reservations">reservations</Link> can be made,
              or <Link to="/reservations/backcountry-camping/permit-registration">backcountry permit registration</Link> is required.
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
                  onClick={(e) => handleClick(e, filter)}
                  className={
                    `btn btn-selected--${currentFilter === filter ? 'true' : 'false'
                    }`
                  }
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {subAreaLoadError ? (
            // display the error message if subareas failed to load
            <div className="mt-5">
              <h2 className="sub-heading">Something went wrong. Please try again later.</h2>
              <p>If the problem continues, please contact{" "}
                <a href="mailto:parkinfo@gov.bc.ca">parkinfo@gov.bc.ca</a>.
              </p>
            </div>
          ) : (isInitialLoading || (isLoadingSubAreas && currentFilter !== "A")) ? (
            // Display loading indicator while loading initial data,
            // or if the user changes the filter before the full dataset is loaded
            <div className="mt-5">
              Loading...
              <ProgressBar animated now={100} className="mt-2" />
            </div>
          ) : (
            // display the list of parks if subareas are loaded
            <div className="lists">
              {currentFilter === "All" ? (
                filters.map((filter, index) => (
                  <div key={index} className="list">
                    {filtering(filter).map((park, index) => (
                      <ParkLink
                        key={index}
                        park={park}
                        advisories={filterAdvisoriesByOrcs(park.orcs)}
                        subAreas={getProcessedSubAreas(park.orcs)}
                        advisoryLoadError={advisoryLoadError}
                        isLoadingAdvisories={isLoadingAdvisories}
                      />
                    ))}
                  </div>
                ))
              ) : (
                <div className="list">
                  {hasResult ?
                    filtering(currentFilter).map((park, index) => (
                      <ParkLink
                        key={index}
                        park={park}
                        advisories={filterAdvisoriesByOrcs(park.orcs)}
                        subAreas={getProcessedSubAreas(park.orcs)}
                        advisoryLoadError={advisoryLoadError}
                        isLoadingAdvisories={isLoadingAdvisories}
                      />
                    ))
                    : <NoSearchResults page="park-operating-dates" />
                  }
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
