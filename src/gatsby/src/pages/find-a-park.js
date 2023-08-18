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
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from "@mui/icons-material/Search"
import CancelIcon from "@mui/icons-material/Cancel"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
import ExpandCircleDownIcon from '@mui/icons-material/ExpandCircleDown'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import Carousel from "react-material-ui-carousel"

import Footer from "../components/footer"
import Header from "../components/header"
import Seo from "../components/seo"
import ScrollToTop from "../components/scrollToTop"
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
    allStrapiRegion(
      sort: {regionName: ASC},
    ) {
      nodes {
        regionName
        regionNumber
      }
    }
    allStrapiActivityType(
      sort: {activityName: ASC},
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
        <GatsbyLink to={`/${park.slug}/#park-camping-details-container`}>
          <p aria-label="See all facilities and activities">see all</p>
        </GatsbyLink>
      ) : (
        (activities.length > 0 || facilities.length > 0) && (
          facilities.some(x => x.code === 'picnic-areas') ? (
            <GatsbyLink to={`/${park.slug}/#park-facility-container`}>
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

const Filter = ({ filterItems, selectedFilterItems, handleFilterCheck }) => {
  return (
    <FormGroup className="filter-options-container">
      {filterItems.map(item =>
        <FormControlLabel
          key={item.label}
          control={
            <Checkbox
              checked={
                selectedFilterItems.filter(
                  selectedFilterItem =>
                    selectedFilterItem.value === item.value
                ).length === 1 ? true : false
              }
              onChange={event => {
                handleFilterCheck(item, event)
              }}
              name={item.label}
            />
          }
          label={`${item.label} (${item.count})`}
          className={
            selectedFilterItems.filter(
              selectedFilterItem =>
                selectedFilterItem.value === item.value
            ).length === 1 ? "text-light-blue no-wrap" : "no-wrap"
          }
          disabled={item.count === 0}
        />
      )}
    </FormGroup>
  )
}

export default function FindAPark({ location, data }) {
  const menuContent = data?.allStrapiMenu?.nodes || []

  const [regionsCount, setRegionsCount] = useState([])
  const [activitiesCount, setActivitiesCount] = useState([])
  const [facilitiesCount, setFacilitiesCount] = useState([])
  const [showMoreActivities, setMoreActivites] = useState(true)
  const [showMoreFacilities, setMoreFacilities] = useState(true)
  const [truncatedActivityFilterLength, setTruncatedActivityFilterLength] = useState(5)
  const [truncatedFacilityFilterLength, setTruncatedFacilityFilterLength] = useState(5)

  const sortedActivityItems = orderBy(
    data.allStrapiActivityType.nodes,
    [activity => activity.activityName.toLowerCase()], ["asc"]
  )

  // filter items
  const regionItems = data.allStrapiRegion.nodes.map(region => {
    const filterCount = regionsCount?.find(
      regionCount => regionCount.key === region.regionNumber
    )?.doc_count || 0
    return {
      label: region.regionName,
      value: region.regionNumber,
      count: filterCount
    }
  })
  const campingFacilityItems = data.allStrapiFacilityType.nodes
    .filter(facility => facility.isCamping).map(facility => {
      const filterCount = facilitiesCount?.find(
        facilityCount => facilityCount.key === facility.facilityNumber
      )?.doc_count || 0
      return {
        label: facility.facilityName,
        value: facility.facilityNumber,
        count: filterCount
      }
    })
  const activityItems = sortedActivityItems.map(activity => {
    const filterCount = activitiesCount?.find(
      activityCount => activityCount.key === activity.activityNumber
    )?.doc_count || 0
    return {
      label: activity.activityName,
      value: activity.activityNumber,
      count: filterCount
    }
  })
  const facilityItems = data.allStrapiFacilityType.nodes
    .filter(facility => !facility.isCamping).map(facility => {
      const filterCount = facilitiesCount?.find(
        facilityCount => facilityCount.key === facility.facilityNumber
      )?.doc_count || 0
      return {
        label: facility.facilityName,
        value: facility.facilityNumber,
        count: filterCount
      }
    })

  const activityItemsLabels = {}
  activityItems.forEach(item => {
    activityItemsLabels[item.value] = item.label
  })
  const facilityItemsLabels = {}
  facilityItems.forEach(item => {
    facilityItemsLabels[item.value] = item.label
  })

  // selected filter items state
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
  const [totalResults, setTotalResults] = useState(0)

  const itemsPerPage = 10
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

  // event handlers
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
  const handleActivityCheck = (activity, event) => {
    if (event.target.checked) {
      setSelectedActivities([...selectedActivities, activity])
    } else {
      setSelectedActivities([
        ...selectedActivities.filter(a => a.value !== activity.value),
      ])
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
      setCurrentPage(1)
    }
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
  const handleLoadMore = () => {
    setCurrentPage(currentPage + 1)
  }

  const handleClearFilter = () => {
    setFilterSelections([])
    setSelectedRegions([])
    setSelectedCampingFacilities([])
    setSelectedActivities([])
    setSelectedFacilities([])
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
    setFilterSelections([...filters])
  }, [
    selectedRegions,
    selectedCampingFacilities,
    selectedActivities,
    selectedFacilities,
  ])

  const params = useMemo(() => {
    const params = {
      queryText: searchText,
    }
    if (selectedRegions.length > 0) {
      params.regions = selectedRegions.map(region => region.value)
    }
    if (selectedCampingFacilities.length > 0) {
      params.facilities = selectedCampingFacilities.map(camping => camping.value)
    }
    if (selectedActivities.length > 0) {
      params.activities = selectedActivities.map(activity => activity.value)
    }
    if (selectedFacilities.length > 0) {
      params.facilities = selectedFacilities.map(facility => facility.value)
    }
    return params
  }, [
    searchText,
    selectedRegions,
    selectedCampingFacilities,
    selectedActivities,
    selectedFacilities,
  ])

  const isActiveSearch =
    params.queryText ||
    (params.regions && params.regions.length) ||
    (params.activities && params.activities.length) ||
    (params.facilities && params.facilities.length) ||
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
        const newResults = resultResponse.data.data
        setSearchResults(prevResults => [...prevResults, ...newResults]);
        setTotalResults(total)
        setRegionsCount(resultResponse.data.meta.aggregations.regions.buckets)
        setActivitiesCount(resultResponse.data.meta.aggregations.activities.buckets)
        setFacilitiesCount(resultResponse.data.meta.aggregations.facilities.buckets)
      } else {
        setSearchResults([])
        setTotalResults(0)
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
    setSearchResults,
    setTotalResults,
  ])

  useEffect(() => {
    if (showMoreActivities) {
      setTruncatedActivityFilterLength(5)
    } else {
      setTruncatedActivityFilterLength(activityItems.length)
    }
    if (showMoreFacilities) {
      setTruncatedFacilityFilterLength(5)
    } else {
      setTruncatedFacilityFilterLength(facilityItems.length)
    }
  }, [showMoreActivities, activityItems.length, showMoreFacilities, facilityItems.length])

  return (
    <>
      <Header content={menuContent} />
      <ScrollToTop />
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
              <div className="col-12 col-lg-3">
                <h1 className="headline-text p40t sm-p10">
                  Find a park
                </h1>
              </div>
              <div className="col-12 col-lg-9 d-flex align-items-end">
                <p className="result-count-text sm-p10">
                  <b>
                    {isLoading && isActiveSearch && <>Searching...</>}
                    {!isLoading && isActiveSearch && (
                      <>
                        {totalResults}{" "}
                        {totalResults === 1 ? " result" : " results"}
                      </>
                    )}
                  </b>
                </p>
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
                  <div className="row d-flex">
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
                      {filterSelections.length > 0 && (
                        <Link
                          className="clear-filter-link"
                          onClick={handleClearFilter}
                          tabIndex="0"
                          role="link"
                        >
                          Clear filters
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-lg-9 col-md-12 col-sm-12">
                <div className="search-results-quick-filter d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none mt-3">
                  <div className="row no-gutters">
                    <div className="col-12 col-md-9">
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
                          endAdornment: (
                            <InputAdornment position="end">
                              <ClearIcon
                                className="clear-icon"
                                onClick={() => setInputText("")}
                                sx={{ visibility: inputText ? "visible" : "hidden" }}
                              />
                            </InputAdornment>
                          ),
                          inputProps: {
                            "aria-label": "Park search",
                          }
                        }}
                      />
                    </div>
                    <div className="col-md-3 d-none d-md-block pl-3">
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
                </div>
                <div className="search-results-list container">
                  <div className="row">
                    <div className="col-md-4 col-sm-12 col-xs-12 mt-3 d-block d-md-none">
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
                    <div className="col-md-6 col-sm-12 col-xs-12 mt-3">
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
                    <div className="col-md-6 col-sm-12 col-xs-12 mt-3">
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
            <div className="search-results-list container d-block d-lg-none mt-3" ref={searchRef}>
              <div className="row d-flex">
                <div className="col-12">
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
                  {filterSelections.length > 0 && (
                    <Link
                      className="clear-filter-link"
                      onClick={handleClearFilter}
                      tabIndex="0"
                      role="link"
                    >
                      Clear filters
                    </Link>
                  )}
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-lg-3 col-md-12 col-sm-12">
                <div className="search-results-quick-filter">
                  <div className="row no-gutters d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                    <div className="col-12 mb32">
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
                                endAdornment: (
                                  <InputAdornment position="end">
                                    <ClearIcon
                                      className="clear-icon"
                                      onClick={() => setInputText("")}
                                      sx={{ visibility: inputText ? "visible" : "hidden" }}
                                    />
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
                      <h3 className="subtitle mb-2">Filter</h3>
                      <div className="">
                        <fieldset className="mb-2">
                          <legend className="filter-heading p10t">Popular</legend>
                          <Filter
                            filterItems={campingFacilityItems.filter(
                              c => c.value === 36 || c.value === 1
                            )}
                            selectedFilterItems={selectedCampingFacilities}
                            handleFilterCheck={handleCampingFacilityCheck}
                          />
                          <Filter
                            filterItems={activityItems.filter(
                              a => a.value === 1 || a.value === 3 || a.value === 8 || a.value === 9
                            )}
                            selectedFilterItems={selectedActivities}
                            handleFilterCheck={handleActivityCheck}
                          />
                          <Filter
                            filterItems={facilityItems.filter(f => f.value === 6)}
                            selectedFilterItems={selectedFacilities}
                            handleFilterCheck={handleFacilityCheck}
                          />
                        </fieldset>
                        <fieldset className="mb-2">
                          <legend className="filter-heading">Regions</legend>
                          <Filter
                            filterItems={regionItems}
                            selectedFilterItems={selectedRegions}
                            handleFilterCheck={handleRegionCheck}
                          />
                        </fieldset>
                        <fieldset className="mb-2">
                          <legend className="filter-heading">Camping</legend>
                          <Filter
                            filterItems={campingFacilityItems}
                            selectedFilterItems={selectedCampingFacilities}
                            handleFilterCheck={handleCampingFacilityCheck}
                          />
                        </fieldset>
                        <fieldset className="mb-2">
                          <legend className="filter-heading">Activities</legend>
                          <Filter
                            filterItems={activityItems.slice(0, truncatedActivityFilterLength)}
                            selectedFilterItems={selectedActivities}
                            handleFilterCheck={handleActivityCheck}
                          />
                          <Link
                            className="ml-auto pointer"
                            onClick={() => {
                              setMoreActivites(!showMoreActivities)
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
                        </fieldset>
                        <fieldset>
                          <legend className="filter-heading">Facilities</legend>
                          <Filter
                            filterItems={facilityItems.slice(0, truncatedFacilityFilterLength)}
                            selectedFilterItems={selectedFacilities}
                            handleFilterCheck={handleFacilityCheck}
                          />
                          <Link
                            className="ml-auto pointer"
                            onClick={() => {
                              setMoreFacilities(!showMoreFacilities)
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
                        </fieldset>
                      </div>
                    </div>
                    <div className="col-12 park-links">
                      <h3 className="subtitle mb-2">More ways to find a park</h3>
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
                                              <FeatureIcons park={r} />
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
                          <div className="load-more-button-container mt-5">
                            <Button
                              variant="outlined"
                              onClick={handleLoadMore}
                              className="bcgov-button bcgov-normal-white load-more-button"
                            >
                              Load more
                            </Button>
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
          totalResults,
          regionItems,
          campingFacilityItems,
          activityItems,
          facilityItems,
          openFilter,
          setOpenFilter,
          selectedRegions,
          setSelectedRegions,
          selectedCampingFacilities,
          setSelectedCampingFacilities,
          selectedActivities,
          setSelectedActivities,
          selectedFacilities,
          setSelectedFacilities,
          searchText,
          setCurrentPage,
        }}
      />
      <ParkLinksModal data={{ openModal, setOpenModal }} />
      <Footer />
    </>
  )
}

export const Head = () => (
  <Seo title="Find a park" description="Search for the webpages of parks and protected areas across British Columbia. Get detailed information on camping and other activities at specific BC Parks." />
)