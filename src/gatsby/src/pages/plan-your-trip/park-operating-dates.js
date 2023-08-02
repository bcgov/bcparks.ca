import React, { useState } from "react"
import { graphql, useStaticQuery, Link as GatsbyLink } from "gatsby"
import { Breadcrumbs, Link } from "@mui/material"
import BlockIcon from '@mui/icons-material/Block'
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import _ from "lodash"
import moment from "moment"

import Header from "../../components/header"
import Footer from "../../components/footer"
import Seo from "../../components/seo"
import ScrollToTop from "../../components/scrollToTop"

import "../../styles/listPage.scss"

const ParkLink = ({ park }) => {
  const parkOperation = park.parkOperation || []
  const subAreas = park.parkOperationSubAreas || []

  const datePhrase = (openDate, closeDate, fmt, yearRoundText, delimiter, prefix) => {
    if (openDate && closeDate) {
      try {
        const open = moment(openDate).format(fmt)
        const close = moment(closeDate).format(fmt)
        const openYearRound =
          open.indexOf("Jan 1") === 0 && close.indexOf("Dec 31") === 0
        let output = openYearRound ? yearRoundText : `${prefix || ""}${open}${delimiter}${close}`

        return output
      } catch (err) {
        console.error("Err formatting date " + openDate + ", " + closeDate)
        return ""
      }
    } else {
      return ""
    }
  }

  const fmt = "MMM D, yyyy"
  const yr = "year-round"
  const thisYear = new Date().getFullYear()
  let parkDates = datePhrase(parkOperation.openDate, parkOperation.closeDate, fmt, yr, " to ", "from ")

  if (parkDates !== yr && !parkDates.includes(thisYear)) {
    parkDates = ""
  }

  const processDateRanges = (arr) => {
    const newArr = []
    for (let dateRange of arr) {
      const startYear = moment(dateRange.start).year();
      const endYear = moment(dateRange.end).year();
      if (startYear === endYear) {
        newArr.push(dateRange)
      } else if (endYear > startYear) {
        for (let year = startYear; year <= endYear; year++) {
          if (year === startYear) {
            newArr.push({ start: dateRange.start, end: `${year}-12-31` })
          } else if (year === endYear) {
            newArr.push({ start: `${year}-01-01`, end: dateRange.end })
          } else {
            newArr.push({ start: `${year}-01-01`, end: `${year}-12-31` })
          }
        }
      } else {
        newArr.push(dateRange)
      }
    }

    const sortedUniqueFutureDates = _.uniqWith(newArr, _.isEqual)
      .filter(dateRange => moment(dateRange.end).year() >= new Date().getFullYear())
      .sort((a, b) => {
        return a.start < b.start ? -1 : 1
      })

    let groupedByYear = []
    const fmt = "MMM D"
    const yr = "Year-round"
    let prevYear = 0
    let phrase = ""
    for (let dateRange of sortedUniqueFutureDates) {
      const year = moment(dateRange.start).year();
      if (phrase !== "" && year !== prevYear) {
        groupedByYear.push(phrase);
      }
      if (year !== prevYear) {
        phrase = `${year}: ${datePhrase(dateRange.start, dateRange.end, fmt, yr, "–")}`
      } else {
        phrase += `, ${datePhrase(dateRange.start, dateRange.end, fmt, yr, "–")}`
      }
      prevYear = year;
    }
    if (phrase !== "") {
      groupedByYear.push(phrase);
    }
    return groupedByYear
  }

  for (let idx in subAreas) {
    const subArea = subAreas[idx]
    const facilityType = subArea.facilityType || {}
    subArea.facilityName = facilityType.facilityName || ""
    subArea.facilityIsCamping = facilityType.isCamping || false

    const saDates = subArea.parkOperationSubAreaDates
    subArea.offSeasonDates = []
    subArea.resDates = []
    subArea.serviceDates = []

    for (let dIdx in saDates) {
      const dateRec = saDates[dIdx]
      if (dateRec.isActive) {
        subArea.serviceDates.push({
          start: dateRec.serviceStartDate,
          end: dateRec.serviceEndDate
        })
        subArea.resDates.push({
          start: dateRec.reservationStartDate,
          end: dateRec.reservationEndDate
        })
        subArea.offSeasonDates.push({
          start: dateRec.offSeasonStartDate,
          end: dateRec.offSeasonEndDate
        })
      }
    }

    subArea.serviceDates = processDateRanges(subArea.serviceDates)
    subArea.resDates = processDateRanges(subArea.resDates)
    subArea.offSeasonDates = processDateRanges(subArea.offSeasonDates)

    if (subArea.serviceDates.length === 0
      && subArea.resDates.length === 0
      && subArea.offSeasonDates.length === 0) {
      subArea.serviceDates.push(`${new Date().getFullYear()}: Dates are not yet available`)
    }
  }

  return (
    <div className="park-list">
      <h2>
        <GatsbyLink to={`/${park.slug}`}>
          {park.protectedAreaName}
          <ExpandCircleDownIcon />
        </GatsbyLink>
      </h2>
      <p>The park gate is open {parkDates}.</p>
      {/* display table list if the screen size is bigger than 768 px */}
      <table className="table">
        <thead className="thead-light">
          <tr>
            <th scope="col">Facility</th>
            <th scope="col">Main operating season</th>
            <th scope="col">Booking required</th>
            <th scope="col">Winter season</th>
          </tr>
        </thead>
        <tbody>
          {subAreas.map((subArea, index) => (
            <tr key={index}>
              <td>
                {subArea.parkSubArea}
                {!subArea.isOpen &&
                  <>
                    <br />
                    {"("}<BlockIcon /> Temporarily closed{")"}
                  </>
                }
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
                {subArea.resDates.length > 0 ? (
                  <ul>
                    {subArea.resDates.map((dateRange, index) =>
                      <li key={index}>{dateRange}</li>
                    )}
                  </ul>
                ) : (
                  subArea.facilityIsCamping ? (
                    <>No {"("}first come, first served{")"}</>
                  ):(
                    <>N/A</>
                  )
                )}
              </td>
              <td>
                {subArea.offSeasonDates.length > 0 ? (
                  <ul>
                    {subArea.offSeasonDates.map((dateRange, index) =>
                      <li key={index}>{dateRange}</li>
                    )}
                  </ul>
                ) : (
                  <>No services</>
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
              <h4>{subArea.parkSubArea}</h4>
              {!subArea.isOpen &&
                <h5>{"("}<BlockIcon /> Temporarily closed{")"}</h5>
              }
              {subArea.isCleanAirSite &&
                <h5>{"("}Clean air site{")"}</h5>
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
                  <b>Booking required</b>
                  {subArea.resDates.length > 0 ? (
                    <ul>
                      {subArea.resDates.map((dateRange, index) =>
                        <li key={index}>{dateRange}</li>
                      )}
                    </ul>
                  ) : (
                    subArea.facilityIsCamping ? (
                      <>
                        <br/>No {"("}first come, first served{")"}
                      </>
                    ):(
                      <>
                        <br/>N/A
                      </>
                    )
                  )}
                </div>
                {subArea.offSeasonDates.length > 0 && (
                  <div className="list-group-item--container">
                    <b>Winter season</b>
                    <ul>
                      {subArea.offSeasonDates.map((dateRange, index) =>
                        <li key={index}>{dateRange}</li>
                      )}
                    </ul>
                  </div>
                )}
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
        sort: {protectedAreaName: ASC}
        filter: {
          isDisplayed: {eq: true},
          parkOperation: {isActive: {eq: true}},
          parkOperationSubAreas: {elemMatch: {isActive: {eq: true}}}
        }
      ) {
        nodes {
          slug
          protectedAreaName
          parkOperation {
            openDate
            closeDate
          }
          parkOperationSubAreas {
            isOpen
            isCleanAirSite
            parkSubArea
            parkOperationSubAreaDates {
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
    }
  `)

  const menuContent = queryData?.allStrapiMenu?.nodes || []
  const parks = queryData?.allStrapiProtectedArea?.nodes || []

  const [currentFilter, setCurrentFilter] = useState("All")

  const handleClick = (e) => {
    setCurrentFilter(e.target.value)
  }
  const filtering = (char) =>
    parks.filter(park => park.protectedAreaName.charAt(0).toUpperCase() === char)

  const filters = [
    "All", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L",
    "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"
  ]
  const breadcrumbs = [
    <Link key="1" href="/" underline="hover">
      Home
    </Link>,
    <Link key="2" href="/plan-your-trip" underline="hover">
      Plan your trip
    </Link>,
    <div key="3" className="breadcrumb-text">
      Park operating dates
    </div>,
  ]

  return (
    <>
      <ScrollToTop />
      <div className="max-width-override">
        <Header mode="internal" content={menuContent} />
      </div>
      <div id="sr-content" className="static-content--header unique-page--header page-breadcrumbs">
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      </div>
      <div className="static-content-container">
        <h1 className="header-title">
          Park operating dates
        </h1>
      </div>
      <div className="static-content-container">
        <p>
          This page provides a list of planned operating dates for BC Parks and their facilities.
          All dates are subject to change without notice. Be sure to check the park for current updates
          and <GatsbyLink to="/active-advisories">Active Advisories</GatsbyLink> for warnings and closures.
        </p>
        <ul>
          <li><b>Main operating season:</b> full service and fees.</li>
          <li><b>Booking required:</b> camping reservation or permit needed.</li>
          <li><b>Winter season:</b> some services and/or fees may be reduced.</li>
        </ul>
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
                  onClick={(e) => handleClick(e, filter)}
                  className={
                    `btn btn-selected--${
                      currentFilter === filter ? 'true' : 'false'
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
                    <ParkLink park={park} key={index} />
                  ))}
                </div>
              ))
            ) : (
              <div className="list">
                {filtering(currentFilter).map((park, index) => (
                  <ParkLink park={park} key={index} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="max-width-override">
        <Footer />
      </div>
    </>
  )
}

export default ParkOperatingDatesPage

export const Head = () => (
  <Seo title="Park operating dates" />
)