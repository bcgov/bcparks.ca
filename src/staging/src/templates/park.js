import React, { useEffect, useState, useRef } from "react"
import axios from "axios"
import { sortBy, truncate } from "lodash"
import { graphql } from "gatsby"
import loadable from '@loadable/component'
import {
  Box,
  Container,
  Grid,
  CssBaseline,
  Link,
  Breadcrumbs,
} from "@material-ui/core"
import useScrollSpy from "react-use-scrollspy"

import { capitalizeFirstLetter, renderHTML, isNullOrWhiteSpace } from "../utils/helpers";

import Footer from "../components/footer"
import Header from "../components/header"
import PageMenu from "../components/pageContent/pageMenu"

import About from "../components/park/about"
import AccessibilityDetails from "../components/park/accessibilityDetails"
import AdvisoryDetails from "../components/park/advisoryDetails"
import CampingDetails from "../components/park/campingDetails"
import Reconciliation from "../components/park/reconciliation"
import Heading from "../components/park/heading.js"
import ParkActivity from "../components/park/parkActivity"
import ParkDates from "../components/park/parkDates"
import ParkFacility from "../components/park/parkFacility"
import ParkHeader from "../components/park/parkHeader"
import ParkMapDetails from "../components/park/parkMapDetails"
import ParkOverview from "../components/park/parkOverview"
import ParkPhotoGallery from "../components/park/parkPhotoGallery"
import SafetyInfo from "../components/park/safetyInfo"
import SpecialNote from "../components/park/specialNote"
import ScrollToTop from "../components/scrollToTop"
import Seo from "../components/seo"

import "../styles/parks.scss"
import { PARK_NAME_TYPE, useStyles } from "../utils/constants";

const qs = require('qs')
const AsyncMapLocation =  loadable(() => import("../components/park/mapLocation"));

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

