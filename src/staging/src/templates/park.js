import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
import { sortBy } from "lodash"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import {
  Box,
  Container,
  Grid,
  CssBaseline,
  Link,
  Breadcrumbs,
} from "@material-ui/core"
import ParkOverview from "../components/park/parkOverview"
import AccessibilityDetails from "../components/park/accessibilityDetails"
import AdvisoryDetails from "../components/park/advisoryDetails"
import About from "../components/park/about"
import CampingDetails from "../components/park/campingDetails"
import Reconciliation from "../components/park/reconciliation"
import ParkHeader from "../components/park/parkHeader"
import ParkActivity from "../components/park/parkActivity"
import ParkFacility from "../components/park/parkFacility"
import ParkMapDetails from "../components/park/parkMapDetails"
import MapLocation from "../components/park/mapLocation"
import ParkMenu from "../components/park/parkMenu"
import ParkPhotoGallery from "../components/park/parkPhotoGallery"
import SafetyInfo from "../components/park/safetyInfo"
import ScrollToTop from "../components/scrollToTop"
import { makeStyles } from "@material-ui/core/styles"
import Header from "../components/header"
import Footer from "../components/footer"
import useScrollSpy from "react-use-scrollspy"

import "../styles/parks.scss"

const drawerWidth = 230

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  parkContent: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
  },
  appBarOffset: theme.mixins.toolbar,
}))

const loadAdvisories = async (apiBaseUrl, orcs) => {
  const params = {
    "protectedAreas.orcs_in": orcs,
    _limit: 100,
    _sort: "urgency.sequence:DESC",
  }

  return axios.get(`${apiBaseUrl}/public-advisories`, { params })
}

export default function ParkTemplate({ data }) {
  const classes = useStyles()

  const apiBaseUrl = data.site.siteMetadata.apiURL

  const park = data.strapiProtectedArea
  const photos = data.allStrapiParkPhoto.nodes
  const operations = data.allStrapiParkOperation.nodes

  const activeActivities = sortBy(
    park.parkActivities.filter(
      activity => activity.isActive && activity.activityType.isActive
    ),
    ["activityType.rank", "activityType.activityName"],
    ["asc"]
  )
  const activeFacilities = sortBy(
    park.parkFacilities.filter(
      facility => facility.isActive && facility.facilityType.isActive
    ),
    ["facilityType.rank", "facilityType.facilityName"],
    ["asc"]
  )

  const hasReservations = operations.some(op => op.hasReservations)
  const hasCamping = activeFacilities.some(facility =>
    facility.facilityType.facilityName.toLowerCase().includes("camping")
  )

  const menuContent = data?.allStrapiMenus?.nodes || []

  const [advisoryLoadError, setAdvisoryLoadError] = useState(false)
  const [isLoadingAdvisories, setIsLoadingAdvisories] = useState(true)
  const [advisories, setAdvisories] = useState([])

  useEffect(() => {
    setIsLoadingAdvisories(true)

    loadAdvisories(apiBaseUrl, park.orcs)
      .then(response => {
        if (response.status === 200) {
          setAdvisories([...response.data])
          setAdvisoryLoadError(false)
        } else {
          setAdvisories([])
          setAdvisoryLoadError(true)
        }
      })
      .finally(() => {
        setIsLoadingAdvisories(false)
      })
  }, [apiBaseUrl, park.orcs])

  const parkOverviewRef = useRef("")
  const accessibilityRef = useRef("")
  const advisoryRef = useRef("")
  const safetyRef = useRef("")
  const campingRef = useRef("")
  const facilityRef = useRef("")
  const activityRef = useRef("")
  const mapRef = useRef("")
  const activityMapRef = useRef("")
  const aboutRef = useRef("")
  const reconciliationRef = useRef("")

  const sectionRefs = [
    parkOverviewRef,
    accessibilityRef,
    advisoryRef,
    campingRef,
    facilityRef,
    activityRef,
    mapRef,
    activityMapRef,
    aboutRef,
    reconciliationRef,
  ]

  const activeSection = useScrollSpy({
    sectionElementRefs: sectionRefs,
    defaultValue: 0,
    offsetPx: -80,
  })

  const menuItems = [
    { text: "Park overview", url: "park-overview-container", visible: true },
    {
      text: "Accessibility",
      url: "accessibility-details-container",
      visible: park.accessibility,
    },
    {
      text:
        !isLoadingAdvisories && !advisoryLoadError
          ? `Advisories (${advisories.length})`
          : "Advisories",
      url: "park-advisory-details-container",
      visible: true,
    },
    {
      text: "Safety info",
      url: "park-safety-info-container",
      visible: true,
    },
    {
      text: "Camping",
      url: "park-camping-details-container",
      visible: hasCamping,
    },
    {
      text: "Facilities",
      url: "park-facility-container",
      visible: activeFacilities.length > 0,
    },
    {
      text: "Activities",
      url: "park-activity-container",
      visible: activeActivities.length > 0,
    },
    { text: "Location", url: "park-map-container", visible: true },
    {
      text: "Park and activity maps",
      url: "park-map-details-container",
      visible: park.maps,
    },
    {
      text: "Learn about this park",
      url: "park-about-container",
      visible: true,
    },
    {
      text: "Reconciliation with Indigenous peoples",
      url: "park-reconciliation-container",
      visible: park.reconciliationNotes,
    },
  ]

  const mapData = {
    latitude: park.latitude,
    longitude: park.longitude,
    mapZoom: park.mapZoom,
  }

  const breadcrumbs = [
    <Link key="1" href="/">
      Home
    </Link>,
    <Link key="2" href="/explore">
      Find a Park
    </Link>,
    <div key="3" className="breadcrumb-text">
      {park.protectedAreaName}
    </div>,
  ]

  return (
    <div className="grey-background">
      <Helmet>
        <title>BC Parks | {park.protectedAreaName}</title>
      </Helmet>
      <Header mode="internal" content={menuContent} />
      <ScrollToTop />
      <CssBaseline />

      <div className="d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
        <Grid item xs={12} sm={12}>
          <ParkPhotoGallery photos={photos} />
        </Grid>
      </div>
      <div className="container parks-container">
        <Container id="park-info-container" maxWidth={false}>
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
                park={park}
                menu={menuItems}
                hasReservations={hasReservations}
                isLoadingAdvisories={isLoadingAdvisories}
                advisoryLoadError={advisoryLoadError}
                advisories={advisories}
              />
            </Grid>
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
              className="park-menu-root d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none"
            >
              <ParkMenu data={{ menu: menuItems, activeSection }} />
            </Grid>
            <Grid
              item
              xs={12}
              sm={12}
              md={9}
              lg={9}
              className={classes.parkContent}
              data-spy="scroll"
              data-target="#parkScrollSpy"
              data-offset="20"
            >
              <Grid container spacing={0}>
                {menuItems[0].visible && (
                  <div ref={parkOverviewRef} className="full-width">
                    <ParkOverview data={park.description} />
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
                  <div ref={safetyRef} className="full-width">
                    <SafetyInfo park={park} />
                  </div>
                )}
                {menuItems[4].visible && (
                  <div ref={campingRef} className="full-width">
                    <CampingDetails
                      data={{
                        parkFacilities: activeFacilities,
                        reservations: park.reservations,
                        hasDayUsePass: park.hasDayUsePass,
                        hasReservations: hasReservations,
                      }}
                    />
                  </div>
                )}
                {menuItems[5].visible && (
                  <div ref={facilityRef} className="full-width">
                    <ParkFacility data={activeFacilities} />
                  </div>
                )}
                {menuItems[6].visible && (
                  <div ref={activityRef} className="full-width">
                    <ParkActivity data={activeActivities} />
                  </div>
                )}
                {menuItems[7].visible && (
                  <div ref={mapRef} className="full-width">
                    <MapLocation data={mapData} />
                    {park.locationNotes && (
                      <Grid item xs={12} id="park-location-notes-container">
                        <Box mb={8}>
                          <div
                            dangerouslySetInnerHTML={{
                              __html: park.locationNotes,
                            }}
                          ></div>
                        </Box>
                      </Grid>
                    )}
                  </div>
                )}
                {menuItems[8].visible && (
                  <div ref={activityMapRef} className="full-width">
                    <ParkMapDetails data={park.maps} />
                  </div>
                )}
                {menuItems[9].visible && (
                  <div ref={aboutRef} className="full-width">
                    <About park={park} />
                  </div>
                )}
                {menuItems[10].visible && (
                  <div ref={reconciliationRef} className="full-width">
                    <Reconciliation data={park.reconciliationNotes} />
                  </div>
                )}
              </Grid>
              <br />
              <br />
              <br />
            </Grid>
          </Grid>
        </Container>
      </div>
      <Footer>{data.strapiWebsites.Footer}</Footer>
    </div>
  )
}

