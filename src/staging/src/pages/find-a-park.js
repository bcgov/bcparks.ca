import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { graphql } from "gatsby"
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
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core"
import Pagination from "@material-ui/lab/Pagination"
import SearchIcon from "@material-ui/icons/Search"
import CancelIcon from "@material-ui/icons/Cancel"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import Carousel from "react-material-ui-carousel"
import { scrollIntoView } from "seamless-scroll-polyfill";

import Footer from "../components/footer"
import Header from "../components/header"
import Seo from "../components/seo"
import ParkAccessStatus from "../components/park/parkAccessStatus"
import QuickView from "../components/park/quickView"
import AdvisorySummary from "../components/search/advisorySummary"
import NoSearchResults from "../components/search/noSearchResults"
import SearchFilter from "../components/search/searchFilter"

import dayUseIcon from "../images/park/day-use.png"
import parksLogo from "../images/Mask_Group_5.png"

import "../styles/search.scss"
import { addSmallImagePrefix, handleImgError } from "../utils/helpers";

export const query = graphql`
  query {
    site {
      siteMetadata {
        apiURL
      }
    }
    allStrapiActivityType(
      filter: { isActive: { eq: true } }
    ) {
      totalCount
      nodes {
        strapi_id
        activityName
        activityCode
      }
    }
    allStrapiFacilityType(
      sort: { fields: facilityName }
      filter: { isActive: { eq: true } }      
    ) {
      totalCount
      nodes {
        strapi_id
        facilityName
        facilityCode
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
  }
`

