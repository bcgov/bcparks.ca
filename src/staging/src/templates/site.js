import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
import { sortBy, truncate } from "lodash"
import { graphql } from "gatsby"
import {
  Box,
  Container,
  Grid,
  CssBaseline,
  Link,
  Breadcrumbs,
} from "@material-ui/core"
import useScrollSpy from "react-use-scrollspy"

import { isNullOrWhiteSpace } from "../utils/helpers";

import Footer from "../components/footer"
import Header from "../components/header"
import PageMenu from "../components/pageContent/pageMenu"

import AccessibilityDetails from "../components/park/accessibilityDetails"
import AdvisoryDetails from "../components/park/advisoryDetails"
import CampingDetails from "../components/park/campingDetails"
import Heading from "../components/park/heading.js"
import ParkActivity from "../components/park/parkActivity"
import ParkFacility from "../components/park/parkFacility"
import ParkHeader from "../components/park/parkHeader"
import ParkOverview from "../components/park/parkOverview"
import ParkPhotoGallery from "../components/park/parkPhotoGallery"
import MapLocation from "../components/park/mapLocation"
import ScrollToTop from "../components/scrollToTop"
import Seo from "../components/seo"

import { useStyles } from "../utils/constants"

const qs = require('qs')

const loadAdvisories = async (apiBaseUrl, orcsId) => {
  const params = qs.stringify ({
    populate: "*",
    filters: {
      protectedAreas: {
        orcs: {
          $eq: orcsId
        }
      }
    },
    pagination: {
      limit: 100,
    },
    sort: ["urgency.sequence:DESC"],
  }, {
    encodeValuesOnly: true,
  })

  return axios.get(`${apiBaseUrl}/public-advisories/?${params}`)
}