export default function ParkTemplate({ data }) {
  const classes = useStyles()

  const apiBaseUrl = `${data.site.siteMetadata.apiURL}/api`

  const park = data.strapiProtectedArea
  const parkType = park.type ?? "park"
  const operations = park.parkOperation || {}
  const photos = [...data.featuredPhotos.nodes, ...data.regularPhotos.nodes]

  const description = park.description.data.description
  const safetyInfo = park.safetyInfo.data.safetyInfo
  const specialNotes = park.specialNotes.data.specialNotes
  const locationNotes = park.locationNotes.data.locationNotes
  const reconciliationNotes = park.reconciliationNotes.data.reconciliationNotes
  const maps = park.maps.data.maps

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
    loadAdvisories(apiBaseUrl, park.orcs)
      .then(response => {
        if (response.status === 200) {
          setAdvisories(response.data.data)
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
  const parkDatesRef = useRef("")
  const safetyRef = useRef("")
  const specialRef = useRef("")
  const campingRef = useRef("")
  const facilityRef = useRef("")
  const activityRef = useRef("")
  const mapLocationRef = useRef("")
  const activityMapRef = useRef("")
  const aboutRef = useRef("")
  const reconciliationRef = useRef("")

  const sectionRefs = [
    parkOverviewRef,
    accessibilityRef,
    advisoryRef,
    parkDatesRef,
    safetyRef,
    specialRef,
    campingRef,
    facilityRef,
    activityRef,
    mapLocationRef,
    activityMapRef,
    aboutRef,
    reconciliationRef,
  ]

  const activeSection = useScrollSpy({
    sectionElementRefs: sectionRefs,
    defaultValue: 0,
    offsetPx: -100,
  })

  const menuItems = [
    {
      sectionIndex: 0,
      display: capitalizeFirstLetter(`${parkType} overview`),
      link: "#park-overview-container",
      visible: !isNullOrWhiteSpace(description),
    },
    {
      sectionIndex: 1,
      display: "Accessibility",
      link: "#accessibility-details-container",
      visible: park.accessibility,
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
      display: "Dates of operation",
      link: "#park-dates-container",
      visible: park.parkOperation,
    },
    {
      sectionIndex: 4,
      display: "Safety info",
      link: "#park-safety-info-container",
      visible: !isNullOrWhiteSpace(safetyInfo),
    },
    {
      sectionIndex: 5,
      display: "Special notes",
      link: "#park-special-notes-container",
      visible: !isNullOrWhiteSpace(specialNotes),
    },
    {
      sectionIndex: 6,
      display: "Camping",
      link: "#park-camping-details-container",
      visible: activeCampings.length > 0,
    },
    {
      sectionIndex: 7,
      display: "Facilities",
      link: "#park-facility-container",
      visible: nonCampingFacilities.length > 0,
    },
    {
      sectionIndex: 8,
      display: "Activities",
      link: "#park-activity-container",
      visible: nonCampingActivities.length > 0,
    },
    {
      sectionIndex: 9,
      display: "Location",
      link: "#park-maps-location-container",
      visible: (park.latitude && park.longitude) || !isNullOrWhiteSpace(locationNotes),
    },
    {
      sectionIndex: 10,
      display: capitalizeFirstLetter(`${parkType} and activity maps`),
      link: "#park-map-details-container",
      visible: !isNullOrWhiteSpace(maps),
    },
    {
      sectionIndex: 11,
      display: capitalizeFirstLetter(`Learn about this ${parkType}`),
      link: "#park-about-container",
      visible:
        park.totalArea ||
        park.establishedDate ||
        !isNullOrWhiteSpace(park.parkContact.data.parkContact) ||
        !isNullOrWhiteSpace(park.natureAndCulture.data.natureAndCulture),
    },
    {
      sectionIndex: 12,
      display: "Reconciliation with Indigenous Peoples",
      link: "#park-reconciliation-container",
      visible: !isNullOrWhiteSpace(reconciliationNotes),
    },
  ]

  const mapData = {
    latitude: park.latitude,
    longitude: park.longitude,
    mapZoom: park.mapZoom,
    parkOrcs: park.orcs
  }

  const parkName = renderHTML(park.parkNames.find(item=> item.parkNameType === PARK_NAME_TYPE.Escaped)?.parkName  || park.protectedAreaName);
  
  const breadcrumbs = [
    <Link key="1" href="/">
      Home
    </Link>,
    <Link key="2" href="/find-a-park">
      Find a park
    </Link>,
    <div key="3" className="breadcrumb-text">
      {parkName}
    </div>,
  ]

  return (
    <div className="grey-background">
      <Header mode="internal" content={menuContent} />
      <ScrollToTop />
      <CssBaseline />
      <div className="d-flex flex-wrap d-md-block">
        <div className="container parks-container order-2">
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
                  parkName={parkName}
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

        <div className="page-menu--mobile w-100 order-3 d-block d-lg-none">
            <PageMenu
              pageSections={menuItems}
              activeSection={activeSection}
              menuStyle="select"
            />
        </div>
        
        <div className="container parks-container gallery-container order-1">
          <Container className="park-info-container" maxWidth={false}>
            <Grid item xs={12} sm={12}>
              <ParkPhotoGallery photos={photos} />
            </Grid>
          </Container>
        </div>
      </div>

      <div className="container parks-container">
        <Container className="park-info-container" maxWidth={false}>
          <Grid container spacing={2}>
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
                  <ParkOverview data={description} type={parkType} />
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
                <div ref={parkDatesRef} className="full-width">
                  <ParkDates
                    data={{
                      parkOperation: park.parkOperation,
                      subAreas: park.parkOperationSubAreas,
                      advisories: advisories,
                    }}
                  />
                </div>
              )}
              {menuItems[4].visible && (
                <div ref={safetyRef} className="full-width">
                  <SafetyInfo safetyInfo={safetyInfo} />
                </div>
              )}
              {menuItems[5].visible && (
                <div ref={specialRef} className="full-width">
                  <SpecialNote specialNotes={specialNotes} />
                </div>
              )}
              {menuItems[6].visible && (
                <div ref={campingRef} className="full-width">
                  <CampingDetails
                    data={{
                      activeCampings: activeCampings,
                      reservations: park.reservations,
                      hasDayUsePass: hasDayUsePass,
                      hasReservations: hasReservations,
                      parkOperation: park.parkOperation,
                      subAreas: park.parkOperationSubAreas,
                    }}
                  />
                </div>
              )}
              {menuItems[7].visible && (
                <div ref={facilityRef} className="full-width">
                  <ParkFacility data={nonCampingFacilities} />
                </div>
              )}
              {menuItems[8].visible && (
                <div ref={activityRef} className="full-width">
                  <ParkActivity data={nonCampingActivities} />
                </div>
              )}
              {menuItems[9].visible && (
                <div ref={mapLocationRef} className="full-width">
                  <div id="park-maps-location-container" className="anchor-link">
                    <AsyncMapLocation data={mapData} />
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
              {menuItems[10].visible && (
                <div ref={activityMapRef} className="full-width">
                  <ParkMapDetails data={maps} type={parkType} />
                </div>
              )}
              {menuItems[11].visible && (
                <div ref={aboutRef} className="full-width">
                  <About park={park} />
                </div>
              )}
              {menuItems[12].visible && (
                <div ref={reconciliationRef} className="full-width">
                  <Reconciliation data={reconciliationNotes} />
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
  const park = data.strapiProtectedArea
  const seo = park.seo
  const description = park.description.data.description
  const parkDescription = description.replace(/(<([^>]+)>)/ig, '');
  const parkDescriptionShort = truncate(parkDescription, { length: 160 });

  return (
    <Seo
      title={seo?.metaTitle || park.protectedAreaName}
      description={seo?.metaDescription || parkDescriptionShort}
      keywords={seo?.metaKeywords}
    />
  )
}

export const query = graphql`
  query ProtectedAreaDetails($orcs: Int) {
    strapiProtectedArea(orcs: { eq: $orcs }) {
      protectedAreaName
      description {
        data {
          description
        }
      }
      status
      orcs
      marineArea
      type
      typeCode
      locationNotes {
        data {
          locationNotes
        }
      }
      reconciliationNotes {
        data {
          reconciliationNotes
        }
      }
      safetyInfo {
        data {
          safetyInfo
        }
      }
      specialNotes {
        data {
          specialNotes
        }
      }
      parkContact {
        data {
          parkContact
        }
      }
      natureAndCulture {
        data {
          natureAndCulture
        }
      }
      reservations {
        data {
          reservations
        }
      }
      maps {
        data {
          maps
        }
      }
      latitude
      longitude
      mapZoom
      totalArea
      establishedDate
      seo {
        metaDescription
        metaKeywords
        metaTitle
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
      parkNames {
        id
        parkName
        parkNameType {
          id
          nameType
          nameTypeId
          description
        }
      }
      parkOperation {
        openDate
        closeDate
        isActive
        hasReservations
        hasBackcountryReservations
        hasBackcountryPermits
        hasDayUsePass
        hasFirstComeFirstServed
        reservationUrl
        backcountryPermitUrl
        dayUsePassUrl
        hasParkGate
        offSeasonUse
        totalCapacity
        frontcountrySites
        reservableSites
        nonReservableSites
        vehicleSites
        vehicleSitesReservable
        doubleSites
        pullThroughSites
        rvSites
        rvSitesReservable
        electrifiedSites
        longStaySites
        walkInSites
        walkInSitesReservable
        groupSites
        groupSitesReservable
        backcountrySites
        wildernessSites
        boatAccessSites
        horseSites
        cabins
        huts
        yurts
        shelters
        boatLaunches
        openNote
        serviceNote
        reservationsNote
        offSeasonNote
        generalNote
        adminNote
      }
      parkOperationSubAreas {
        parkSubArea
        orcsSiteNumber
        isActive
        isOpen
        hasReservations
        hasBackcountryReservations
        hasBackcountryPermits
        hasFirstComeFirstServed
        parkAccessUnitId
        isCleanAirSite
        totalCapacity
        frontcountrySites
        reservableSites
        nonReservableSites
        vehicleSites
        vehicleSitesReservable
        doubleSites
        pullThroughSites
        rvSites
        rvSitesReservable
        electrifiedSites
        longStaySites
        walkInSites
        walkInSitesReservable
        groupSites
        groupSitesReservable
        backcountrySites
        wildernessSites
        boatAccessSites
        horseSites
        cabins
        huts
        yurts
        shelters
        boatLaunches
        openNote
        serviceNote
        reservationNote
        offSeasonNote
        adminNote
        parkOperationSubAreaDates {
          isActive
          operatingYear
          openDate
          closeDate
          serviceStartDate
          serviceEndDate
          reservationStartDate
          reservationEndDate
          offSeasonStartDate
          offSeasonEndDate
        }
        parkSubAreaType {
          isActive
          subAreaType
          subAreaTypeCode
          iconUrl
        }
        facilityType {
          facilityName
          facilityNumber
          isActive
          icon
          rank
          isCamping
        }
      }
      
    }
    # Park photos are split into featured and non-featured in order to sort correctly,
    # with null values last.
    featuredPhotos: allStrapiParkPhoto(
      filter: {
        orcs: { eq: $orcs }
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
        orcs: { eq: $orcs }
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
