import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { graphql, Link as GatsbyLink } from "gatsby"
import axios from "axios"
import { orderBy } from "lodash"
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Chip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Link,
  LinearProgress,
  Breadcrumbs,
  Button,
} from "@mui/material"
import Pagination from "@mui/material/Pagination"
import SearchIcon from "@mui/icons-material/Search"
import CancelIcon from "@mui/icons-material/Cancel"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Carousel from "react-material-ui-carousel"
import { scrollIntoView } from "seamless-scroll-polyfill";

import Footer from "../components/footer"
import Header from "../components/header"
import Seo from "../components/seo"
import ParkAccessStatus from "../components/park/parkAccessStatus"
import NoSearchResults from "../components/search/noSearchResults"
import SearchFilter from "../components/search/searchFilter"
import ParkLinksModal from "../components/search/parkLinksModal"

import parksLogo from "../images/Mask_Group_5.png"
import campingIcon from "../../static/icons/vehicle-accessible-camping.svg"
import backcountryCampingIcon from "../../static/icons/wilderness-camping.svg"
import hikingIcon from "../../static/icons/hiking.svg"
import picincIcon from "../../static/icons/picnic-areas.svg"
import swimmingIcon from "../../static/icons/swimming.svg"
import cyclingIcon from "../../static/icons/cycling.svg"
import petsIcon from "../../static/icons/pets-on-leash.svg"
import campfireBanIcon from "../../static/icons/campfire-ban.svg"

import "../styles/search.scss"
import { addSmallImagePrefix, handleImgError } from "../utils/helpers";

export const query = graphql`
  {
    site {
      siteMetadata {
        apiURL
      }
    }
    allStrapiRegion {
      nodes {
        regionName
        regionNumber
      }
    }
    allStrapiActivityType(
      filter: {isActive: {eq: true}}
    ) {
      totalCount
      nodes {
        activityName
        activityCode
        activityNumber
      }
    }
    allStrapiFacilityType(
      sort: {facilityName: ASC},
      filter: {isActive: {eq: true}}
    ) {
      totalCount
      nodes {
        facilityName
        facilityCode
        facilityNumber
        isCamping
      }
    }
    allStrapiMenu(
      sort: {order: ASC},
      filter: {show: {eq: true}}
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
  }
`

const Icon = ({ src, label, size }) => {
  return (
    <img src={src}
      alt={label}
      aria-label={label}
      className="mr-1 mb-1"
      width={size}
      height={size}>
    </img>
  )
}

const FeatureIcons = ({ park }) => {
  const iconSize = 32;
  const facilities = park.parkFacilities.filter(f => [1, 6, 36].includes(f.num)) || [];
  const activities = park.parkActivities.filter(a => [1, 3, 8, 9].includes(a.num)) || [];

  return (
    <>
      {facilities.some(x => x.code === 'vehicle-accessible-camping') &&
        <Icon src={campingIcon} label="Vehicle accesible camping" size={iconSize} />
      }
      {facilities.some(x => x.code === 'backcountry-camping') &&
        <Icon src={backcountryCampingIcon} label="Backcountry camping" size={iconSize} />
      }
      {activities.some(x => x.code === 'hiking') &&
        <Icon src={hikingIcon} label="Hiking" size={iconSize} />
      }
      {facilities.some(x => x.code === 'picnic-areas') &&
        <Icon src={picincIcon} label="Picnic areas" size={iconSize} />
      }
      {activities.some(x => x.code === 'swimming') &&
        <Icon src={swimmingIcon} label="Swimming" size={iconSize} />
      }
      {activities.some(x => x.code === 'cycling') &&
        <Icon src={cyclingIcon} label="Cycling" size={iconSize} />
      }
      {activities.some(x => x.code === 'pets-on-leash') &&
        <Icon src={petsIcon} label="Pets on leash" size={iconSize} />
      }
      {facilities.some(x => [1, 36].includes(x.num)) ? (
        <GatsbyLink href={`/${park.slug}/#park-camping-details-container`}>
          <p aria-label="See all facilities and activities">see all</p>
        </GatsbyLink>
      ) : (
        (activities.length > 0 || facilities.length > 0) && (
          facilities.some(x => x.code === 'picnic-areas') ? (
            <GatsbyLink href={`/${park.slug}/#park-facility-container`}>
              <p aria-label="See all facilities and activities">see all</p>
            </GatsbyLink>
          ) : (
            <GatsbyLink to={`/${park.slug}/#park-activity-container`}>
              <p aria-label="See all facilities and activities">see all</p>
            </GatsbyLink>
          )
        )
      )}
    </>
  );
}