export default function FindAPark({ location, data }) {
  const menuContent = data?.allStrapiMenu?.nodes || []

  const sortedActivityItems = orderBy(
    data.allStrapiActivityType.nodes,
    [activity => activity.activityName.toLowerCase()], ["asc"]
  )
  const activityItems = sortedActivityItems.map(activity => {
    return {
      label: activity.activityName,
      value: activity.strapi_id,
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

  const facilityItems = data.allStrapiFacilityType.nodes.map(facility => {
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
    camping: false,
    petFriendly: false,
    accessibility: false,
    marine: false,
    ecoReserve: false,
    electricalHookup: false,
  })

  const quickSearchFilters = [
    { label: "Camping", type: "camping" },
    { label: "Dog friendly", type: "petFriendly" },
    { label: "Accessibility information", type: "accessibility" },
    { label: "Marine park", type: "marine" },
    { label: "Ecological reserve", type: "ecoReserve" },
    { label: "Electrical hook-ups", type: "electricalHookup" },
  ]

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

  const itemsPerPage = 6
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const [openFilter, setOpenFilter] = useState(false)

  const [openQuickView, setOpenQuickView] = useState(false)

  const searchRef = useRef(null)
  const breadcrumbs = [
    <Link key="1" href="/">
      Home
    </Link>,
    <div key="2" className="breadcrumb-text">
      Find a park
    </div>,
  ]

  const {
    camping,
    petFriendly,
    accessibility,
    marine,
    ecoReserve,
    electricalHookup,
  } = quickSearch

  const handleQuickSearchChange = event => {
    setQuickSearch({
      ...quickSearch,
      [event.target.name]: event.target.checked,
    })
    setCurrentPage(1)
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
    if (chipToDelete.type === "activity") {
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
    scrollIntoView(searchRef.current, {behavior: "smooth" })
  }

  const handleClickOpenFilter = () => {
    setOpenFilter(true)
  }

  const [currentPark, setCurrentPark] = useState({})

  function setParkQuickView(park) {
    setCurrentPark(park)
    setOpenQuickView(true)
  }

  const handleCloseQuickView = () => {
    setOpenQuickView(false)
  }

  const handleSearch = () => {
    setCurrentPage(1)
    setSearchText(inputText)
  }

  const setFilters = useCallback(() => {
    const filters = []
    selectedActivities.forEach(a => {
      filters.push({ ...a, type: "activity" })
    })
    selectedFacilities.forEach(f => {
      filters.push({ ...f, type: "facility" })
    })
    if (camping) {
      filters.push({ label: "Camping", type: "camping" })
    }
    if (petFriendly) {
      filters.push({ label: "Dog friendly", type: "petFriendly" })
    }
    if (accessibility) {
      filters.push({ label: "Accessibility information", type: "accessibility" })
    }
    if (marine) {
      filters.push({ label: "Marine park", type: "marine" })
    }
    if (ecoReserve) {
      filters.push({ label: "Ecological reserve", type: "ecoReserve" })
    }
    if (electricalHookup) {
      filters.push({ label: "Electrical hook-ups", type: "electricalHookup" })
    }
    setFilterSelections([...filters])
  }, [
    camping,
    ecoReserve,
    electricalHookup,
    marine,
    petFriendly,
    selectedActivities,
    selectedFacilities,
    accessibility,
  ])

  const params = useMemo(() => {
    const accessibleFacility = data.allStrapiFacilityType.nodes.find(
      facility => {
        return (
          facility.facilityCode === "accessibility-information"
        )
      }
    )
    const accessibleFacilityId = accessibleFacility?.strapi_id
    const electricalFacility = data.allStrapiFacilityType.nodes.find(
      facility => {
        return facility.facilityCode === "electrical-hookups"
      }
    )
    const electricalFacilityId = electricalFacility?.strapi_id
    const petsActivity = data.allStrapiActivityType.nodes.find(activity => {
      return activity.activityCode === "pets-on-leash"
    })
    const petsActivityId = petsActivity?.strapi_id

    const params = {
      _q: searchText,
    }

    if (selectedActivities.length > 0) {
      params.activities = selectedActivities.map(activity => activity.value)
    }
    if (selectedFacilities.length > 0) {
      params.facilities = selectedFacilities.map(facility => facility.value)
    }
    if (quickSearch.camping) {
      params.camping = "Y"
    }
    if (quickSearch.petFriendly) {
      if (typeof params.activities === "undefined") {
        params.activities = []
      }
      params.activities.push(petsActivityId)
    }
    if (quickSearch.accessibility) {
      if (typeof params.facilities === "undefined") {
        params.facilities = []
      }
      params.facilities.push(accessibleFacilityId)
    }
    if (quickSearch.marine) {
      params.marineProtectedArea = "Y"
    }
    if (quickSearch.ecoReserve) {
      params.typeCode = "ER"
    }
    if (quickSearch.electricalHookup) {
      if (typeof params.facilities === "undefined") {
        params.facilities = []
      }
      params.facilities.push(electricalFacilityId)
    }

    return params
  }, [
    data.allStrapiActivityType.nodes,
    data.allStrapiFacilityType.nodes,
    searchText,
    selectedActivities,
    selectedFacilities,
    quickSearch,
  ])

  const isActiveSearch =
    params._q ||
    (params.activities && params.activities.length) ||
    (params.facilities && params.facilities.length) ||
    params.camping ||
    params.marineProtectedArea ||
    params.typeCode

  useEffect(() => {
    setIsLoading(true)
    setFilters()

    const apiUrl = `${data.site.siteMetadata.apiURL}/api`

    const pageStart = (currentPage - 1) * itemsPerPage
    const pageLimit = itemsPerPage

    const countPromise = axios.get(`${apiUrl}/protected-areas/count`, {
      params,
    })
    const resultPromise = axios.get(`${apiUrl}/protected-areas/`, {
      params: { ...params, _start: pageStart, _limit: pageLimit },
    })

    Promise.all([countPromise, resultPromise])
      .then(([countResponse, resultResponse]) => {
        if (countResponse.status === 200 && resultResponse.status === 200) {
          const total = parseInt(countResponse.data, 10)
          const pages = Math.ceil(total / itemsPerPage)
          setSearchResults([...resultResponse.data])
          setTotalResults(total)
          setNumberOfPages(pages)
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
              className="p10t sm-p10"
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
                    <div className="col-8 d-none d-lg-block">
                      {filterSelections.length > 0 && filterSelections.map((f, index) => (
                        <Chip
                          key={index}
                          label={f.label}
                          onDelete={handleFilterDelete(f)}
                          variant="outlined"
                          className="park-filter-chip font-weight-bold"
                          deleteIcon={<CancelIcon className="close-icon" />}
                        />
                      ))}
                    </div>
                    <div className="col col-lg-4 text-lg-right">
                      <a
                        className="map-link"
                        href="https://governmentofbc.maps.arcgis.com/apps/webappviewer/index.html?id=077ef73a1eae4ca88f2bafbb831215af&query=British_Columbia_Parks_Ecological_Reserves_and_Protected_Areas_8747,ORCS_PRIMARY,0000"
                      >
                        Find parks on a map
                      </a>
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
                        placeholder="e.g. Alice Lake Park"
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
                    <div className="col-lg-8 col-md-6 col-sm-12 col-xs-12 p10t">
                      <div className="d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
                        <Button
                          fullWidth
                          className="bcgov-normal-blue mobile-search-element-height h50p"
                          onClick={() => {
                            handleSearch()
                          }}
                        >
                          Search
                        </Button>
                      </div>
                    </div>
                    <div className="col-lg-8 col-md-6 col-sm-12 col-xs-12 p10t">
                      <div className="d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
                        <Button
                          variant="outlined"
                          onClick={handleClickOpenFilter}
                          className="bcgov-button bcgov-normal-white h50p font-weight-bold"
                        >
                          Filter
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
                    <div className="col-12">
                      <div className="search-results-quick-filter">
                        <div className="row no-gutters pb20">
                          <div className="col-12 park-search-text-box-container d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                            <TextField
                              id="park-search-text"
                              variant="outlined"
                              placeholder="e.g. Alice Lake Park"
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
                    <div className="col-12 pr-3">
                      <div className="">
                      <fieldset>
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
                        <hr></hr>
                        <fieldset>
                        <legend className="sr-only">Activities</legend>
                        <div
                          tabIndex={0}
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
                                className="ml-auto pointer p20"
                                onClick={() => {
                                  handleActivitiesLengthChange([])
                                }}
                                tabIndex="0"
                                role="link"
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
                        <hr></hr>
                        <fieldset>
                        <legend className="sr-only">Facilities</legend>
                        <div
                          tabIndex={0}
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
                                className="ml-auto pointer p20"
                                onClick={() => {
                                  handleFacilitiesLengthChange([])
                                }}
                                tabIndex="0"
                                role="link"
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
                                      <div className="row">
                                        {r.parkPhotos &&
                                          r.parkPhotos.length === 0 && (
                                            <div className="col-lg-5 close-margin park-image-div park-image-logo-div">
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
                                            <div className="col-lg-5 close-margin park-image-div">
                                              <img
                                                alt="park"
                                                key={index}
                                                className="search-result-image"
                                                src={addSmallImagePrefix(r.parkPhotos[0])}
                                                onError={(e) => {handleImgError(e, r.parkPhotos[0])}}
                                              />
                                            </div>
                                          )}
                                        {r.parkPhotos &&
                                          r.parkPhotos.length > 1 && (
                                            <div className="col-lg-5 close-margin park-image-div">
                                              <Carousel
                                                className="park-carousel"
                                                autoPlay={false}
                                                indicators={false}
                                                navButtonsAlwaysVisible={true}
                                                animation="fade"
                                                timeout={200}
                                              >
                                                {r.parkPhotos.map(
                                                  (item, index) => {
                                                    return (
                                                      <img
                                                        alt="park carousel"
                                                        key={index}
                                                        className="search-result-image"
                                                        src={addSmallImagePrefix(item)}
                                                        onError={(e) => {handleImgError(e, item)}}                                                      />
                                                    )
                                                  }
                                                )}
                                              </Carousel>
                                            </div>
                                          )}

                                        <div className="col-lg-7 p20t park-content p20l">
                                          <div className="row">
                                            <div className="col-12 park-overview-content text-blue small-font p5l">
                                              <ParkAccessStatus
                                                advisories={r.advisories}
                                              />
                                            </div>
                                          </div>
                                          <Link
                                            href={`/${r.slug}/`}
                                            className="p10t"
                                          >
                                            <h2 className="park-heading-text">
                                              {r.protectedAreaName}
                                            </h2>
                                          </Link>

                                          <div className="row p10t mr5">
                                            <div className="col-6">
                                              {r.advisories &&
                                                r.advisories.length > 0 && (
                                                  <Link
                                                    href={`/${r.slug}#park-advisory-details-container`}
                                                  >
                                                    <AdvisorySummary
                                                      advisories={r.advisories}
                                                    />
                                                  </Link>
                                                )}
                                            </div>

                                            <div className="col-6">
                                              {r.hasDayUsePass &&
                                                r.hasReservations && (
                                                  <div className="flex-display">
                                                    <img
                                                      alt=""
                                                      className="search-result-icon"
                                                      src={dayUseIcon}
                                                    />
                                                    <div className="pl15 mtm7 text-blue">
                                                      Day use and camping <br />
                                                      offered at this park
                                                    </div>
                                                  </div>
                                                )}
                                            </div>
                                          </div>
                                          <div className="row p10t mr5">
                                            <div className="col-6">
                                              {r.parkActivities &&
                                                r.parkActivities.length > 0 && (
                                                  <>
                                                    <div className="park-af-list pr3">
                                                      <b>Activities:</b>
                                                    </div>
                                                    {r.parkActivities.map(
                                                      (
                                                        parkActivity,
                                                        index2
                                                      ) => (
                                                        <div
                                                          key={index2}
                                                          className="park-af-list pr3 text-black"
                                                        >
                                                          {index2 < 11 && (
                                                            <>
                                                              {
                                                                activityItemsLabels[
                                                                  parkActivity
                                                                    .activityType
                                                                ]
                                                              }
                                                              {index2 === 10
                                                                ? " ..."
                                                                : index2 ===
                                                                  r
                                                                    .parkActivities
                                                                    .length -
                                                                    1
                                                                ? ""
                                                                : ", "}
                                                            </>
                                                          )}
                                                        </div>
                                                      )
                                                    )}
                                                    <br />
                                                  </>
                                                )}
                                            </div>
                                            <div className="col-6">
                                              {r.parkFacilities &&
                                                r.parkFacilities.length > 0 && (
                                                  <>
                                                    <div className="park-af-list pr3">
                                                      <b>Facilities:</b>
                                                    </div>

                                                    {r.parkFacilities.map(
                                                      (
                                                        parkFacility,
                                                        index3
                                                      ) => (
                                                        <div
                                                          key={parkFacility.id}
                                                          className="park-af-list pr3 text-black"
                                                        >
                                                          {index3 < 6 && (
                                                            <>
                                                              {
                                                                facilityItemsLabels[
                                                                  parkFacility
                                                                    .facilityType
                                                                ]
                                                              }
                                                              {index3 === 5
                                                                ? " ..."
                                                                : index3 ===
                                                                  r
                                                                    .parkFacilities
                                                                    .length -
                                                                    1
                                                                ? ""
                                                                : ", "}
                                                            </>
                                                          )}
                                                        </div>
                                                      )
                                                    )}
                                                    <br />
                                                  </>
                                                )}
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
                                      <div className="row">
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
                                                onError={(e) => {handleImgError(e, r.parkPhotos[0])}}
                                              />
                                            </div>
                                          )}
                                        {r.parkPhotos &&
                                          r.parkPhotos.length > 1 && (
                                            <div className="col-12 close-margin park-image-div-mobile">
                                              <Carousel
                                                className="park-carousel-mobile"
                                                autoPlay={false}
                                                indicators={false}
                                                navButtonsAlwaysVisible={true}
                                                animation="fade"
                                                timeout={200}
                                              >
                                                {r.parkPhotos.map(
                                                  (item, index) => {
                                                    return (
                                                      <img
                                                        alt="park carousel"
                                                        key={index}
                                                        className="search-result-image"
                                                        src={addSmallImagePrefix(item)}
                                                        onError={(e) => {handleImgError(e, item)}}
                                                      />
                                                    )
                                                  }
                                                )}
                                              </Carousel>
                                            </div>
                                          )}

                                        <div className="col-12 p20t park-content-mobile">
                                          <div className="row">
                                            <div className="col-12 park-overview-content text-blue small-font p5l">
                                              <ParkAccessStatus
                                                advisories={r.advisories}
                                              />
                                            </div>
                                          </div>
                                          <Link
                                            href={`/${r.slug}/`}
                                            className="p10t"
                                          >
                                            <h2 className="park-heading-text">
                                            {r.protectedAreaName}
                                            </h2>
                                          </Link>
                                        </div>
                                      </div>
                                      <div className="row pb20 p20l pr20">
                                        <div className="col-12 p0 align-center flex-display full-width">
                                          <div className="full-width">
                                            <Link
                                              href={`/${r.slug}/`}
                                              className="park-quick-link link"
                                            >
                                              Visit Park Page
                                            </Link>
                                          </div>
                                          <div className="divider-div align-center">
                                            <Divider
                                              orientation="vertical"
                                              className="vertical-divider align-center"
                                            />
                                          </div>
                                          <div className="full-width">
                                            <Link
                                              onClick={() =>
                                                setParkQuickView(r)
                                              }
                                              className="park-quick-link link"
                                              role="link"
                                              tabIndex="0"
                                            >
                                              Quick View
                                            </Link>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                </CardContent>
                              </Card>
                            </div>
                          ))}
                          <div className="small-flex-display p20t">
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
                                  of {totalResults}
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
                          <br />
                          <br />

                          <Dialog
                            open={openQuickView}
                            onClose={handleCloseQuickView}
                            aria-labelledby="park-quick-view-dialog"
                            className="park-quick-view-dialog"
                            fullScreen
                            fullWidth
                            scroll="paper"
                          >
                            <DialogContent className="park-quick-view-dialog-content">
                              <QuickView
                                park={currentPark}
                                activityItemsLabels={activityItemsLabels}
                                facilityItemsLabels={facilityItemsLabels}
                              ></QuickView>
                            </DialogContent>
                            <DialogActions className="d-block p20 background-blue">
                              <div className="row">
                                <div className="col-12 p0 align-center flex-display full-width">
                                  <div className="full-width">
                                    <Link
                                      href={`/${currentPark.slug}`}
                                      className="park-quick-link link-white"
                                    >
                                      Visit Park Page
                                    </Link>
                                  </div>
                                  <div className="divider-div align-center">
                                    <Divider
                                      orientation="vertical"
                                      className="vertical-divider align-center"
                                    />
                                  </div>
                                  <div className="full-width">
                                    <Link
                                      onClick={handleCloseQuickView}
                                      className="park-quick-link link-white"
                                      tabIndex="0"
                                      role="link"
                                    >
                                      Close Quick View
                                    </Link>
                                  </div>
                                </div>
                              </div>
                            </DialogActions>
                          </Dialog>
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
          activityItems,
          facilityItems,
          quickSearchFilters,
          openFilter,
          setOpenFilter,
          quickSearch,
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
      <Footer />
    </>
  )
}

export const Head = () => (
  <Seo title="Find a park" description="Search for the webpages of parks and protected areas across British Columbia. Get detailed information on camping and other activities at specific BC Parks." />
)