export default function SiteTemplate({ data }) {
  const classes = useStyles()

  const apiBaseUrl = `${data.site.siteMetadata.apiURL}/api`

  const site = data.strapiSite
  const park = site.protectedArea
  const activities = site.parkActivities
  const facilities = site.parkFacilities
  const operations = site.parkOperation || {}
  const photos = [...data.featuredPhotos.nodes, ...data.regularPhotos.nodes]

  const description = site.description.data.description
  const locationNotes = site.locationNotes.data.locationNotes

  const activeActivities = sortBy(
    activities.filter(
      activity => activity.isActive && activity.activityType.isActive
    ),
    ["activityType.rank", "activityType.activityName"],
    ["asc"]
  )
  const activeFacilities = sortBy(
    facilities.filter(
      facility => facility.isActive && facility.facilityType.isActive
    ),
    ["facilityType.rank", "facilityType.facilityName"],
    ["asc"]
  )

  const campingActivities = 
    activeActivities.filter(
      activity => activity.activityType.isCamping
    )
  const campingFacilities = 
    activeFacilities.filter(
      facility => facility.facilityType.isCamping
    )
  const nonCampingActivities = 
    activeActivities.filter(
      activity => !activity.activityType.isCamping
    )
  const nonCampingFacilities = 
    activeFacilities.filter(
      facility => !facility.facilityType.isCamping
    )
  const activeCampings = campingActivities.concat(campingFacilities).sort((a, b) => {
    if ((a.activityType?.activityName || a.facilityType?.facilityName) < (b.activityType?.activityName || b.facilityType?.facilityName)) {
      return -1;
    }
    if ((a.activityType?.activityName || a.facilityType?.facilityName) > (b.activityType?.activityName || b.facilityType?.facilityName)) {
      return 1;
    }
    return 0
  })

  const hasReservations = operations.hasReservations
  const hasDayUsePass = operations.hasDayUsePass

  const menuContent = data?.allStrapiMenu?.nodes || []

  const [advisoryLoadError, setAdvisoryLoadError] = useState(false)
  const [isLoadingAdvisories, setIsLoadingAdvisories] = useState(true)
  const [advisories, setAdvisories] = useState([])

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
  }, [apiBaseUrl, park?.orcs, site.orcsSiteNumber])

  const parkOverviewRef = useRef("")
  const accessibilityRef = useRef("")
  const advisoryRef = useRef("")
  const campingRef = useRef("")
  const facilityRef = useRef("")
  const activityRef = useRef("")
  const mapLocationRef = useRef("")

  const sectionRefs = [
    parkOverviewRef,
    accessibilityRef,
    advisoryRef,
    campingRef,
    facilityRef,
    activityRef,
    mapLocationRef,
  ]

  const activeSection = useScrollSpy({
    sectionElementRefs: sectionRefs,
    defaultValue: 0,
    offsetPx: -100,
  })

  const menuItems = [
    {
      sectionIndex: 0,
      display: "Site overview",
      link: "#park-overview-container",
      visible: !isNullOrWhiteSpace(description),
    },
    {
      sectionIndex: 1,
      display: "Accessibility",
      link: "#accessibility-details-container",
      visible: park?.accessibility,
    },
    {
      sectionIndex: 2,
      display:
        !isLoadingAdvisories && !advisoryLoadError
          ? `Advisories (${advisories.length})`
          : "Advisories",
      link: "#park-advisory-details-container",
      visible: true,
    },
    {
      sectionIndex: 3,
      display: "Camping",
      link: "#park-camping-details-container",
      visible: activeCampings.length > 0,
    },
    {
      sectionIndex: 4,
      display: "Facilities",
      link: "#park-facility-container",
      visible: nonCampingFacilities.length > 0,
    },
    {
      sectionIndex: 5,
      display: "Activities",
      link: "#park-activity-container",
      visible: nonCampingActivities.length > 0,
    },
    {
      sectionIndex: 6,
      display: "Location",
      link: "#park-maps-location-container",
      visible: (site.latitude && site.longitude) || !isNullOrWhiteSpace(locationNotes),
    },
  ]

  const mapData = {
    latitude: site.latitude,
    longitude: site.longitude,
    mapZoom: site.mapZoom,
    parkOrcs: site.orcsSiteNumber
  }

  const breadcrumbs = [
    <Link key="1" href="/">
      Home
    </Link>,
    <Link key="2" href="/find-a-park">
      Find a park
    </Link>,
    <Link key="3" href={`/${park?.slug ? park.slug : 'parks/protected-area'}`}>
      {park?.protectedAreaName}
    </Link>,
    <div key="4" className="breadcrumb-text">
      {site.siteName}
    </div>,
  ]

  return (
    <div className="grey-background">
      <Header mode="internal" content={menuContent} />
      <ScrollToTop />
      <CssBaseline />

      <div className="d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
        <Grid item xs={12} sm={12}>
          <ParkPhotoGallery photos={photos} />
        </Grid>
      </div>
      <div className="container parks-container">
        <Container id="sr-content" className="park-info-container" maxWidth={false}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <div className="p30t d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none" />
              <Breadcrumbs
                separator="›"
                aria-label="breadcrumb"
                className="p20t"
              >
                {breadcrumbs}
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12} sm={12}>
              <ParkHeader
                parkName={`${park?.protectedAreaName}: ${site.siteName}`}
                hasReservations={hasReservations}
                hasDayUsePass={hasDayUsePass}
                isLoadingAdvisories={isLoadingAdvisories}
                advisoryLoadError={advisoryLoadError}
                advisories={advisories}
              />
            </Grid>
          </Grid>
        </Container>
      </div>
      <div className="page-menu--mobile">
        <div className="d-block d-md-none">
          <PageMenu
            pageSections={menuItems}
            activeSection={activeSection}
            menuStyle="select"
          />
        </div>
      </div>
      <div className="container parks-container">
        <Container className="park-info-container" maxWidth={false}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <div className="d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                <ParkPhotoGallery photos={photos} />
              </div>
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={3}
              lg={3}
              className="page-menu--desktop d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none"
            >
              <PageMenu
                pageSections={menuItems}
                activeSection={activeSection}
                menuStyle="nav"
              />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={9}
              lg={9}
              className={classes.parkContent}
            >
              {menuItems[0].visible && (
                <div ref={parkOverviewRef} className="full-width">
                  <ParkOverview data={description} type="site" />
                </div>
              )}
              {menuItems[1].visible && (
                <div ref={accessibilityRef} className="full-width">
                  <AccessibilityDetails />
                </div>
              )}
              {menuItems[2].visible && (
                <div ref={advisoryRef} className="full-width">
                  {isLoadingAdvisories && (
                    <div className="mb-5">
                      <Heading>{`Advisories`}</Heading>
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
                    <AdvisoryDetails advisories={advisories} />
                  )}
                </div>
              )}
               {menuItems[3].visible && (
                <div ref={campingRef} className="full-width">
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
                <div ref={facilityRef} className="full-width">
                  <ParkFacility data={nonCampingFacilities} />
                </div>
              )}
              {menuItems[5].visible && (
                <div ref={activityRef} className="full-width">
                  <ParkActivity data={nonCampingActivities} />
                </div>
              )}
              {menuItems[6].visible && (
                <div ref={mapLocationRef} className="full-width">
                  <div id="park-maps-location-container" className="anchor-link">
                    <MapLocation data={mapData} />
                    {locationNotes && (
                      <Grid item xs={12} id="park-location-notes-container">
                        <Box mb={8}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: locationNotes,
                            }}
                          ></div>
                        </Box>
                      </Grid>
                    )}
                  </div>
                </div>
              )}
            </Grid>
          </Grid>
        </Container>
      </div>
      <Footer />
    </div>
  )
}

