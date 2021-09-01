import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { Container, Grid, CssBaseline, Toolbar } from "@material-ui/core"
import ParkOverview from "../components/park/parkOverview"
import AccessibilityDetails from "../components/park/accessibilityDetails"
import AdvisoryDetails from "../components/park/advisoryDetails"
import About from "../components/park/about"
import CampingDetails from "../components/park/campingDetails"
import Reconciliation from "../components/park/reconciliation"
import ParkHeader from "../components/park/parkHeader"
import ParkActivity from "../components/park/parkActivity"
import ParkFacility from "../components/park/parkFacility"
import ParkMap from "../components/park/parkMapDetails"
import MapLocation from "../components/park/mapLocation"
import ParkMenu from "../components/park/parkMenu"
import ParkPhotoGallery from "../components/park/parkPhotoGallery"
import ScrollToTop from "../components/scrollToTop"
import { makeStyles } from "@material-ui/core/styles"
import Header from "../components/header"

import "./parkTemplate.css"

const drawerWidth = 320

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  parkContent: {
    [theme.breakpoints.up("sm")]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth,
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

  const parkStatusData = {
    park: park,
    parkAccessStatus: parkAccessStatus,
    advisories: advisories,
  }

  return (
    <>
      <Helmet>
        <title>BC Parks | {park.protectedAreaName}</title>
      </Helmet>
      <ScrollToTop />
      <CssBaseline />
      <Header>{data.strapiWebsites.Header}</Header>
      <Toolbar />
      <Container id="park-info-container" maxWidth={false}>
        <Grid container spacing={2}>
          <ParkHeader data={parkStatusData} />
          <ParkPhotoGallery photos={photos} />
          <Grid item xs={12} sm={3}>
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
              <MapLocation data={park.maps} />
              <ParkMap data={park.maps} />
              <About data={park.parkContact} />
              <Reconciliation data={park.reconciliationNotes} />
            </Grid>
            <br />
          </Grid>
        </Grid>
      </Container>
    </>
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
      }
      totalCount
    }
    allStrapiParkPhoto(filter: { orcs: { eq: $orcs } }, limit: 5) {
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
  }
`
