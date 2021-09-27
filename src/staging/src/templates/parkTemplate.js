import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { Container, Grid, CssBaseline, Hidden } from "@material-ui/core"
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

import "../styles/park-template.scss"

const drawerWidth = 320

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

  const parkStatusData = {
    park: park,
    parkAccessStatus: parkAccessStatus,
    advisories: advisories,
  }

  const mapData = {
    maps: park.maps,
    latitude: park.latitude,
    longitude: park.longitude,
    mapZoom: park.mapZoom,
  }

  return (
    <div className="grey-background">
      <Helmet>
        <title>BC Parks | {park.protectedAreaName}</title>
      </Helmet>
      <Header mode="internal" content={menuContent} />
      <ScrollToTop />
      <CssBaseline />
      <Hidden smUp implementation="css">
        <Grid item xs={12} sm={12}>
          <ParkPhotoGallery photos={photos} />
        </Grid>
      </Hidden>
      <div className="container">
        <Container id="park-info-container" maxWidth={false}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={12}>
              <ParkHeader data={parkStatusData} />
            </Grid>
            <Grid item xs={12} sm={12}>
              <Hidden xsDown implementation="css">
                <ParkPhotoGallery photos={photos} />
              </Hidden>
            </Grid>
            <Grid item xs={12} sm={3} className="park-menu-root">
              <ParkMenu data={parkStatusData} />
            </Grid>
            <Grid item xs={12} sm={9} className={classes.parkContent}>
              <Grid item container spacing={0}>
                <ParkOverview data={park.description} />
                <AccessibilityDetails />
                <AdvisoryDetails data={advisories} />
                <CampingDetails
                  data={{
                    parkFacilities: parkAccessStatus.parkFacilities,
                    reservations: park.reservations,
                  }}
                />
                <ParkFacility data={parkAccessStatus.parkFacilities} />
                <ParkActivity data={parkAccessStatus.parkActivities} />
                <MapLocation data={mapData} />
                <ParkMapDetails data={park.maps} />
                <About data={park.parkContact} />
                <Reconciliation data={park.reconciliationNotes} />
              </Grid>
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
