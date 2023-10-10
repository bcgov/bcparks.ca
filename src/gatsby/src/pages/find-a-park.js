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
  IconButton
} from "@mui/material"
import ClearIcon from '@mui/icons-material/Clear'
import SearchIcon from "@mui/icons-material/Search"
import CancelIcon from "@mui/icons-material/Cancel"
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useQueryParamString } from 'react-use-query-param-string';

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
    allStrapiSearchArea(
      sort: {rank: ASC},
    ) {
      nodes {
        searchAreaName
        strapi_id
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
      filter: {
        isActive: {eq: true},
        facilityCode: {ne: "wilderness-camping"}
      }
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

  const [areasCount, setAreasCount] = useState([])
  const [activitiesCount, setActivitiesCount] = useState([])
  const [facilitiesCount, setFacilitiesCount] = useState([])
  const [campingsCount, setCampingsCount] = useState([])

  const sortedActivityItems = orderBy(
    data.allStrapiActivityType.nodes,
    [activity => activity.activityName.toLowerCase()], ["asc"]
  )

  // filter items
  const areaItems = data.allStrapiSearchArea.nodes.map(area => {
    const filterCount = areasCount?.find(
      areaCount => areaCount.key === area.strapi_id
    )?.doc_count || 0
    return {
      label: area.searchAreaName,
      value: area.strapi_id,
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
  const [qsAreas, setQsAreas, qsAreasInitialized] = useQueryParamString("sa", "")
  const [qsCampingFacilities, setQsCampingFacilities, qsCampingsInitialized] = useQueryParamString("c", "")
  const [qsActivities, setQsActivities, qsActivitiesInitialized] = useQueryParamString("a", "")
  const [qsFacilities, setQsFacilities, qsFacilitiesInitialized] = useQueryParamString("f", "")

  const [selectedAreas, setSelectedAreas] = useState([])
  const [selectedCampingFacilities, setSelectedCampingFacilities] = useState([])
  const [selectedActivities, setSelectedActivities] = useState([])
  const [selectedFacilities, setSelectedFacilities] = useState([])
  const [searchText, setSearchText, searchTextInitialized] = useQueryParamString(
    "q", location.state?.searchText ? location.state.searchText : ""
  )
  const [inputText, setInputText] = useState("")

  const [filterSelections, setFilterSelections] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [totalResults, setTotalResults] = useState(0)

  const itemsPerPage = 10
  const [currentPage, setCurrentPage, currentPageInitialized] = useQueryParamString("p", 1)
  const [isLoading, setIsLoading] = useState(true)
  const [isKeyDownLoadingMore, setIsKeyDownLoadingMore] = useState(false)

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
  const handleAreaCheck = (area, event) => {
    setCurrentPage(1)
    if (event.target.checked) {
      setSelectedAreas([...selectedAreas, area])
    } else {
      setSelectedAreas([
        ...selectedAreas.filter(r => r.value !== area.value),
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

  const handleAreaDelete = chipToDelete => {
    setCurrentPage(1)
    setSelectedAreas(chips =>
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
    if (chipToDelete.type === "area") {
      handleAreaDelete(chipToDelete)
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
  const handleClickClear = () => {
    setInputText("")
    setCurrentPage(1)
    setSearchText("")
  }
  const handleKeyDownClear = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClickClear()
    }
  }
  const handleLoadMore = () => {
    const newPage = +currentPage + 1
    setCurrentPage(newPage)
    const pageStart = (newPage - 1) * itemsPerPage
    axios.get(searchApiUrl, {
      params: { ...params, _start: pageStart, _limit: itemsPerPage },
    }).then(resultResponse => {
      if (resultResponse.status === 200) {
        const newResults = resultResponse.data.data
        setSearchResults(prevResults => [...prevResults, ...newResults]);
      }
    })
  }

  const handleKeyDownLoadMore = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      setIsKeyDownLoadingMore(true);
      e.preventDefault()
      handleLoadMore()
    }
  }

  const handleClearFilter = () => {
    setFilterSelections([])
    setSelectedAreas([])
    setSelectedCampingFacilities([])
    setSelectedActivities([])
    setSelectedFacilities([])
  }
  const handleKeyDownClearFilter = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClearFilter()
    }
  }

  const setFilters = useCallback(() => {
    const filters = []
    selectedAreas.forEach(r => {
      filters.push({ ...r, type: "area" })
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
    selectedAreas,
    selectedCampingFacilities,
    selectedActivities,
    selectedFacilities,
  ])

  const shortenFilterLabel = (label) => {
    if (label.includes("-accessible camping")) {
      return label.replace("-accessible camping", "")
    } else if (label.includes("camping")) {
      return label.replace("camping", "")
    } else {
      return label
    }
  }

  const params = useMemo(() => {
    const params = {
      queryText: searchText,
    }
    if (selectedAreas.length > 0) {
      params.areas = selectedAreas.map(area => area.value)
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
    selectedAreas,
    selectedCampingFacilities,
    selectedActivities,
    selectedFacilities,
  ])

  const isActiveSearch =
    params.queryText ||
    (params.areas && params.areas.length) ||
    (params.activities && params.activities.length) ||
    (params.facilities && params.facilities.length) ||
    (params.campings && params.campings.length)

  const queryParamStateSyncComplete = () => {
    return currentPageInitialized
      && searchTextInitialized
      && qsCampingsInitialized
      && qsActivitiesInitialized
      && qsAreasInitialized
      && qsFacilitiesInitialized
      && Math.sign(qsCampingFacilities.length) === Math.sign(selectedCampingFacilities.length)
      && Math.sign(qsActivities.length) === Math.sign(selectedActivities.length)
      && Math.sign(qsAreas.length) === Math.sign(selectedAreas.length)
      && Math.sign(qsFacilities.length) === Math.sign(selectedFacilities.length);
  }

  useEffect(() => {
    if (queryParamStateSyncComplete()) {
      setIsLoading(true)
      setFilters()
      axios.get(searchApiUrl, {
        params: { ...params, _start: 0, _limit: currentPage * itemsPerPage },
      }).then(resultResponse => {
        if (resultResponse.status === 200) {
          const total = parseInt(resultResponse.data.meta.pagination.total, 10)
          const newResults = resultResponse.data.data
          setSearchResults(newResults);
          setTotalResults(total)
          setAreasCount(resultResponse.data.meta.aggregations.areas.buckets)
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
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    params,
    qsActivities,
    qsCampingFacilities,
    qsFacilities,
    qsAreas,
    searchTextInitialized,
    currentPageInitialized
  ])

  useEffect(() => {
    function arr(list) {
      return list.split("_").map(Number);
    }
    if (selectedActivities.length === 0 && qsActivities.length > 0) {
      setSelectedActivities(activityItems.filter(x => arr(qsActivities).includes(x.value)));
    }
    if (selectedCampingFacilities.length === 0 && qsCampingFacilities.length > 0) {
      setSelectedCampingFacilities(campingFacilityItems.filter(x => arr(qsCampingFacilities).includes(x.value)));
    }
    if (selectedFacilities.length === 0 && qsFacilities.length > 0) {
      setSelectedFacilities(facilityItems.filter(x => arr(qsFacilities).includes(x.value)));
    }
    if (selectedAreas.length === 0 && qsAreas.length > 0) {
      setSelectedAreas(areaItems.filter(x => arr(qsAreas).includes(x.value)));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    qsActivities,
    qsCampingFacilities,
    qsFacilities,
    qsAreas
  ])

  useEffect(() => {
    function qs(list) {
      return list.map(x => x.value).sort((a, b) => a - b).join("_");
    }
    const activities = qs(selectedActivities);
    if (qsActivities !== activities) {
      setQsActivities(activities);
    }
    const campingFacilities = qs(selectedCampingFacilities);
    if (qsCampingFacilities !== campingFacilities) {
      setQsCampingFacilities(campingFacilities);
    }
    const facilities = qs(selectedFacilities);
    if (qsFacilities !== facilities) {
      setQsFacilities(facilities);
    }
    const areas = qs(selectedAreas);
    if (qsAreas !== areas) {
      setQsAreas(areas);
    }
    setInputText(searchText)
    sessionStorage.setItem("lastSearch", window.location.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedActivities,
    selectedCampingFacilities,
    selectedFacilities,
    selectedAreas,
    searchText,
    currentPage
  ])

  useEffect(() => {
    // Focus the TextField element when the component mounts
    if (searchRef.current) {
      searchRef.current.focus();
    }
  }, [])

  useEffect(() => {
    if (isKeyDownLoadingMore) {
      const parkLinks = document.getElementsByClassName('desktop-park-link');
      if (parkLinks.length > itemsPerPage) {
        let firstNewIndex = Math.floor((parkLinks.length - 1) / itemsPerPage) * itemsPerPage;
        parkLinks[firstNewIndex].contentEditable = true;
        parkLinks[firstNewIndex].focus();
        parkLinks[firstNewIndex].contentEditable = false;
      }
      setIsKeyDownLoadingMore(false)
    }
  }, [searchResults])

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
                        focused={isLoading}
                        inputRef={searchRef}
                        onChange={event => {
                          setInputText(event.target.value)
                        }}
                        onKeyDown={ev => {
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
                              <IconButton
                                className="clear-icon-button"
                                onClick={handleClickClear}
                                onKeyDown={(e) => { handleKeyDownClear(e) }}
                                sx={{ visibility: inputText ? "visible" : "hidden" }}
                                aria-label="Clear search">
                                <ClearIcon className="clear-icon" />
                              </IconButton>
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
            <div className="search-results-list container d-block d-lg-none mt-3">
              <div className="row d-flex">
                <div className="col-12">
                  {filterSelections.length > 0 && filterSelections.map((f, index) => (
                    <Chip
                      key={index}
                      label={shortenFilterLabel(f.label)}
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
                      onKeyDown={e => handleKeyDownClearFilter(e)}
                      tabIndex="0"
                      role="button"
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
                  <div className="row no-gutters d-none d-lg-block">
                    <div className="col-12 mb32">
                      <div className="search-results-quick-filter">
                        <div className="row no-gutters">
                          <div className="col-12 park-search-text-box-container d-none d-lg-block">
                            <TextField
                              id="park-search-text"
                              variant="outlined"
                              placeholder="Park name"
                              className="park-search-text-box h50p"
                              value={inputText}
                              focused={isLoading}
                              inputRef={searchRef}
                              onChange={event => {
                                setInputText(event.target.value)
                              }}
                              onKeyDown={ev => {
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
                                    <IconButton
                                      className="clear-icon-button"
                                      onClick={handleClickClear}
                                      onKeyDown={(e) => { handleKeyDownClear(e) }}
                                      sx={{ visibility: inputText ? "visible" : "hidden" }}
                                      aria-label="Clear search">
                                      <ClearIcon className="clear-icon" />
                                    </IconButton>
                                  </InputAdornment>
                                ),
                                inputProps: {
                                  "aria-label": "Park search",
                                }
                              }}
                            />
                          </div>
                          <div className="m15t col-12 park-search-text-box-container d-none d-lg-block">
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
                          areaItems,
                          campingFacilityItems,
                          activityItems,
                          facilityItems,
                          selectedAreas,
                          setSelectedAreas,
                          selectedCampingFacilities,
                          setSelectedCampingFacilities,
                          selectedActivities,
                          setSelectedActivities,
                          selectedFacilities,
                          setSelectedFacilities,
                          searchText,
                          setCurrentPage,
                          setFilters,
                          handleAreaCheck,
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
                  <div className="row d-flex">
                    <div className="col-12 d-none d-lg-block">
                      {filterSelections.length > 0 && filterSelections.map((f, index) => (
                        <Chip
                          key={index}
                          label={shortenFilterLabel(f.label)}
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
                          onKeyDown={e => handleKeyDownClearFilter(e)}
                          tabIndex="0"
                          role="button"
                        >
                          Clear filters
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
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
                                onKeyDown={e => handleKeyDownLoadMore(e)}
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
          areaItems,
          campingFacilityItems,
          activityItems,
          facilityItems,
          openFilter,
          setOpenFilter,
          selectedAreas,
          setSelectedAreas,
          selectedCampingFacilities,
          setSelectedCampingFacilities,
          selectedActivities,
          setSelectedActivities,
          selectedFacilities,
          setSelectedFacilities,
          searchText,
          setCurrentPage,
          setFilters,
          handleAreaCheck,
          handleCampingFacilityCheck,
          handleActivityCheck,
          handleFacilityCheck,
          handleClearFilter
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