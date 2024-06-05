import React, { useState, useEffect } from "react"
import axios from "axios"
import { graphql, useStaticQuery, Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleChevronRight } from "@fortawesome/free-solid-svg-icons"

import Breadcrumbs from "../../components/breadcrumbs"
import Header from "../../components/header"
import Footer from "../../components/footer"
import Seo from "../../components/seo"
import ScrollToTop from "../../components/scrollToTop"
import ParkAccessStatus from "../../components/park/parkAccessStatus"
import StaticIcon from "../../components/park/staticIcon"
import { datePhrase, processDateRanges, groupSubAreaDates } from "../../utils/parkDatesHelper"
import "../../styles/listPage.scss"

const ParkLink = ({ park, advisories }) => {
  const thisYear = new Date().getFullYear()
  const parkOperation = park.parkOperation
  const parkOperationDates = park.parkOperationDates.find(d => d.operatingYear === +thisYear) || {}
  const subAreas = park.parkOperationSubAreas.filter(a => a.isActive) || []

  // Overall operating dates for parks, to display above subareas
  let fmt = "MMM D, yyyy"
  let yr = "year-round"
  let parkDates = datePhrase(parkOperationDates.gateOpenDate, parkOperationDates.gateCloseDate, fmt, yr, " to ", "from ")

  if (parkDates !== yr && !parkDates.includes(thisYear)) {
    parkDates = ""
  }

  // ---- Subarea Dates -----
  yr = "Year-round"
  fmt = "MMM D"

  for (let idx in subAreas) {
    let subArea = subAreas[idx]
    const facilityType = subArea.facilityType || {}
    subArea.facilityName = facilityType.facilityName || ""
    subArea.facilityIsCamping = facilityType.isCamping || false
    const iconUrl = subArea.parkSubAreaType?.iconUrl || ""
    subArea.typeIcon = iconUrl.split("/")[iconUrl.split("/").length - 1]

    subArea = groupSubAreaDates(subArea)

    // get distinct date ranges sorted chronologically
    subArea.operationDates = processDateRanges(subArea.operationDates, fmt, yr, "–")
    subArea.serviceDates = processDateRanges(subArea.serviceDates, fmt, yr, "–")
    subArea.resDates = processDateRanges(subArea.resDates, fmt, yr, "–")
    subArea.offSeasonDates = processDateRanges(subArea.offSeasonDates, fmt, yr, "–")

    // add a placeholder if no dates are available for the current year
    if (subArea.serviceDates.length === 0
      && subArea.resDates.length === 0
      && subArea.offSeasonDates.length === 0) {
      subArea.serviceDates.push(`${new Date().getFullYear()}: Dates unavailable`)
    }
  }

  return (
    <div className="park-list operating-dates-list">
      <div className="d-md-flex justify-content-between mb-2">
        <h2 className="mb-0">
          <Link to={`/${park.slug}`}>
            {park.protectedAreaName}
            <FontAwesomeIcon icon={faCircleChevronRight} className="park-heading-icon" />
          </Link>
        </h2>
      </div>
      <div className="mb-3">
        <>
          <span className="mr-1">
            <ParkAccessStatus
              advisories={advisories}
              slug={park.slug}
              subAreas={park.parkOperationSubAreas}
              operationDates={park.parkOperationDates}
              punctuation={parkDates ? "." : ""}
            />
          </span>
          {parkDates && (
            <span className="gate-text">The {park.type.toLowerCase()} {parkOperation.hasParkGate !== false && "gate"} is open {parkDates}.</span>
          )}
        </>
      </div>
      {/* display table list if the screen size is bigger than 768 px */}
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">Facility</th>
            <th scope="col">Main operating season</th>
            <th scope="col">Winter season</th>
            <th scope="col">Booking required</th>
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
              </td>
              <td>
                {subArea.offSeasonDates.length > 0 ? (
                  <ul>
                    {subArea.offSeasonDates.map((dateRange, index) =>
                      <li key={index}>{dateRange}</li>
                    )}
                  </ul>
                ) : (
                  subArea.operationDates.length > 0 ? (
                    <>
                      {subArea.operationDates[0].includes("Year-round") ? "Limited services" : "No services"}
                    </>
                  ) : (
                    <>Not known</>
                  )
                )}
              </td>
              <td>
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
                  <b>Main operating season</b>
                  <ul>
                    {subArea.serviceDates.map((dateRange, index) =>
                      <li key={index}>{dateRange}</li>
                    )}
                  </ul>
                </div>
                <div className="list-group-item--container">
                  <b>Winter season</b>
                  {subArea.offSeasonDates.length > 0 ? (
                    <ul>
                      {subArea.offSeasonDates.map((dateRange, index) =>
                        <li key={index}>{dateRange}</li>
                      )}
                    </ul>
                  ) : (
                    subArea.operationDates.length > 0 ? (
                      <>
                        <br />{subArea.operationDates[0].includes("Year-round") ? "Limited services" : "No services"}
                      </>
                    ) : (
                      <>
                        <br />Not known
                      </>
                    )
                  )}
                </div>
                <div className="list-group-item--container">
                  <b>Booking required</b>
                  {subArea.resDates.length > 0 ? (
                    <ul>
                      {subArea.resDates.map((dateRange, index) =>
                        <li key={index}>{dateRange}</li>
                      )}
                    </ul>
                  ) : (
                    <>
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
          strapi_id
          slug
          protectedAreaName
          marineProtectedArea
          type
          parkOperation {
            hasParkGate
          }
          parkOperationSubAreas {
            isOpen
            isCleanAirSite
            parkSubArea
            isActive
            closureAffectsAccessStatus
            parkOperationSubAreaDates {
              operatingYear
              isActive
              openDate
              closeDate
              serviceStartDate
              serviceEndDate
              reservationStartDate
              reservationEndDate
              offSeasonStartDate
              offSeasonEndDate
            }
            facilityType {
              facilityName
              isCamping
            }
            parkSubAreaType {
              iconUrl
              closureAffectsAccessStatus
            }
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
          strapi_children {
            id
            title
            url
            order
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

  const apiBaseUrl = `${queryData.site.siteMetadata.apiURL}/api`
  const menuContent = queryData?.allStrapiMenu?.nodes || []
  const protectedAreas = queryData?.allStrapiProtectedArea?.nodes || []

  const [currentFilter, setCurrentFilter] = useState("All")
  const [parks, setParks] = useState([])
  const [accessStatuses, setAccessStatuses] = useState({})

  useEffect(() => {
    setParks(protectedAreas)
    axios.get(`${apiBaseUrl}/public-advisories/access-statuses`)
      .then(response => {
        if (response.status === 200) {
          setAccessStatuses(response.data);
        }
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const handleClick = (e) => {
    setCurrentFilter(e.target.value)
  }
  const filtering = (char) =>
    parks.filter(park => park.slug.charAt(0).toUpperCase() === char)

  const filters = [
    "All", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
  ]
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
            All dates are subject to change without notice. Be sure to <Link to="/find-a-park">check the park</Link> page
            or the <Link to="/active-advisories">active advisories</Link> page for warnings and closures.
          </p>
          <ul>
            <li>
              <b>Main operating season: </b>
              During these dates, the facility is open, and operates with full services.
              Any fees are charged at the regular rate. Parks may have different services and fees,
              so <Link to="/find-a-park">check the park</Link> page for details.
            </li>
            <li>
              <b>Winter season: </b>
              During these dates, the facility is open, but may offer limited services and charge a reduced winter camping fee.
              {" "}<Link to="/find-a-park">Check the park</Link> page for details.
              When a facility is not operating, there are no fees and no services provided.
            </li>
            <li>
              <b>Booking required: </b>
              During these dates, <Link to="/reservations">reservations</Link> are available,
              or you must purchase a <Link to="/reservations/backcountry-camping/permit-registration">backcountry permit</Link>.
              To find out which booking you need, <Link to="/find-a-park">check the park</Link> page.
              If a reservable campground is open outside of these dates, sites are available on a first come, first served basis.
            </li>
          </ul>
        </div>
      </div>

      <div className="static-content-container">
        <div className="page-content-wrapper">
          <div>
            <h3>Filter by park name</h3>
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

          <div className="lists">
            {currentFilter === "All" ? (
              filters.map((filter, index) => (
                <div key={index} className="list">
                  {filtering(filter).map((park, index) => (
                    <ParkLink park={park} advisories={accessStatuses[park.strapi_id] || []} key={index} />
                  ))}
                </div>
              ))
            ) : (
              <div className="list">
                {filtering(currentFilter).map((park, index) => (
                  <ParkLink park={park} advisories={accessStatuses[park.strapi_id] || []} key={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="max-width-override">
        <ScrollToTop />
        <Footer />
      </div>
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