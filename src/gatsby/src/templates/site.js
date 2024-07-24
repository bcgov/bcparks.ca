import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
import { sortBy, truncate } from "lodash"
import { graphql, Link as GatsbyLink, navigate } from "gatsby"

import useScrollSpy from "react-use-scrollspy"

import { isNullOrWhiteSpace } from "../utils/helpers";
import { loadAdvisories } from '../utils/advisoryHelper';

import Breadcrumbs from "../components/breadcrumbs"
import Footer from "../components/footer"
import Header from "../components/header"
import PageMenu from "../components/pageContent/pageMenu"

import AdvisoryDetails from "../components/park/advisoryDetails"
import CampingDetails from "../components/park/campingDetails"
import ParkActivity from "../components/park/parkActivity"
import ParkFacility from "../components/park/parkFacility"
import ParkHeader from "../components/park/parkHeader"
import ParkOverview from "../components/park/parkOverview"
import ParkPhotoGallery from "../components/park/parkPhotoGallery"
import MapLocation from "../components/park/mapLocation"
import SafetyInfo from "../components/park/safetyInfo"
import ScrollToTop from "../components/scrollToTop"
import Seo from "../components/seo"

import "../styles/parks.scss"

export default function SiteTemplate({ data }) {
  const apiBaseUrl = `${data.site.siteMetadata.apiURL}/api`

  const site = data.strapiSite
  const park = site.protectedArea
  const activities = site.parkActivities
  const facilities = site.parkFacilities
  const campingTypes = site.parkCampingTypes
  const operations = site.parkOperation || {}
  const photos = [...data.featuredPhotos.nodes, ...data.regularPhotos.nodes]

  const description = site.description.data.description
  const safetyInfo = site.safetyInfo?.data?.safetyInfo
  const locationNotes = site.locationNotes.data.locationNotes
  const managementAreas = park.managementAreas || []
  const searchArea = managementAreas[0]?.searchArea || {}

  const activeActivities = sortBy(
    activities.filter(
      activity => activity.isActive && activity.activityType?.isActive
    ),
    ["activityType.rank", "activityType.activityName"],
    ["asc"]
  )
  const activeFacilities = sortBy(
    facilities.filter(
      facility => facility.isActive && facility.facilityType?.isActive
    ),
    ["facilityType.rank", "facilityType.facilityName"],
    ["asc"]
  )
  const activeCampings = sortBy(
    campingTypes.filter(
      campingType => campingType.isActive && campingType.campingType?.isActive
    ),
    ["campingType.rank", "campingType.campingTypeName"],
    ["asc"]
  )

  const nonCampingActivities =
    activeActivities
      .sort((a, b) => a.activityType.activityName.localeCompare(b.activityType.activityName))
  const nonCampingFacilities =
    activeFacilities
      .sort((a, b) => a.facilityType.facilityName.localeCompare(b.facilityType.facilityName))

  const hasReservations = operations.hasReservations
  const hasDayUsePass = operations.hasDayUsePass

  const menuContent = data?.allStrapiMenu?.nodes || []

  const [advisoryLoadError, setAdvisoryLoadError] = useState(false)
  const [isLoadingAdvisories, setIsLoadingAdvisories] = useState(true)
  const [advisories, setAdvisories] = useState([])
  const [protectedAreaLoadError, setProtectedAreaLoadError] = useState(false)
  const [isLoadingProtectedArea, setIsLoadingProtectedArea] = useState(true)
  const [hasCampfireBan, setHasCampfireBan] = useState(false)

  useEffect(() => {
    setIsLoadingAdvisories(true)
    loadAdvisories(apiBaseUrl, park?.orcs)
      .then(response => {
        if (response.status === 200) {
          // for sites, we want to include all advisories at the park level  
          // and advisories for this specific site, but we exclude advisories 
          // for other sites at the same park
          const advisories = response.data.data.filter(
            (advisory) => {
              return advisory.sites.length === 0 ||
                advisory.sites.some(
                  (s) => s.orcsSiteNumber === site.orcsSiteNumber
                )
            })
          setAdvisories(advisories)
          setAdvisoryLoadError(false)
        } else {
          setAdvisories([])
          setAdvisoryLoadError(true)
        }
      })
      .finally(() => {
        setIsLoadingAdvisories(false)
      })
    setIsLoadingProtectedArea(true)
    axios.get(`${apiBaseUrl}/protected-areas/${park?.orcs}?fields=hasCampfireBan`)
      .then(response => {
        if (response.status === 200) {
          setHasCampfireBan(response.data.hasCampfireBan)
          setProtectedAreaLoadError(false)
        } else {
          setHasCampfireBan(false)
          setProtectedAreaLoadError(true)
        }
      })
      .finally(() => {
        setIsLoadingProtectedArea(false)
      })
  }, [apiBaseUrl, park?.orcs, site.orcsSiteNumber])

  const parkOverviewRef = useRef("")
  const knowBeforeRef = useRef("")
  const mapLocationRef = useRef("")
  const campingRef = useRef("")
  const activityRef = useRef("")
  const facilityRef = useRef("")

  const sectionRefs = [
    parkOverviewRef,
    knowBeforeRef,
    mapLocationRef,
    campingRef,
    activityRef,
    facilityRef,
  ]

  const activeSection = useScrollSpy({
    sectionElementRefs: sectionRefs,
    defaultValue: 0,
    offsetPx: -100,
  })

  const menuItems = [
    {
      sectionIndex: 0,
      display: "Highlights in this site",
      link: "#highlights",
      visible: !isNullOrWhiteSpace(description),
    },
    {
      sectionIndex: 1,
      display: "Know before you go",
      link: "#know-before-you-go",
      visible: true,
    },
    {
      sectionIndex: 2,
      display: "Maps and Location",
      link: "#maps-and-location",
      visible: !isNullOrWhiteSpace(locationNotes),
    },
    {
      sectionIndex: 3,
      display: "Camping",
      link: "#camping",
      visible: activeCampings.length > 0,
    },
    {
      sectionIndex: 4,
      display: "Things to do",
      link: "#things-to-do",
      visible: nonCampingActivities.length > 0,
    },
    {
      sectionIndex: 5,
      display: "Facilities",
      link: "#facilities",
      visible: nonCampingFacilities.length > 0,
    },
  ]

  const breadcrumbs = [
    <GatsbyLink key="1" to="/">
      Home
    </GatsbyLink>,
    <GatsbyLink
      key="2"
      to="/find-a-park/"
      onClick={(e) => {
        if (sessionStorage.getItem("lastSearch")) {
          e.preventDefault();
          navigate('/find-a-park/' + sessionStorage.getItem("lastSearch"))
        }
      }}
    >
      Find a park
    </GatsbyLink>,
    <GatsbyLink
      key="3"
      to={`/${park?.slug ? park.slug : 'parks/protected-area'}`}
    >
      {park?.protectedAreaName}
    </GatsbyLink>,
    <div key="4" className="breadcrumb-text">
      {site.siteName}
    </div>,
  ]

  return (
    <div>
      <Header mode="internal" content={menuContent} />
      <div className="park-header-container d-flex flex-wrap d-md-block">
        <div className="parks-container bg-brown">
          <div id="main-content" tabIndex={-1} className="park-info-container breadcrumb-container">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
          {!isLoadingProtectedArea && !protectedAreaLoadError && (
            <ParkHeader
              orcs={site.orcsSiteNumber}
              slug={`${park.slug}/${site.slug}`}
              parkName={`${park?.protectedAreaName}: ${site.siteName}`}
              parkType="site"
              mapZoom={site.mapZoom}
              latitude={site.latitude}
              longitude={site.longitude}
              campings={activeCampings}
              facilities={nonCampingFacilities}
              hasCampfireBan={hasCampfireBan}
              hasDayUsePass={hasDayUsePass}
              hasReservations={hasReservations}
              advisories={advisories}
              advisoryLoadError={advisoryLoadError}
              isLoadingAdvisories={isLoadingAdvisories}
              searchArea={searchArea}
              parkOperation={site.parkOperation}
              operationDates={park.parkOperationDates}
              subAreas={park.parkOperationSubAreas.filter(sa => sa.orcsSiteNumber === site.orcsSiteNumber)}
            />
          )}
        </div>
        <div className={`parks-container gallery-container has-photo--${photos.length > 0}`}>
          {photos.length > 0 && (
            <div className="background-container bg-brown"></div>
          )}
          <div className="park-info-container">
            <ParkPhotoGallery photos={photos} />
          </div>
        </div>
      </div>
      <div className="parks-container main-container">
        <div className="page-menu--mobile d-block d-md-none">
          <PageMenu
            pageSections={menuItems}
            activeSection={activeSection}
            menuStyle="select"
          />
        </div>
        <div className="row no-gutters park-info-container">
          <div className="page-menu--desktop d-none d-md-block col-12 col-md-4">
            <PageMenu
              pageSections={menuItems}
              activeSection={activeSection}
              menuStyle="nav"
            />
          </div>
          <div className="page-content col-12 col-md-8">
            {menuItems[0].visible && (
              <div ref={parkOverviewRef} className="w-100">
                <ParkOverview data={description} type="site" />
              </div>
            )}
            {menuItems[1].visible && (
              <div ref={knowBeforeRef} className="w-100">
                <div id="know-before-you-go" className="anchor-link">
                  <h2 className="section-heading">Know before you go</h2>
                  {isLoadingAdvisories && (
                    <div className="mb-5">
                      <h2 className="section-heading">{`Advisories`}</h2>
                      <div className="spinner-border" role="status">
                        <span className="sr-only">Loading...</span>
                      </div>
                    </div>
                  )}
                  {!isLoadingAdvisories && advisoryLoadError && (
                    <div className="mb-5">
                      <div className="alert alert-danger" role="alert">
                        An error occurred while loading current public
                        advisories.
                      </div>
                    </div>
                  )}
                  {!isLoadingAdvisories && !advisoryLoadError && (
                    <AdvisoryDetails advisories={advisories} parkType="site" />
                  )}
                  {!isNullOrWhiteSpace(safetyInfo) &&
                    <SafetyInfo safetyInfo={safetyInfo} />
                  }
                </div>
              </div>
            )}
            {menuItems[2].visible && (
              <div ref={mapLocationRef} className="w-100">
                <MapLocation locationNotes={locationNotes} />
              </div>
            )}
            {menuItems[3].visible && (
              <div ref={campingRef} className="w-100">
                <CampingDetails
                  data={{
                    activeCampings: activeCampings,
                    reservations: site.reservations,
                    hasDayUsePass: hasDayUsePass,
                    hasReservations: hasReservations,
                  }}
                />
              </div>
            )}
            {menuItems[4].visible && (
              <div ref={activityRef} className="w-100">
                <ParkActivity data={nonCampingActivities} />
              </div>
            )}
            {menuItems[5].visible && (
              <div ref={facilityRef} className="w-100">
                <ParkFacility data={nonCampingFacilities} />
              </div>
            )}
          </div>
        </div>
      </div>
      <ScrollToTop />
      <Footer />
    </div>
  )
}