export const query = graphql`
  query ProtectedAreaDetails($orcs: Int) {
    strapiProtectedArea(orcs: { eq: $orcs }) {
      protectedAreaName
      description
      status
      orcs
      marineArea
      type
      typeCode
      hasDayUsePass
      locationNotes
      reconciliationNotes
      safetyInfo
      specialNotes
      parkContact
      natureAndCulture
      reservations
      maps
      latitude
      longitude
      mapZoom
      totalArea
      establishedDate
      parkActivities {
        isActive
        isActivityOpen
        description
        activityType {
          activityName
          activityCode
          isActive
          icon
          iconNA
          rank
        }
      }
      parkFacilities {
        isActive
        isFacilityOpen
        description
        facilityType {
          facilityName
          facilityCode
          isActive
          icon
          iconNA
          rank
        }
      }
    }
    allStrapiParkOperation(
      filter: { orcs: { eq: $orcs }, isActive: { eq: true } }
    ) {
      nodes {
        orcs
        isActive
        hasReservations
      }
    }
    allStrapiParkPhoto(
      filter: { orcs: { eq: $orcs }, isActive: { eq: true } }
    ) {
      nodes {
        orcs
        isActive
        imageUrl
        caption
      }
    }
    strapiWebsites(Name: { eq: "BCParks.ca" }) {
      Footer
      Header
      Name
      Navigation
      id
      homepage {
        id
        Template
        Content {
          id
          strapi_component
        }
      }
    }
    allStrapiMenus(
      sort: { fields: order, order: ASC }
      filter: { show: { eq: true } }
    ) {
      nodes {
        strapiId
        title
        url
        order
        id
        strapiChildren {
          id
          title
          url
          order
          parent
        }
        strapiParent {
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
