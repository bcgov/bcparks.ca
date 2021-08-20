import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { Container, Grid, Toolbar, CssBaseline } from "@material-ui/core"
import ParkOverview from "../components/park/parkOverview"
import AccessibilityDetails from "../components/park/accessibilityDetails"
import AdvisoryDetails from "../components/park/advisoryDetails"
import About from "../components/park/about"
import CampingDetails from "../components/park/campingDetails"
import Reconciliation from "../components/park/reconciliation"
import ParkHeader from "../components/park/parkHeader"
import ParkStatus from "../components/park/parkStatus"
import ParkActivity from "../components/park/parkActivity"
import ParkFacility from "../components/park/parkFacility"
import ParkMap from "../components/park/parkMapDetails"
import MapLocation from "../components/park/mapLocation"
import ParkMenu from "../components/park/parkMenu"
import ScrollToTop from "../components/scrollToTop"
import { makeStyles } from "@material-ui/core/styles"

import "./parkTemplate.css"

const drawerWidth = 320

const useStyles = makeStyles(theme => ({
  root: {
    display: "flex",
  },
  appBar: {
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

  const parkOverviewData = {
    description: park.description,
    photos: photos,
  }

  const bannerPhoto =
    photos.nodes[Math.floor(Math.random() * photos.nodes.length)]

  return (
    <>
      <Helmet>
        <title>BC Parks | {park.protectedAreaName}</title>
      </Helmet>
      <Toolbar />
      <ScrollToTop />
      <ParkHeader
        data={{
          protectedAreaName: park.protectedAreaName,
          photo: bannerPhoto,
        }}
      />

      <CssBaseline />
      <Container id="park-info-container" maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <ParkMenu data={parkStatusData} />
          </Grid>
          <Grid item xs={12} sm={9} className={classes.appBar}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <ParkStatus data={parkStatusData} />
              </Grid>
              <Grid item xs={12}>
                <ParkOverview data={parkOverviewData} />
              </Grid>
              <Grid item xs={12}>
                <AccessibilityDetails />
              </Grid>
              <Grid item xs={12}>
                <AdvisoryDetails data={advisories} />
              </Grid>
              <Grid item xs={12}>
                <CampingDetails
                  data={{
                    parkFacilities: parkAccessStatus.parkFacilities,
                    reservations: park.reservations,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <ParkFacility data={parkAccessStatus.parkFacilities} />
              </Grid>
              <Grid item xs={12}>
                <ParkActivity data={parkAccessStatus.parkActivities} />
              </Grid>
              <Grid item xs={12}>
                <MapLocation data={park.maps} />
              </Grid>
              <Grid item xs={12}>
                <ParkMap data={park.maps} />
              </Grid>
              <Grid item xs={12}>
                <About data={park.parkContact} />
              </Grid>
              <Grid item xs={12}>
                <Reconciliation data={park.reconciliationNotes} />
              </Grid>
            </Grid>
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
  }
`