export const Head = ({ data }) => {
  const site = data.strapiSite
  const park = site.protectedArea
  const description = site.description.data.description
  const siteDescription = description.replace(/(<([^>]+)>)/ig, '');
  const siteDescriptionShort = truncate(siteDescription, { length: 160 });
  const photos = [...data.featuredPhotos.nodes, ...data.regularPhotos.nodes]
  const photoUrl = photos[0]?.imageUrl

  return (
    <Seo
      title={`${park?.protectedAreaName}: ${site.siteName}`}
      description={siteDescriptionShort}
      image={photoUrl}
    />
  )
}

export const query = graphql`
  query SiteDetails($orcsSiteNumber: String) {
    strapiSite(
      isDisplayed: {eq: true},
      orcsSiteNumber: {eq: $orcsSiteNumber}
    ) {
      slug
      siteName
      siteNumber
      orcsSiteNumber
      mapZoom
      longitude
      latitude
      locationNotes {
        data {
          locationNotes
        }
      }
      description {
        data {
          description
        }
      }
      safetyInfo {
        data {
          safetyInfo
        }
      }
      reservations {
        data {
          reservations
        }
      }
      isUnofficialSite
      protectedArea {
        orcs
        slug
        protectedAreaName
        parkOperationDates {
          operatingYear
          gateOpenDate
          gateCloseDate
        }
        parkOperationSubAreas {
          orcsSiteNumber
          isActive
          isOpen
          closureAffectsAccessStatus
          parkOperationSubAreaDates {
            isActive
            operatingYear
            openDate
            closeDate
          }
          parkSubAreaType {
            closureAffectsAccessStatus
          }
        }
        managementAreas {
          searchArea {
            searchAreaName
          }
        }
      }
      parkActivities {
        isActive
        isActivityOpen
        hideStandardCallout
        description {
          data
        }
        activityType {
          activityName
          activityCode
          isActive
          icon
          iconNA
          rank
          defaultDescription {
            data
          }
          appendStandardCalloutText {
            data
          }
        }
      }
      parkFacilities {
        isActive
        isFacilityOpen
        hideStandardCallout
        description {
          data
        }
        facilityType {
          facilityName
          facilityCode
          isActive
          icon
          iconNA
          rank
          defaultDescription {
            data
          }
          appendStandardCalloutText {
            data
          }
        }
      }
      parkCampingTypes {
        isActive
        isCampingOpen
        hideStandardCallout
        description {
          data
        }
        campingType {
          campingTypeName
          campingTypeCode
          isActive
          icon
          iconNA
          rank
          defaultDescription {
            data
          }
          appendStandardCalloutText {
            data
          }
        }
      }
      parkOperation {
        hasReservations
        hasDayUsePass
      }
    }
    featuredPhotos: allStrapiParkPhoto(
      filter: {
        orcsSiteNumber: {eq: $orcsSiteNumber},
        isFeatured: {eq: true},
        isActive: {eq: true}
      }
      sort: [
        {sortOrder: ASC},
        {dateTaken: DESC},
        {strapi_id: DESC}
      ]
    ) {
      nodes {
        imageUrl
        caption {
          data {
            caption
          }
        }
      }
    }
    regularPhotos: allStrapiParkPhoto(
      filter: {
        orcsSiteNumber: {eq: $orcsSiteNumber},
        isFeatured: {ne: true},
        isActive: {eq: true}
      }
      sort: [
        {sortOrder: ASC},
        {dateTaken: DESC},
        {strapi_id: DESC}
      ]
    ) {
      nodes {
        imageUrl
        caption {
          data {
            caption
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
`
