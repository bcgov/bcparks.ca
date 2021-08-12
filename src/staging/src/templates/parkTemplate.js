import React from "react"
import { graphql } from "gatsby"

import { Helmet } from "react-helmet"
import { Container, Grid } from "@material-ui/core"
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
import "./parkTemplate.css"

export default function ParkTemplate({ data }) {
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

  return (
    <>
      <Helmet>
        <title>BC Parks | {park.protectedAreaName}</title>
      </Helmet>
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <br />
            <h1>{park.protectedAreaName}</h1>
          </Grid>
          <Grid item xs={12}>
            <ParkHeader data={parkStatusData} />
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
            <MapLocation />
          </Grid>
          <Grid item xs={12}>
            <ParkMap />
          </Grid>
          <Grid item xs={12}>
            <About data={park.parkContact} />
          </Grid>
          <Grid item xs={12}>
            <Reconciliation data={park.reconciliationNotes} />
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
      thumbnail {
        localFile {
          childImageSharp {
            gatsbyImageData(layout: FIXED)
          }
        }
      }
    }
    allStrapiPublicAdvisory(
      filter: { protectedAreas: { elemMatch: { orcs: { eq: $orcs } } } }
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
    allStrapiParkPhoto(filter: { orcs: { eq: $orcs } }) {
      nodes {
        orcs
        caption
        thumbnail {
          localFile {
            childImageSharp {
              gatsbyImageData(layout: CONSTRAINED, width: 800, height: 400)
            }
          }
        }
      }
    }
  }
`
