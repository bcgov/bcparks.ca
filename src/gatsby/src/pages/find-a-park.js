import React, { useState, useEffect, useCallback, useMemo, useRef } from "react"
import { graphql, Link as GatsbyLink } from "gatsby"
import axios from "axios"
import { orderBy } from "lodash"
import {
  Chip,
  TextField,
  InputAdornment,
  Link,
  LinearProgress,
  Breadcrumbs,
  Button,
} from "@mui/material"
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from "@mui/icons-material/Search"
import CancelIcon from "@mui/icons-material/Cancel"
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import Footer from "../components/footer"
import Header from "../components/header"
import Seo from "../components/seo"
import ScrollToTop from "../components/scrollToTop"
import NoSearchResults from "../components/search/noSearchResults"
import MobileFilters from "../components/search/mobileFilters"
import DesktopFilters from "../components/search/desktopFilters"
import ParkLinksModal from "../components/search/parkLinksModal"

import "../styles/search.scss"
import ParkCard from "../components/search/parkCard"

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

export default function FindAPark({ location, data }) {
  const menuContent = data?.allStrapiMenu?.nodes || []

  const [regionsCount, setRegionsCount] = useState([])
  const [activitiesCount, setActivitiesCount] = useState([])
  const [facilitiesCount, setFacilitiesCount] = useState([])
  const [campingsCount, setCampingsCount] = useState([])

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
    .filter(facility => facility.isCamping).map(camping => {
      const filterCount = campingsCount?.find(
        campingCount => campingCount.key === camping.facilityNumber
      )?.doc_count || 0
      return {
        label: camping.facilityName,
        value: camping.facilityNumber,
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

  const searchApiUrl = `${data.site.siteMetadata.apiURL}/api/protected-areas/search`

  // event handlers
  const handleRegionCheck = (region, event) => {
    setCurrentPage(1)
    if (event.target.checked) {
      setSelectedRegions([...selectedRegions, region])
    } else {
      setSelectedRegions([
        ...selectedRegions.filter(r => r.value !== region.value),
      ])
    }
  }
  const handleCampingFacilityCheck = (camping, event) => {
    setCurrentPage(1)
    if (event.target.checked) {
      setSelectedCampingFacilities([...selectedCampingFacilities, camping])
    } else {
      setSelectedCampingFacilities([
        ...selectedCampingFacilities.filter(c => c.value !== camping.value),
      ])
    }
  }
  const handleActivityCheck = (activity, event) => {
    setCurrentPage(1)
    if (event.target.checked) {
      setSelectedActivities([...selectedActivities, activity])
    } else {
      setSelectedActivities([
        ...selectedActivities.filter(a => a.value !== activity.value),
      ])
    }
  }
  const handleFacilityCheck = (facility, event) => {
    setCurrentPage(1)
    if (event.target.checked) {
      setSelectedFacilities([...selectedFacilities, facility])
    } else {
      setSelectedFacilities([
        ...selectedFacilities.filter(f => f.value !== facility.value),
      ])
    }
  }

  const handleRegionDelete = chipToDelete => {
    setCurrentPage(1)
    setSelectedRegions(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
  }
  const handleCampingFacilityDelete = chipToDelete => {
    setCurrentPage(1)
    setSelectedCampingFacilities(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
  }
  const handleActivityDelete = chipToDelete => {
    setCurrentPage(1)
    setSelectedActivities(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
  }
  const handleFacilityDelete = chipToDelete => {
    setCurrentPage(1)
    setSelectedFacilities(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
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
      params.campings = selectedCampingFacilities.map(camping => camping.value)
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
    (params.campings && params.campings.length) ||
    params.typeCode

  useEffect(() => {
    setIsLoading(true)
    setFilters()
    axios.get(searchApiUrl, {
      params: { ...params, _start: 0, _limit: itemsPerPage },
    }).then(resultResponse => {
      if (resultResponse.status === 200) {
        const total = parseInt(resultResponse.data.meta.pagination.total, 10)
        const newResults = resultResponse.data.data
        setSearchResults(newResults);
        setTotalResults(total)
        setRegionsCount(resultResponse.data.meta.aggregations.regions.buckets)
        setActivitiesCount(resultResponse.data.meta.aggregations.activities.buckets)
        setFacilitiesCount(resultResponse.data.meta.aggregations.facilities.buckets)
        setCampingsCount(resultResponse.data.meta.aggregations.campings.buckets)
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
    searchApiUrl,
    setFilters,
    setSearchResults,
    setTotalResults,
  ])

  useEffect(() => {
    if (currentPage !== 1) {
      const pageStart = (currentPage - 1) * itemsPerPage
      axios.get(searchApiUrl, {
        params: { ...params, _start: pageStart, _limit: itemsPerPage },
      }).then(resultResponse => {
        if (resultResponse.status === 200) {
          const newResults = resultResponse.data.data
          setSearchResults(prevResults => [...prevResults, ...newResults]);
        }
      })
        .finally(() => {
          setIsLoading(false)
        })
    }
  }, [
    params,
    searchApiUrl,
    currentPage
  ])

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
                      <DesktopFilters
                        data={{
                          regionItems,
                          campingFacilityItems,
                          activityItems,
                          facilityItems,
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
                          setFilters,
                          handleRegionCheck,
                          handleCampingFacilityCheck,
                          handleActivityCheck,
                          handleFacilityCheck
                        }}
                      />
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
                            <ParkCard r={r} key={index} />
                          ))}
                          {totalResults > searchResults.length && (
                            <div className="load-more-button-container mt-5">
                              <Button
                                variant="outlined"
                                onClick={handleLoadMore}
                                className="bcgov-button bcgov-normal-white load-more-button"
                              >
                                Load more
                              </Button>
                            </div>)}
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
      <MobileFilters
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
          setFilters,
          handleRegionCheck,
          handleCampingFacilityCheck,
          handleActivityCheck,
          handleFacilityCheck
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