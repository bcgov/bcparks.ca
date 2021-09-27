import React, { useRef } from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import {
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
import ScrollToTop from "../components/scrollToTop"
import { makeStyles } from "@material-ui/core/styles"
import Header from "../components/header"
import Footer from "../components/footer"
import useScrollSpy from "react-use-scrollspy"

import "../styles/park-template.scss"
import Spacer from "../components/park/spacer"

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

export default function ParkTemplate({ data }) {
  const classes = useStyles()

  const park = data.strapiProtectedArea
  const parkAccessStatus = data.strapiParkAccessStatus
  const advisories = data.allStrapiPublicAdvisory
  const photos = data.allStrapiParkPhoto

  const menuContent = data?.allStrapiMenus?.nodes || []
  const alertsCount = advisories.totalCount

  const hasCamping = parkAccessStatus.parkFacilities.some(facility =>
    facility.facilityName.toLowerCase().includes("camping")
  )

  const parkOverviewRef = useRef("")
  const accessibilityRef = useRef("")
  const advisoryRef = useRef("")
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
      text: `Alerts (${alertsCount})`,
      url: "park-advisory-details-container",
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
      visible: parkAccessStatus.parkFacilities.length > 0,
    },
    {
      text: "Activities",
      url: "park-activity-container",
      visible: parkAccessStatus.parkActivities.length > 0,
    },
    { text: "Maps and Location", url: "park-map-container", visible: true },
    {
      text: "Park and activity maps",
      url: "park-map-details-container",
      visible: park.maps,
    },
    {
      text: "Learn about this park",
      url: "park-about-container",
      visible: park.parkContact,
    },
    {
      text: "Reconciliation with Indigenous peoples",
      url: "park-reconciliation-container",
      visible: park.reconciliationNotes,
    },
  ]

  const parkStatusData = {
    park: park,
    parkAccessStatus: parkAccessStatus,
    advisories: advisories,
    menu: menuItems,
    activeSection: activeSection,
  }

  const mapData = {
    latitude: park.latitude,
    longitude: park.longitude,
    mapZoom: park.mapZoom,
  }

  const breadcrumbs = [
    <Link key="1" href="/">
      Home
    </Link>,
    <Link key="2" href="/park-search">
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
              <div className="d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                <Spacer />
              </div>
              <Breadcrumbs
                separator="›"
                aria-label="breadcrumb"
                className="p20t"
              >
                {breadcrumbs}
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12} sm={12}>
              <ParkHeader data={parkStatusData} />
            </Grid>
            <Grid item xs={12} sm={12}>
              <div className="d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                <ParkPhotoGallery photos={photos} />
              </div>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3} className="park-menu-root">
              <ParkMenu data={parkStatusData} />
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
                    <AdvisoryDetails data={advisories} />
                  </div>
                )}
                {menuItems[3].visible && (
                  <div ref={campingRef} className="full-width">
                    <CampingDetails
                      data={{
                        parkFacilities: parkAccessStatus.parkFacilities,
                        reservations: park.reservations,
                      }}
                    />
                  </div>
                )}
                {menuItems[4].visible && (
                  <div ref={facilityRef} className="full-width">
                    <ParkFacility data={parkAccessStatus.parkFacilities} />
                  </div>
                )}
                {menuItems[5].visible && (
                  <div ref={activityRef} className="full-width">
                    <ParkActivity data={parkAccessStatus.parkActivities} />
                  </div>
                )}
                {menuItems[6].visible && (
                  <div ref={mapRef} className="full-width">
                    <MapLocation data={mapData} />
                  </div>
                )}
                {menuItems[7].visible && (
                  <div ref={activityMapRef} className="full-width">
                    <ParkMapDetails data={park.maps} />
                  </div>
                )}
                {menuItems[8].visible && (
                  <div ref={aboutRef} className="full-width">
                    <About data={park.parkContact} />
                  </div>
                )}
                {menuItems[9].visible && (
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
  query($orcs: Int) {
    strapiParkAccessStatus(orcs: { eq: $orcs }) {
      orcs
      parkActivities {
        activityCode
        activityName
        description
        icon
        iconNA
        rank
      }
      parkFacilities {
        facilityName
        description
        icon
        iconNA
        rank
      }
      accessStatus
      campfireBanEffectiveDate
      hasCampfireBan
      hasCampfiresFacility
      hasSmokingBan
      parkWebsiteUrl
      protectedAreaName
    }
    strapiProtectedArea(orcs: { eq: $orcs }) {
      protectedAreaName
      description
      status
      orcs
      marineArea
      type
      typeCode
      isDayUsePass
      reconciliationNotes
      parkContact
      reservations
      maps
      latitude
      longitude
      mapZoom
      parkActivities {
        activityType
        isActive
        isActivityOpen
        name
      }
      parkFacilities {
        facilityType
        isActive
        isFacilityOpen
        name
      }
    }
    strapiParkPhoto(orcs: { eq: $orcs }) {
      image {
        localFile {
          childImageSharp {
            gatsbyImageData(layout: FULL_WIDTH)
          }
        }
      }
    }
    allStrapiPublicAdvisory(
      filter: { protectedAreas: { elemMatch: { orcs: { eq: $orcs } } } }
      sort: { fields: urgency___sequence, order: DESC }
    ) {
      nodes {
        id
        title
        description
        isAdvisoryDateDisplayed
        isEffectiveDateDisplayed
        isEndDateDisplayed
        isReservationsAffected
        isSafetyRelated
        urgency {
          code
          color
          sequence
          urgency
        }
        protectedAreas {
          orcs
          hasCampfireBan
          hasSmokingBan
        }
        accessStatus {
          color
          accessStatus
          precedence
        }
        advisoryDate(formatString: "MMMM DD, YYYY")
        advisoryNumber
        dcTicketNumber
        effectiveDate(formatString: "MMMM DD, YYYY")
        endDate(formatString: "MMMM DD, YYYY")
        expiryDate(formatString: "MMMM DD, YYYY")
        eventType {
          eventType
          id
        }
      }
      totalCount
    }
    allStrapiParkPhoto(filter: { orcs: { eq: $orcs } }) {
      nodes {
        orcs
        caption
        image {
          localFile {
            childImageSharp {
              gatsbyImageData(layout: FULL_WIDTH)
            }
          }
        }
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
          HTML
        }
      }
    }
    allStrapiMenus(
      sort: {fields: order, order: ASC}
      filter: {show: {eq: true}}
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
  }
`