export const Head = ({data}) => {
  const site = data.strapiSite
  const park = site.protectedArea
  const description = site.description.data.description
  const siteDescription = description.replace(/(<([^>]+)>)/ig, '');
  const siteDescriptionShort = truncate(siteDescription, { length: 160 });

  return (
    <Seo
      title={`${park?.protectedAreaName}: ${site.siteName}`}
      description={siteDescriptionShort}
    />
  )
}

export const query = graphql`
  query SiteDetails($orcsSiteNumber: String) {
    strapiSite(
      isDisplayed: {eq: true}
      orcsSiteNumber: { eq: $orcsSiteNumber }
    ) {
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
      }
      parkActivities {
        isActive
        isActivityOpen
        description {
          data
        }
        activityType {
          activityName
          activityCode
          isActive
          isCamping
          icon
          iconNA
          rank
          defaultDescription {
            data
          }
        }
      }
      parkFacilities {
        isActive
        isFacilityOpen
        description {
          data
        }
        facilityType {
          facilityName
          facilityCode
          isActive
          isCamping
          icon
          iconNA
          rank
          defaultDescription {
            data
          }
        }
      }
      parkOperation {
        hasReservations
        hasDayUsePass
      }
    }
    # Site photos are split into featured and non-featured in order to sort correctly,
    # with null values last.
    featuredPhotos: allStrapiParkPhoto(
      filter: {
        orcsSiteNumber: { eq: $orcsSiteNumber }
        isFeatured: { eq: true }
        isActive: { eq: true }
      }
      sort: {
        order: [ASC, DESC, DESC]
        fields: [sortOrder, dateTaken, strapi_id]
      }
    ) {
      nodes {
        imageUrl
        caption
      }
    }
    regularPhotos: allStrapiParkPhoto(
      filter: {
        orcsSiteNumber: { eq: $orcsSiteNumber }
        isFeatured: { ne: true }
        isActive: { eq: true }
      }
      sort: {
        order: [ASC, DESC, DESC]
        fields: [sortOrder, dateTaken, strapi_id]
      }
    ) {
      nodes {
        imageUrl
        caption
      }
    }
    allStrapiMenu(
      sort: { fields: order, order: ASC }
      filter: { show: { eq: true } }
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
`
