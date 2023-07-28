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
    allStrapiActivityType(
      filter: {isActive: {eq: true}}
    ) {
      totalCount
      nodes {
        strapi_id
        activityName
        activityCode
      }
    }
    allStrapiFacilityType(
      sort: {facilityName: ASC},
      filter: {isActive: {eq: true}}
    ) {
      totalCount
      nodes {
        strapi_id
        facilityName
        facilityCode
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
      className="mr-1"
      width={size}
      height={size}>
    </img>
  )
}

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

  const itemsPerPage = 10
  const iconSize = 32
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const [openFilter, setOpenFilter] = useState(false)
  const [openModal, setOpenModal] = useState(false)

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
      queryText: searchText,
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

    const countPromise = axios.get(`${apiUrl}/protected-areas/count`, {
      params,
    })
    const resultPromise = axios.get(`${apiUrl}/protected-areas`, {
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
                    <div className="col-12 pr-3 mb20">
                      <h3 className="subtitle">Filter</h3>
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
                                  className="ml-auto pointer p20"
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
                        <hr></hr>
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
                                  className="ml-auto pointer p20"
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
                        <GatsbyLink to="/parks">A–Z</GatsbyLink>,
                        <a
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
                                            <p>{locationLabel(r.parkLocation)}</p>
                                          </div>
                                          <div className="park-content-bottom">
                                            <div className="park-content-bottom--left">
                                              {r.parkFacilities.includes('vehicle-accessible-camping') &&
                                                <Icon src={campingIcon} label="Vehicle accesible camping" size={iconSize} />
                                              }
                                              {r.parkActivities.includes('hiking') &&
                                                <Icon src={hikingIcon} label="Hiking" size={iconSize} />
                                              }
                                              {r.parkFacilities.includes('picnic-areas') &&
                                                <Icon src={picincIcon} label="Picnic areas" size={iconSize} />
                                              }
                                              {r.parkActivities.includes('swimming') &&
                                                <Icon src={swimmingIcon} label="Swimming" size={iconSize} />
                                              }
                                              {r.parkActivities.includes('cycling') &&
                                                <Icon src={cyclingIcon} label="Cycling" size={iconSize} />
                                              }
                                              {r.parkActivities.includes('pets-on-leash') &&
                                                <Icon src={petsIcon} label="Pets on leash" size={iconSize} />
                                              }
                                              {r.parkFacilities.includes('vehicle-accessible-camping') ? (
                                                <GatsbyLink to={`/${r.slug}/#park-camping-details-container`}>
                                                  <p aria-label="See all facilities and activities">see all</p>
                                                </GatsbyLink>
                                              ) : (
                                                (r.parkActivities.length > 0 || r.parkFacilities.length > 0) && (
                                                  r.parkFacilities.length > 0 ? (
                                                    <GatsbyLink to={`/${r.slug}/#park-facility-container`}> 
                                                      <p aria-label="See all facilities and activities">see all</p>
                                                    </GatsbyLink>
                                                  ) : (
                                                    <GatsbyLink to={`/${r.slug}/#park-activity-container`}> 
                                                      <p aria-label="See all facilities and activities">see all</p>
                                                    </GatsbyLink>
                                                  )
                                                )
                                              )}
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
                                          <p>{locationLabel(r.parkLocation)}</p>
                                          <div>
                                            {r.parkFacilities.includes('vehicle-accessible-camping') &&
                                              <Icon src={campingIcon} label="Vehicle accesible camping" size={iconSize} />
                                            }
                                            {r.parkActivities.includes('hiking') &&
                                              <Icon src={hikingIcon} label="Hiking" size={iconSize} />
                                            }
                                            {r.parkFacilities.includes('picnic-areas') &&
                                              <Icon src={picincIcon} label="Picnic areas" size={iconSize} />
                                            }
                                            {r.parkActivities.includes('swimming') &&
                                              <Icon src={swimmingIcon} label="Swimming" size={iconSize} />
                                            }
                                            {r.parkActivities.includes('cycling') &&
                                              <Icon src={cyclingIcon} label="Cycling" size={iconSize} />
                                            }
                                            {r.parkActivities.includes('pets-on-leash') &&
                                              <Icon src={petsIcon} label="Pets on leash" size={iconSize} />
                                            }
                                            {r.parkFacilities.includes('vehicle-accessible-camping') ? (
                                              <GatsbyLink to={`/${r.slug}/#park-camping-details-container`}>
                                                <p aria-label="See all facilities and activities">see all</p>
                                              </GatsbyLink>
                                            ) : (
                                              (r.parkActivities.length > 0 || r.parkFacilities.length > 0) && (
                                                r.parkFacilities.length > 0 ? (
                                                  <GatsbyLink to={`/${r.slug}/#park-facility-container`}> 
                                                    <p aria-label="See all facilities and activities">see all</p>
                                                  </GatsbyLink>
                                                ) : (
                                                  <GatsbyLink to={`/${r.slug}/#park-activity-container`}> 
                                                    <p aria-label="See all facilities and activities">see all</p>
                                                  </GatsbyLink>
                                                )
                                              )
                                            )}
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
                          <br />
                          <br />
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
      <ParkLinksModal data={{openModal, setOpenModal}} />
      <Footer />
    </>
  )
}

export const Head = () => (
  <Seo title="Find a park" description="Search for the webpages of parks and protected areas across British Columbia. Get detailed information on camping and other activities at specific BC Parks." />
)