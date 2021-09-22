import React from "react"
import { graphql } from "gatsby"

import { Helmet } from "react-helmet"
import { Container, Grid, Toolbar } from "@material-ui/core"
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
      <Toolbar />
      <Container maxWidth={false}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={3}>
            <ParkMenu />
          </Grid>
          <Grid item xs={12} sm={9}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
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
                <MapLocation data={park.maps} />
              </Grid>
              <Grid item xs={12}>
                <ParkMapDetails data={park.maps} />
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
