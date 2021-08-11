import React from "react"
import { graphql } from "gatsby"

import { Helmet } from "react-helmet"
import { Container, Grid, Typography } from "@material-ui/core"
import ParkOverview from "../components/park/parkOverview"
import Accessibility from "../components/park/accessibility"
import Advisory from "../components/park/advisory"
import About from "../components/park/about"
import Reconciliation from "../components/park/reconciliation"
import ParkHeader from "../components/park/parkHeader"
import ParkActivity from "../components/park/parkActivity"
import ParkFacility from "../components/park/parkFacility"
import ParkMap from "../components/park/parkMap"
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
            <Typography variant="h3">{park.protectedAreaName}</Typography>
          </Grid>
          <Grid item xs={12}>
            <ParkHeader data={parkStatusData} />
          </Grid>
          <Grid item xs={12}>
            <ParkOverview data={parkOverviewData} />
          </Grid>
          <Grid item xs={12}>
            <Accessibility data={park.description} />
          </Grid>
          <Grid item xs={12}>
            <Advisory data={advisories} />
          </Grid>
          <Grid item xs={12}>
            <ParkFacility data={parkAccessStatus.parkFacilities} />
          </Grid>
          <Grid item xs={12}>
            <ParkActivity data={parkAccessStatus.parkActivities} />
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
        icon
        iconNA
        rank
      }
      parkFacilities {
        facilityName
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
            fixed(height: 640, width: 1120) {
              ...GatsbyImageSharpFixed
            }
          }
        }
      }
    }
    allStrapiPublicAdvisory(
      filter: { protectedAreas: { elemMatch: { orcs: { eq: $orcs } } } }
    ) {
      nodes {
        advisoryDate
        advisoryNumber
        title
        urgency {
          code
          sequence
          urgency
        }
        eventType {
          eventType
        }
        description
      }
    }
    allStrapiParkPhoto(filter: { orcs: { eq: $orcs } }) {
      nodes {
        orcs
        caption
        thumbnail {
          localFile {
            childImageSharp {
              fluid {
                ...GatsbyImageSharpFluid
              }
            }
          }
        }
      }
    }
  }
`