export default function FindAPark({ location, data }) {
  const menuContent = data?.allStrapiMenu?.nodes || []
  const regions = data?.allStrapiRegion?.nodes || []

  const sortedActivityItems = orderBy(
    data.allStrapiActivityType.nodes,
    [activity => activity.activityName.toLowerCase()], ["asc"]
  )
  const activityItems = sortedActivityItems.map(activity => {
    return {
      label: activity.activityName,
      value: activity.activityNumber,
    }
  })
  const activityItemsLabels = {}
  activityItems.forEach(item => {
    activityItemsLabels[item.value] = item.label
  })

  const truncatedFilterLength = 5

  const [filteredActivities, setFilteredActivities] = useState(
    activityItems.slice(0, truncatedFilterLength)
  )

  const [showActivities, setActivityVisibility] = useState(true)

  const [showMoreActivities, setMoreActivites] = useState(true)

  const regionItems = regions.map(region => {
    // value can be changed based on how filter works
    return {
      label: region.regionName,
      value: region.regionNumber
    }
  })

  const campingFacilityItems = data.allStrapiFacilityType.nodes
    .filter(facility => facility.isCamping).map(facility => {
      return {
        label: facility.facilityName,
        value: facility.strapi_id,
      }
    })

  const facilityItems = data.allStrapiFacilityType.nodes
    .filter(facility => !facility.isCamping).map(facility => {
      return {
        label: facility.facilityName,
        value: facility.strapi_id,
      }
    })

  const facilityItemsLabels = {}
  facilityItems.forEach(item => {
    facilityItemsLabels[item.value] = item.label
  })

  const [filteredFacilities, setFilteredFacilities] = useState(
    facilityItems.slice(0, truncatedFilterLength)
  )

  const [showFacilities, setFacilityVisibility] = useState(true)

  const [showMoreFacilities, setMoreFacilities] = useState(true)

  const [quickSearch, setQuickSearch] = useState({
    backcountryCamping: false,
    cycling: false,
    hiking: false,
    petsOnLeash: false,
    picnicAreas: false,
    swimming: false,
    vehicleAccessibleCamping: false,
  })

  const quickSearchFilters = [
    { label: "Backcountry camping", type: "backcountryCamping" },
    { label: "Cycling", type: "cycling" },
    { label: "Hiking", type: "hiking" },
    { label: "Pets on leash", type: "petsOnLeash" },
    { label: "Picnic areas", type: "picnicAreas" },
    { label: "Swimming", type: "swimming" },
    { label: "Vehicle-accessible camping", type: "vehicleAccessibleCamping" },
  ]

  const [selectedRegions, setSelectedRegions] = useState(
    location.state && location.state.selectedRegions
      ? [...location.state.selectedRegions]
      : []
  )
  const [selectedCampingFacilities, setSelectedCampingFacilities] = useState(
    location.state && location.state.selectedCampingFacilities
      ? [...location.state.selectedCampingFacilities]
      : []
  )
  const [selectedActivities, setSelectedActivities] = useState(
    location.state && location.state.selectedActivities
      ? [...location.state.selectedActivities]
      : []
  )
  const [selectedFacilities, setSelectedFacilities] = useState(
    location.state && location.state.selectedFacilities
      ? [...location.state.selectedFacilities]
      : []
  )
  const [inputText, setInputText] = useState(
    location.state && location.state.searchText ? location.state.searchText : ""
  )
  const [searchText, setSearchText] = useState(
    location.state && location.state.searchText ? location.state.searchText : ""
  )

  const [filterSelections, setFilterSelections] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [numberOfPages, setNumberOfPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)

  const itemsPerPage = 10
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const [openFilter, setOpenFilter] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  
  const [activitiesCount, setActivitiesCount] = useState([])
  const [facilitiesCount, setFacilitiesCount] = useState([])

  const searchRef = useRef(null)
  const breadcrumbs = [
    <Link key="1" href="/" underline="hover">
      Home
    </Link>,
    <div key="2" className="breadcrumb-text">
      Find a park
    </div>,
  ]

  const {
    backcountryCamping,
    cycling,
    hiking,
    petsOnLeash,
    picnicAreas,
    swimming,
    vehicleAccessibleCamping,
  } = quickSearch

  const handleQuickSearchChange = event => {
    setQuickSearch({
      ...quickSearch,
      [event.target.name]: event.target.checked,
    })
    setCurrentPage(1)
  }

  const handleRegionCheck = (region, event) => {
    if (event.target.checked) {
      setSelectedRegions([...selectedRegions, region])
    } else {
      setSelectedRegions([
        ...selectedRegions.filter(r => r.value !== region.value),
      ])
    }
  }

  const handleCampingFacilityCheck = (camping, event) => {
    if (event.target.checked) {
      setSelectedCampingFacilities([...selectedCampingFacilities, camping])
    } else {
      setSelectedCampingFacilities([
        ...selectedCampingFacilities.filter(c => c.value !== camping.value),
      ])
    }
  }

  const handleActivitiesLengthChange = () => {
    setMoreActivites(!showMoreActivities)
    if (showMoreActivities) {
      setFilteredActivities(activityItems)
    } else {
      setFilteredActivities(activityItems.slice(0, truncatedFilterLength))
    }
  }

  const handleActivityCheck = (activity, event) => {
    if (event.target.checked) {
      setSelectedActivities([...selectedActivities, activity])
    } else {
      setSelectedActivities([
        ...selectedActivities.filter(a => a.value !== activity.value),
      ])
    }
  }

  const handleFacilitiesLengthChange = () => {
    setMoreFacilities(!showMoreFacilities)
    if (showMoreFacilities) {
      setFilteredFacilities(facilityItems)
    } else {
      setFilteredFacilities(facilityItems.slice(0, truncatedFilterLength))
    }
  }

  const handleFacilityCheck = (facility, event) => {
    if (event.target.checked) {
      setSelectedFacilities([...selectedFacilities, facility])
    } else {
      setSelectedFacilities([
        ...selectedFacilities.filter(f => f.value !== facility.value),
      ])
    }
  }

  const handleRegionDelete = chipToDelete => {
    setSelectedRegions(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
    setCurrentPage(1)
  }

  const handleCampingFacilityDelete = chipToDelete => {
    setSelectedCampingFacilities(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
    setCurrentPage(1)
  }

  const handleActivityDelete = chipToDelete => {
    setSelectedActivities(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
    setCurrentPage(1)
  }

  const handleFacilityDelete = chipToDelete => {
    setSelectedFacilities(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
    setCurrentPage(1)
  }

  const handleFilterDelete = chipToDelete => () => {
    if (chipToDelete.type === "region") {
      handleRegionDelete(chipToDelete)
    } else if (chipToDelete.type === "campingFacility") {
      handleCampingFacilityDelete(chipToDelete)
    } else if (chipToDelete.type === "activity") {
      handleActivityDelete(chipToDelete)
    } else if (chipToDelete.type === "facility") {
      handleFacilityDelete(chipToDelete)
    } else {
      setQuickSearch({
        ...quickSearch,
        [chipToDelete.type]: false,
      })
      setCurrentPage(1)
    }
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    scrollIntoView(searchRef.current, { behavior: "smooth" })
  }

  const handleClickOpenFilter = () => {
    setOpenFilter(true)
  }

  const handleClickOpenModal = () => {
    setOpenModal(true)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    setSearchText(inputText)
  }

  const setFilters = useCallback(() => {
    const filters = []
    selectedRegions.forEach(r => {
      filters.push({ ...r, type: "region" })
    })
    selectedCampingFacilities.forEach(c => {
      filters.push({ ...c, type: "campingFacility" })
    })
    selectedActivities.forEach(a => {
      filters.push({ ...a, type: "activity" })
    })
    selectedFacilities.forEach(f => {
      filters.push({ ...f, type: "facility" })
    })
    if (backcountryCamping) {
      filters.push({ label: "Backcountry camping", type: "backcountryCamping" })
    }
    if (cycling) {
      filters.push({ label: "Cycling", type: "cycling" })
    }
    if (hiking) {
      filters.push({ label: "Hiking", type: "hiking" })
    }
    if (petsOnLeash) {
      filters.push({ label: "Pets on leash", type: "petsOnLeash" })
    }
    if (picnicAreas) {
      filters.push({ label: "Picnic areas", type: "picnicAreas" })
    }
    if (swimming) {
      filters.push({ label: "Swimming", type: "swimming" })
    }
    if (vehicleAccessibleCamping) {
      filters.push({ label: "Vehicle-accessible camping", type: "vehicleAccessibleCamping" })
    }
    setFilterSelections([...filters])
  }, [
    backcountryCamping,
    cycling,
    hiking,
    petsOnLeash,
    picnicAreas,
    swimming,
    vehicleAccessibleCamping,
    selectedRegions,
    selectedCampingFacilities,
    selectedActivities,
    selectedFacilities,
  ])

  const params = useMemo(() => {
    const backcountryCampingFacility = data.allStrapiFacilityType.nodes.find(
      facility => {
        return (
          facility.facilityCode === "backcountry-camping"
        )
      }
    )
    const backcountryCampingFacilityId = backcountryCampingFacility?.facilityNumber
    const picnicAreasFacility = data.allStrapiFacilityType.nodes.find(
      facility => {
        return (
          facility.facilityCode === "picnic-areas"
        )
      }
    )
    const picnicAreasFacilityId = picnicAreasFacility?.facilityNumber
    const vehicleAccessibleCampingFacility = data.allStrapiFacilityType.nodes.find(
      facility => {
        return facility.facilityCode === "vehicle-accessible-camping"
      }
    )
    const vehicleAccessibleCampingFacilityId = vehicleAccessibleCampingFacility?.facilityNumber
    const cyclingActivity = data.allStrapiActivityType.nodes.find(activity => {
      return activity.activityCode === "cycling"
    })
    const cyclingActivityId = cyclingActivity?.activityNumber
    const hikingActivity = data.allStrapiActivityType.nodes.find(activity => {
      return activity.activityCode === "hiking"
    })
    const hikingActivityId = hikingActivity?.activityNumber
    const petsOnLeashActivity = data.allStrapiActivityType.nodes.find(activity => {
      return activity.activityCode === "pets-on-leash"
    })
    const petsOnLeashActivityId = petsOnLeashActivity?.activityNumber
    const swimmingActivity = data.allStrapiActivityType.nodes.find(activity => {
      return activity.activityCode === "swimming"
    })
    const swimmingActivityId = swimmingActivity?.activityNumber

    const params = {
      queryText: searchText,
    }

    if (selectedRegions.length > 0) {
      params.regions = selectedRegions.map(region => region.value)
    }
    if (selectedCampingFacilities.length > 0) {
      params.camping = selectedCampingFacilities.map(camping => camping.value)
    }
    if (selectedActivities.length > 0) {
      params.activities = selectedActivities.map(activity => activity.value)
    }
    if (selectedFacilities.length > 0) {
      params.facilities = selectedFacilities.map(facility => facility.value)
    }
    if (quickSearch.backcountryCamping) {
      if (typeof params.facilities === "undefined") {
        params.facilities = []
      }
      params.facilities.push(backcountryCampingFacilityId)
    }
    if (quickSearch.cycling) {
      if (typeof params.activities === "undefined") {
        params.activities = []
      }
      params.activities.push(cyclingActivityId)
    }
    if (quickSearch.hiking) {
      if (typeof params.activities === "undefined") {
        params.activities = []
      }
      params.activities.push(hikingActivityId)
    }
    if (quickSearch.petsOnLeash) {
      if (typeof params.activities === "undefined") {
        params.activities = []
      }
      params.activities.push(petsOnLeashActivityId)
    }
    if (quickSearch.picnicAreas) {
      if (typeof params.facilities === "undefined") {
        params.facilities = []
      }
      params.facilities.push(picnicAreasFacilityId)
    }
    if (quickSearch.swimming) {
      if (typeof params.activities === "undefined") {
        params.activities = []
      }
      params.activities.push(swimmingActivityId)
    }
    if (quickSearch.vehicleAccessibleCamping) {
      if (typeof params.facilities === "undefined") {
        params.facilities = []
      }
      params.facilities.push(vehicleAccessibleCampingFacilityId)
    }

    return params
  }, [
    data.allStrapiActivityType.nodes,
    data.allStrapiFacilityType.nodes,
    searchText,
    selectedRegions,
    selectedCampingFacilities,
    selectedActivities,
    selectedFacilities,
    quickSearch,
  ])

  const isActiveSearch =
    params.queryText ||
    (params.activities && params.activities.length) ||
    (params.facilities && params.facilities.length) ||
    params.camping ||
    params.marineProtectedArea ||
    params.typeCode

  const locationLabel = (parkLocation) => {
    if (parkLocation?.section !== "Haida Gwaii/South Island") {
      return parkLocation?.section;
    }
    if (parkLocation.managementArea === "Haida Gwaii") {
      return "Haida Gwaii";
    } else {
      return ("South Island");
    }
  }

  useEffect(() => {
    setIsLoading(true)
    setFilters()

    const apiUrl = `${data.site.siteMetadata.apiURL}/api`

    const pageStart = (currentPage - 1) * itemsPerPage
    const pageLimit = itemsPerPage

    axios.get(`${apiUrl}/protected-areas/search`, {
      params: { ...params, _start: pageStart, _limit: pageLimit },
    }).then(resultResponse => {
      if (resultResponse.status === 200) {
        const total = parseInt(resultResponse.data.meta.pagination.total, 10)
        const pages = Math.ceil(total / itemsPerPage)
        setSearchResults([...resultResponse.data.data])
        setTotalResults(total)
        setNumberOfPages(pages)
        setActivitiesCount(resultResponse.data.meta.aggregations.activities.buckets)
        setFacilitiesCount(resultResponse.data.meta.aggregations.facilities.buckets)
      } else {
        setSearchResults([])
        setTotalResults(0)
        setNumberOfPages(0)
      }
    })
      .finally(() => {
        setIsLoading(false)
      })
  }, [
    params,
    currentPage,
    data.site.siteMetadata.apiURL,
    setFilters,
    setNumberOfPages,
    setSearchResults,
    setTotalResults,
  ])

  return (
    <>
      <Header content={menuContent} />
      <div id="sr-content" className="search-body">
        <div className="search-results-main container">
          <div className="search-results-container">
            <Breadcrumbs
              separator="›"
              aria-label="breadcrumb"
              className="sm-p10"
            >
              {breadcrumbs}
            </Breadcrumbs>
            <div className="row no-gutters">
              <div className="col-12">
                <h1 className="headline-text p40t sm-p10">
                  {!isActiveSearch && <>Find a park</>}
                  {isLoading && isActiveSearch && <>Searching...</>}
                  {!isLoading && isActiveSearch && (
                    <>
                      {totalResults}{" "}
                      {totalResults === 1 ? " result found" : " results found"}
                    </>
                  )}
                </h1>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-lg-3 col-md-12 col-sm-12">
                <div className="search-results-quick-filter m15t d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                  <div className="row no-gutters"></div>
                </div>
              </div>
              <div className="col-lg-9 col-md-12 col-sm-12" ref={searchRef}>
                <div className="search-results-list container">
                  <div className="row p20t d-flex">
                    <div className="col-12 d-none d-lg-block">
                      {filterSelections.length > 0 && filterSelections.map((f, index) => (
                        <Chip
                          key={index}
                          label={f.label}
                          onClick={handleFilterDelete(f)}
                          onDelete={handleFilterDelete(f)}
                          variant="outlined"
                          className="park-filter-chip font-weight-bold"
                          deleteIcon={<CancelIcon className="close-icon" />}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-lg-9 col-md-12 col-sm-12">
                <div className="search-results-quick-filter d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none mt-3">
                  <div className="row no-gutters">
                    <div className="col-12">
                      <TextField
                        id="park-search-text"
                        variant="outlined"
                        placeholder="Park name"
                        className="park-search-text-box h50p"
                        value={inputText}
                        onChange={event => {
                          setInputText(event.target.value)
                        }}
                        onKeyPress={ev => {
                          if (ev.key === "Enter") {
                            setSearchText(inputText)
                            ev.preventDefault()
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon className="search-icon" />
                            </InputAdornment>
                          ),
                          inputProps: {
                            "aria-label": "Park search",
                          }
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="search-results-list container">
                  <div className="row">
                    <div className="col-md-4 col-sm-12 col-xs-12 mt-3">
                      <div className="d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
                        <Button
                          fullWidth
                          className="bcgov-normal-blue mobile-search-element-height"
                          onClick={() => {
                            handleSearch()
                          }}
                        >
                          Search
                        </Button>
                      </div>
                    </div>
                    <div className="col-md-4 col-sm-12 col-xs-12 mt-3">
                      <div className="d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
                        <Button
                          variant="outlined"
                          onClick={handleClickOpenFilter}
                          className="bcgov-button bcgov-normal-white font-weight-bold"
                        >
                          Filter
                        </Button>
                      </div>
                    </div>
                    <div className="col-md-4 col-sm-12 col-xs-12 mt-3">
                      <div className="d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
                        <Button
                          variant="outlined"
                          onClick={handleClickOpenModal}
                          className="bcgov-button bcgov-normal-white font-weight-bold"
                        >
                          More ways to find a park
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-lg-3 col-md-12 col-sm-12">
                <div className="search-results-quick-filter">
                  <div className="row no-gutters d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                    <div className="col-12 mb32">
                      <h3 className="subtitle">Search</h3>
                      <div className="search-results-quick-filter">
                        <div className="row no-gutters">
                          <div className="col-12 park-search-text-box-container d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                            <TextField
                              id="park-search-text"
                              variant="outlined"
                              placeholder="Park name"
                              className="park-search-text-box h50p"
                              value={inputText}
                              onChange={event => {
                                setInputText(event.target.value)
                              }}
                              onKeyPress={ev => {
                                if (ev.key === "Enter") {
                                  setSearchText(inputText)
                                  setCurrentPage(1)
                                  ev.preventDefault()
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon className="search-icon" />
                                  </InputAdornment>
                                ),
                                inputProps: {
                                  "aria-label": "Park search",
                                }
                              }}
                            />
                          </div>
                          <div className="m15t col-12 park-search-text-box-container d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                            <Button
                              fullWidth
                              className="bcgov-normal-blue mobile-search-element-height h50p"
                              onClick={handleSearch}
                            >
                              Search
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 pr-3 mb32">
                      <h3 className="subtitle">Filter</h3>
                      <div className="">
                        <fieldset className="mb-2">
                          <legend className="filter-heading p10t">Popular</legend>
                          <FormGroup className="p10l filter-options-container">
                            {quickSearchFilters.map(item => {
                              return (
                                <FormControlLabel
                                  key={item.label}
                                  control={
                                    <Checkbox
                                      checked={quickSearch[item.type]}
                                      onChange={handleQuickSearchChange}
                                      name={item.type}
                                    />
                                  }
                                  label={item.label}
                                  className={
                                    quickSearch[item.type]
                                      ? "text-light-blue no-wrap"
                                      : "no-wrap"
                                  }
                                />
                              )
                            })}
                          </FormGroup>
                        </fieldset>
                        <fieldset className="mb-2">
                          <legend className="filter-heading">Regions</legend>
                          <FormGroup className="p10l filter-options-container">
                            {regionItems.map(item => {
                              return (
                                <FormControlLabel
                                  key={item.label}
                                  control={
                                    <Checkbox
                                      checked={
                                        selectedRegions.filter(
                                          region => region.value === item.value
                                        ).length === 1
                                          ? true
                                          : false
                                      }
                                      onChange={event => {
                                        handleRegionCheck(item, event)
                                      }}
                                      name={item.label}
                                    />
                                  }
                                  label={item.label}
                                  className={
                                    selectedRegions.filter(
                                      region => region.value === item.value
                                    ).length === 1
                                      ? "text-light-blue no-wrap"
                                      : "no-wrap"
                                  }
                                />
                              )
                            })}
                          </FormGroup>
                        </fieldset>
                        <fieldset className="mb-2">
                          <legend className="filter-heading">Camping</legend>
                          <FormGroup className="p10l filter-options-container">
                            {campingFacilityItems.map(item => {
                              return (
                                <FormControlLabel
                                  key={item.label}
                                  control={
                                    <Checkbox
                                      checked={
                                        selectedCampingFacilities.filter(
                                          camping => camping.value === item.value
                                        ).length === 1
                                          ? true
                                          : false
                                      }
                                      onChange={event => {
                                        handleCampingFacilityCheck(item, event)
                                      }}
                                      name={item.label}
                                    />
                                  }
                                  label={item.label}
                                  className={
                                    selectedCampingFacilities.filter(
                                      camping => camping.value === item.value
                                    ).length === 1
                                      ? "text-light-blue no-wrap"
                                      : "no-wrap"
                                  }
                                />
                              )
                            })}
                          </FormGroup>
                        </fieldset>
                        <fieldset className="mb-2">
                          <legend className="sr-only">Activities</legend>
                          <div
                            tabIndex={showActivities ? -1 : 0}
                            role="button"
                            className="row pointer mr-3"
                            onClick={() => {
                              setActivityVisibility(!showActivities)
                            }}
                            onKeyDown={() => {
                              setActivityVisibility(!showActivities)
                            }}
                          >
                            <div className="col-md-4">
                              <div className="filter-heading">Activities</div>
                            </div>
                            <div className="col-md-2 ml-auto">
                              {showActivities ? (
                                <ExpandLess
                                  fontSize="large"
                                  className="mt-auto"
                                />
                              ) : (
                                <ExpandMore
                                  fontSize="large"
                                  className="mt-auto"
                                />
                              )}
                            </div>
                          </div>
                          <div>
                            {showActivities ? (
                              <div>
                                <FormGroup className="p10l filter-options-container">
                                  {filteredActivities.map(a => {
                                    return (
                                      <FormControlLabel
                                        key={a.label}
                                        control={
                                          <Checkbox
                                            checked={
                                              selectedActivities.filter(
                                                act => act.value === a.value
                                              ).length === 1
                                                ? true
                                                : false
                                            }
                                            onChange={event => {
                                              handleActivityCheck(a, event)
                                            }}
                                            name={a.label}
                                          />
                                        }
                                        label={a.label}
                                        className={
                                          selectedActivities.filter(
                                            act => act.value === a.value
                                          ).length === 1
                                            ? "text-light-blue no-wrap"
                                            : "no-wrap"
                                        }
                                      />
                                    )
                                  })}
                                </FormGroup>
                                <Link
                                  className="ml-auto pointer"
                                  onClick={() => {
                                    handleActivitiesLengthChange([])
                                  }}
                                  onKeyUp={(e) => {
                                    if (e.key === " " || e.key === "Enter") {
                                      handleActivitiesLengthChange([])
                                    }
                                  }}
                                  tabIndex="0"
                                  role="link"
                                  underline="hover"
                                >
                                  {showMoreActivities ? (
                                    <div style={{ color: `#2464A4` }}>
                                      Show all {activityItems.length}
                                      <ExpandMore fontSize="small" />
                                    </div>
                                  ) : (
                                    <div style={{ color: `#2464A4` }}>
                                      Show less
                                      <ExpandLess fontSize="small" />
                                    </div>
                                  )}
                                </Link>
                              </div>
                            ) : (
                              <div></div>
                            )}
                          </div>
                        </fieldset>
                        <fieldset>
                          <legend className="sr-only">Facilities</legend>
                          <div
                            tabIndex={showActivities ? -1 : 0}
                            role="button"
                            className="row pointer mr-3"
                            onClick={() => {
                              setFacilityVisibility(!showFacilities)
                            }}
                            onKeyDown={() => {
                              setFacilityVisibility(!showFacilities)
                            }}
                          >
                            <div className="col-md-4">
                              <div className="filter-heading">Facilities</div>
                            </div>
                            <div className="col-md-2 ml-auto">
                              {showFacilities ? (
                                <ExpandLess
                                  fontSize="large"
                                  className="mt-auto"
                                />
                              ) : (
                                <ExpandMore
                                  fontSize="large"
                                  className="mt-auto"
                                />
                              )}
                            </div>
                          </div>
                          <div>
                            {showFacilities ? (
                              <div>
                                <FormGroup className="p10l filter-options-container">
                                  {filteredFacilities.map(f => {
                                    return (
                                      <FormControlLabel
                                        key={f.label}
                                        control={
                                          <Checkbox
                                            checked={
                                              selectedFacilities.filter(
                                                fac => fac.value === f.value
                                              ).length === 1
                                                ? true
                                                : false
                                            }
                                            onChange={event => {
                                              handleFacilityCheck(f, event)
                                            }}
                                            name={f.label}
                                          />
                                        }
                                        label={f.label}
                                        className={
                                          selectedFacilities.filter(
                                            fac => fac.value === f.value
                                          ).length === 1
                                            ? "text-light-blue no-wrap"
                                            : "no-wrap"
                                        }
                                      />
                                    )
                                  })}
                                </FormGroup>
                                <Link
                                  className="ml-auto pointer"
                                  onClick={() => {
                                    handleFacilitiesLengthChange([])
                                  }}
                                  onKeyUp={(e) => {
                                    if (e.key === " " || e.key === "Enter") {
                                      handleFacilitiesLengthChange([])
                                    }
                                  }}
                                  tabIndex="0"
                                  role="link"
                                  underline="hover"
                                >
                                  {showMoreFacilities ? (
                                    <div style={{ color: `#2464A4` }}>
                                      Show all {facilityItems.length}
                                      <ExpandMore fontSize="small" />
                                    </div>
                                  ) : (
                                    <div style={{ color: `#2464A4` }}>
                                      Show less
                                      <ExpandLess fontSize="small" />
                                    </div>
                                  )}
                                </Link>
                              </div>
                            ) : (
                              <div></div>
                            )}
                          </div>
                        </fieldset>
                      </div>
                    </div>
                    <div className="col-12 park-links">
                      <h3 className="subtitle">More ways to find a park</h3>
                      <div>
                        <GatsbyLink to="/parks">A–Z list</GatsbyLink>
                        <br />
                        <a
                          target="_blank"
                          rel="noopener noreferrer"
                          className="map-link"
                          href="https://governmentofbc.maps.arcgis.com/apps/webappviewer/index.html?id=077ef73a1eae4ca88f2bafbb831215af&query=British_Columbia_Parks_Ecological_Reserves_and_Protected_Areas_8747,ORCS_PRIMARY,0000"
                        >
                          Map
                          <OpenInNewIcon />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-12 col-sm-12">
                <div className="search-results-list container">
                  {isLoading && (
                    <div className="container mt-5">
                      <LinearProgress />
                    </div>
                  )}
                  {!isLoading && (
                    <>
                      {!searchResults ||
                        (searchResults.length === 0 && (
                          <NoSearchResults></NoSearchResults>
                        ))}
                      {searchResults && searchResults.length > 0 && (
                        <>
                          {searchResults.map((r, index) => (
                            <div key={index} className="m20t">
                              <Card className="d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                                <CardContent className="park-card park-card-desktop">
                                  <div className="row search-result-card no-gutters">
                                    <div className="col-12">
                                      <div className="row no-gutters">
                                        {r.parkPhotos &&
                                          r.parkPhotos.length === 0 && (
                                            <div className="col-lg-auto close-margin park-image-div park-image-logo-div">
                                              <img
                                                alt="logo"
                                                key={index}
                                                className="search-result-logo-image"
                                                src={parksLogo}
                                              />
                                            </div>
                                          )}
                                        {r.parkPhotos &&
                                          r.parkPhotos.length === 1 && (
                                            <div className="col-lg-auto close-margin park-image-div">
                                              <img
                                                alt="park"
                                                key={index}
                                                className="search-result-image"
                                                src={addSmallImagePrefix(r.parkPhotos[0])}
                                                onError={(e) => { handleImgError(e, r.parkPhotos[0]) }}
                                              />
                                            </div>
                                          )}
                                        {r.parkPhotos &&
                                          r.parkPhotos.length > 1 && (
                                            <div className="col-lg-auto close-margin park-image-div">
                                              <Carousel
                                                className="park-carousel"
                                                autoPlay={false}
                                                indicators={true}
                                                navButtonsAlwaysVisible={true}
                                                animation="fade"
                                                timeout={200}
                                                height="200px"
                                                navButtonsWrapperProps={{
                                                  className: "carousel-nav"
                                                }}
                                                navButtonsProps={{
                                                  className: "carousel-nav-botton"
                                                }}
                                                indicatorContainerProps={{
                                                  className: "indicator"
                                                }}
                                                indicatorIconButtonProps={{
                                                  className: "indicator-button"
                                                }}
                                                activeIndicatorIconButtonProps={{
                                                  className: "indicator-button--active"
                                                }}
                                              >
                                                {r.parkPhotos.map(
                                                  (item, index) => {
                                                    return (
                                                      <img
                                                        alt="park carousel"
                                                        key={index}
                                                        className="search-result-image"
                                                        src={addSmallImagePrefix(item)}
                                                        onError={(e) => { handleImgError(e, item) }} />
                                                    )
                                                  }
                                                )}
                                              </Carousel>
                                            </div>
                                          )}

                                        <div className="col park-content">
                                          <div className="park-content-top">
                                            <Link
                                              href={`/${r.slug}/`}
                                              underline="hover"
                                            >
                                              <h2 className="park-heading-text">
                                                {r.protectedAreaName}
                                                <ExpandCircleDownIcon className="park-heading-icon" />
                                              </h2>
                                            </Link>
                                            <p>{locationLabel(r.parkLocations.length ? r.parkLocations[0] : {})}</p>
                                          </div>
                                          <div className="park-content-bottom">
                                            <div className="park-content-bottom--left">
                                              <FeatureIcons park={r}/>
                                            </div>
                                            <div className="park-content-bottom--right text-blue">
                                              <ParkAccessStatus
                                                advisories={r.advisories}
                                                slug={r.slug}
                                              />
                                              {r.hasCampfireBan &&
                                                <div className="campfire-ban-icon">
                                                  <Icon src={campfireBanIcon} label="Campfire ban" size="24" />
                                                  <span>No campfires</span>
                                                </div>
                                              }
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                              <Card className="d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
                                <CardContent className="park-card">
                                  <div className="row search-result-card no-gutters">
                                    <div className="col-12">
                                      <div className="row no-gutters">
                                        {r.parkPhotos &&
                                          r.parkPhotos.length === 0 && (
                                            <div className="col-12 close-margin park-image-div-mobile park-image-logo-div">
                                              <img
                                                alt="logo"
                                                key={index}
                                                className="search-result-logo-image"
                                                src={parksLogo}
                                              />
                                            </div>
                                          )}
                                        {r.parkPhotos &&
                                          r.parkPhotos.length === 1 && (
                                            <div className="col-12 close-margin park-image-div-mobile">
                                              <img
                                                alt="park"
                                                key={index}
                                                className="search-result-image"
                                                src={addSmallImagePrefix(r.parkPhotos[0])}
                                                onError={(e) => { handleImgError(e, r.parkPhotos[0]) }}
                                              />
                                            </div>
                                          )}
                                        {r.parkPhotos &&
                                          r.parkPhotos.length > 1 && (
                                            <div className="col-12 close-margin park-image-div-mobile">
                                              <Carousel
                                                className="park-carousel-mobile"
                                                autoPlay={false}
                                                indicators={true}
                                                navButtonsAlwaysVisible={true}
                                                animation="fade"
                                                timeout={200}
                                                height="100%"
                                                navButtonsWrapperProps={{
                                                  className: "carousel-nav"
                                                }}
                                                navButtonsProps={{
                                                  className: "carousel-nav-botton"
                                                }}
                                                indicatorContainerProps={{
                                                  className: "indicator"
                                                }}
                                                indicatorIconButtonProps={{
                                                  className: "indicator-button"
                                                }}
                                                activeIndicatorIconButtonProps={{
                                                  className: "indicator-button--active"
                                                }}
                                              >
                                                {r.parkPhotos.map(
                                                  (item, index) => {
                                                    return (
                                                      <img
                                                        alt="park carousel"
                                                        key={index}
                                                        className="search-result-image"
                                                        src={addSmallImagePrefix(item)}
                                                        onError={(e) => { handleImgError(e, item) }}
                                                      />
                                                    )
                                                  }
                                                )}
                                              </Carousel>
                                            </div>
                                          )}

                                        <div className="col-12 park-content-mobile">
                                          <Link
                                            href={`/${r.slug}/`}
                                            className="p10t"
                                            underline="hover"
                                          >
                                            <h2 className="park-heading-text">
                                              {r.protectedAreaName}
                                              <ExpandCircleDownIcon className="park-heading-icon" />
                                            </h2>
                                          </Link>
                                          <p>{locationLabel(r.parkLocations.length ? r.parkLocations[0] : {})}</p>
                                          <div>
                                            <FeatureIcons park={r} />
                                          </div>
                                          <div className="text-blue">
                                            <ParkAccessStatus
                                              advisories={r.advisories}
                                              slug={r.slug}
                                            />
                                            {r.hasCampfireBan &&
                                              <div className="campfire-ban-icon">
                                                <Icon src={campfireBanIcon} label="Campfire ban" size="24" />
                                                <span>No campfires</span>
                                              </div>
                                            }
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          ))}
                          <div className="small-flex-display pagination-text">
                            <div className="small-m-auto">
                              {searchResults.length > 0 && (
                                <>
                                  Showing{" "}
                                  {currentPage * itemsPerPage -
                                    itemsPerPage +
                                    1}{" "}
                                  -{" "}
                                  {currentPage * itemsPerPage > totalResults
                                    ? totalResults
                                    : currentPage * itemsPerPage}{" "}
                                  of {totalResults} results
                                </>
                              )}
                              {searchResults.length === 0 && (
                                <>No parks found</>
                              )}
                            </div>
                          </div>
                          <div className="small-flex-display p20t">
                            <div className="p20t small-m-auto">
                              <Pagination
                                count={numberOfPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                size="large"
                                className="large-pagination"
                              />
                              <Pagination
                                count={numberOfPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                siblingCount={0}
                                size="large"
                                className="small-pagination"
                              />
                            </div>
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SearchFilter
        data={{
          regionItems,
          campingFacilityItems,
          activityItems,
          facilityItems,
          quickSearchFilters,
          openFilter,
          setOpenFilter,
          quickSearch,
          selectedRegions,
          setSelectedRegions,
          selectedCampingFacilities,
          setSelectedCampingFacilities,
          selectedActivities,
          setSelectedActivities,
          selectedFacilities,
          setSelectedFacilities,
          setQuickSearch,
          searchText,
          setSearchText,
          setCurrentPage,
        }}
      />
      <ParkLinksModal data={{openModal, setOpenModal}} />
      <Footer />
    </>
  )
}

export const Head = () => (
  <Seo title="Find a park" description="Search for the webpages of parks and protected areas across British Columbia. Get detailed information on camping and other activities at specific BC Parks." />
)