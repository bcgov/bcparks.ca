import React, { useState, useEffect, useCallback, useMemo } from "react"
import { graphql, Link as GatsbyLink } from "gatsby"
import axios from "axios"
import { orderBy } from "lodash"
import {
  Chip,
  Link,
  LinearProgress,
  Button,
} from "@mui/material"
import CancelIcon from "@mui/icons-material/Cancel"
import OpenInNewIcon from '@mui/icons-material/OpenInNew'
import { useQueryParamString } from 'react-use-query-param-string'

import Footer from "../components/footer"
import Header from "../components/header"
import Seo from "../components/seo"
import ScrollToTop from "../components/scrollToTop"
import NoSearchResults from "../components/search/noSearchResults"
import MobileFilters from "../components/search/mobileFilters"
import DesktopFilters from "../components/search/desktopFilters"
import ParkLinksModal from "../components/search/parkLinksModal"
import ParkCard from "../components/search/parkCard"
import ParkNameSearch from "../components/search/parkNameSearch"
import CityNameSearch from "../components/search/cityNameSearch"
import { useScreenSize } from "../utils/helpers"

import "../styles/search.scss"

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
    allStrapiSearchCity(
      sort: {rank: ASC},
      filter: {rank: {lte: 4}}
    ) {
      nodes {
        strapi_id
        cityName
        latitude
        longitude
        rank
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
  // useState and constants
  const menuContent = data?.allStrapiMenu?.nodes || []
  const searchCities = data?.allStrapiSearchCity?.nodes || []
  const searchApiUrl = `${data.site.siteMetadata.apiURL}/api/protected-areas/search`

  const [areasCount, setAreasCount] = useState([])
  const [activitiesCount, setActivitiesCount] = useState([])
  const [facilitiesCount, setFacilitiesCount] = useState([])
  const [campingsCount, setCampingsCount] = useState([])

  // constants - filter items
  const sortedActivityItems = orderBy(
    data.allStrapiActivityType.nodes,
    [activity => activity.activityName.toLowerCase()], ["asc"]
  )
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
  // constants - filter labels
  const activityItemsLabels = {}
  activityItems.forEach(item => {
    activityItemsLabels[item.value] = item.label
  })
  const facilityItemsLabels = {}
  facilityItems.forEach(item => {
    facilityItemsLabels[item.value] = item.label
  })

  // useState - selected filter items state
  const [qsAreas, setQsAreas, qsAreasInitialized] = useQueryParamString("sa", "")
  const [qsCampingFacilities, setQsCampingFacilities, qsCampingsInitialized] = useQueryParamString("c", "")
  const [qsActivities, setQsActivities, qsActivitiesInitialized] = useQueryParamString("a", "")
  const [qsFacilities, setQsFacilities, qsFacilitiesInitialized] = useQueryParamString("f", "")
  const [qsLocation, setQsLocation, qsLocationInitialized] = useQueryParamString(
    "l", location.state?.qsLocation ? location.state.qsLocation : "")
  const [searchText, setSearchText, searchTextInitialized] = useQueryParamString(
    "q", location.state?.searchText ? location.state.searchText : ""
  )
  const [qsCity, setQsCity] = useState(location.state?.qsCity ? location.state.qsCity : [])

  const [selectedAreas, setSelectedAreas] = useState([])
  const [selectedCampingFacilities, setSelectedCampingFacilities] = useState([])
  const [selectedActivities, setSelectedActivities] = useState([])
  const [selectedFacilities, setSelectedFacilities] = useState([])
  const [selectedCity, setSelectedCity] = useState([])
  const [inputText, setInputText] = useState("")

  const [filterSelections, setFilterSelections] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [totalResultsWithinFifty, setTotalResultsWithinFifty] = useState(0)

  const itemsPerPage = 10
  const [currentPage, setCurrentPage, currentPageInitialized] = useQueryParamString("p", 1)
  const [isLoading, setIsLoading] = useState(true)
  const [isCityNameLoading, setIsCityNameLoading] = useState(false)
  const [isKeyDownLoadingMore, setIsKeyDownLoadingMore] = useState(false)

  const [openFilter, setOpenFilter] = useState(false)
  const [openModal, setOpenModal] = useState(false)

  const [currentLocation, setCurrentLocation] = useState({
    strapi_id: 0,
    cityName: "Current location",
    latitude: 0,
    longitude: 0,
    rank: 1
  })

  // event handlers
  // event handlers - for filters
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
  // event handlers - for searching
  const handleSearch = () => {
    setCurrentPage(1)
    if (searchText === "") {
      setSearchText(inputText)
    }
  }
  const handleKeyDownSearchPark = (e) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleSearch()
    }
  }
  const handleSearchNameChange = (selected) => {
    if (selected.length) {
      setSearchText(selected[0]?.protectedAreaName)
    }
  }
  const handleSearchNameInputChange = (text) => {
    setInputText(text)
  }
  const handleClickClearPark = () => {
    setCurrentPage(1)
    setInputText("")
    setSearchText("")
  }
  const handleClickClearCity = () => {
    setCurrentPage(1)
    setSelectedCity([])
    setQsLocation("")
    setQsCity([])
  }
  const handleKeyDownClearPark = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClickClearPark()
    }
  }
  const handleKeyDownClearCity = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClickClearCity()
    }
  }
  // event handlers - for loading
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
  // event handlers - for opening modals
  const handleClickOpenFilter = () => {
    setOpenFilter(true)
  }
  const handleClickOpenModal = () => {
    setOpenModal(true)
  }

  // functions
  const showPosition = (position) => {
    setCurrentLocation(currentLocation => ({
      ...currentLocation,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }))
  }
  const hasParksWithinFifty = (results) => {
    const newResults = results.filter(r => r.distance <= 50)
    return newResults.length > 0
  }
  const hasParksWithinOneHundred = (results) => {
    const newResults = results.filter(r => r.distance > 50)
    return newResults.length > 0
  }
  const shortenFilterLabel = (label) => {
    if (label.includes("-accessible camping")) {
      return label.replace("-accessible camping", "")
    } else if (label.includes("camping")) {
      return label.replace("camping", "")
    } else {
      return label
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

  // params
  const params = useMemo(() => {
    const params = {
      queryText: searchText,
      near: selectedCity.length > 0 ?
        `${selectedCity[0].latitude},${selectedCity[0].longitude}` : "0,0",
      radius: 100
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
    selectedCity,
    selectedAreas,
    selectedCampingFacilities,
    selectedActivities,
    selectedFacilities,
  ])

  const queryParamStateSyncComplete = () => {
    return currentPageInitialized
      && searchTextInitialized
      && qsLocationInitialized
      && qsCampingsInitialized
      && qsActivitiesInitialized
      && qsAreasInitialized
      && qsFacilitiesInitialized
      && Math.sign(qsCampingFacilities.length) === Math.sign(selectedCampingFacilities.length)
      && Math.sign(qsActivities.length) === Math.sign(selectedActivities.length)
      && Math.sign(qsAreas.length) === Math.sign(selectedAreas.length)
      && Math.sign(qsFacilities.length) === Math.sign(selectedFacilities.length);
  }

  // useEffect
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
      }).finally(() => {
        setIsLoading(false)
      })
      // get total number of results within 50 km
      axios.get(searchApiUrl, {
        params: { ...params, radius: 50, _start: 0, _limit: 0 },
      }).then(resultResponse => {
        if (resultResponse.status === 200) {
          const total = parseInt(resultResponse.data.meta.pagination.total, 10)
          setTotalResultsWithinFifty(total)
        } else {
          setTotalResultsWithinFifty(0)
        }
      }).finally(() => {
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
    qsLocationInitialized,
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
    if (qsLocation !== "0") {
      setSelectedCity(searchCities.filter(city =>
        city.strapi_id.toString() === qsLocation
      ))
    }
    if (qsLocation === "0") {
      setIsCityNameLoading(true)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition)
      } else {
        console.log("Geolocation is not supported by your browser")
      }
    }
    sessionStorage.setItem("lastSearch", window.location.search);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    selectedActivities,
    selectedCampingFacilities,
    selectedFacilities,
    selectedAreas,
    searchText,
    qsLocation,
    currentPage
  ])

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
  }, [isKeyDownLoadingMore, searchResults])

  useEffect(() => {
    if (searchText) {
      handleSearch()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText])

  useEffect(() => {
    if (selectedCity.length > 0) {
      if (selectedCity[0].latitude !== 0 && selectedCity[0].longitude !== 0) {
        setIsCityNameLoading(false)
        setQsLocation(selectedCity[0].strapi_id.toString())
      }
      if (selectedCity[0].latitude === 0 || selectedCity[0].longitude === 0) {
        setIsCityNameLoading(true)
      }
    } else {
      setIsCityNameLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity])

  useEffect(() => {
    if (qsCity.length > 0) {
      setSelectedCity(qsCity)
    }
  }, [qsCity])

  useEffect(() => {
    if (currentLocation.latitude !== 0 || currentLocation.longitude !== 0) {
      setSelectedCity([currentLocation])
    }
  }, [currentLocation])

  return (
    <>
      <Header content={menuContent} />
      <ScrollToTop />
      {/* new search header section */}
      <div className="search-header">
        <div className="container">
          <div className="row no-gutters w-100">
            <div className="search-header-container--left col-12 col-lg-3">
              <h1>Find a park</h1>
            </div>
            <div className="search-header-container--right col-12 col-lg-9">
              <ParkNameSearch
                optionLimit={useScreenSize().width > 767 ? 7 : 4}
                searchText={inputText}
                handleChange={handleSearchNameChange}
                handleInputChange={handleSearchNameInputChange}
                handleKeyDownSearch={handleKeyDownSearchPark}
                handleClick={handleClickClearPark}
                handleKeyDown={handleKeyDownClearPark}
              />
              <span className="or-span">or</span>
              <CityNameSearch
                isCityNameLoading={isCityNameLoading}
                showPosition={showPosition}
                currentLocation={currentLocation}
                optionLimit={useScreenSize().width > 767 ? 7 : 4}
                selectedItems={qsCity.length > 0 ? qsCity : selectedCity}
                setSelectedItems={setSelectedCity}
                handleChange={setSelectedCity}
                handleClick={handleClickClearCity}
                handleKeyDown={handleKeyDownClearCity}
              />
              <Button
                className="bcgov-normal-blue mobile-search-element-height h50p"
                onClick={handleSearch}
              >
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>
      {/* main content */}
      <div id="sr-content" className="search-body">
        <div className="search-results-main container">
          {/* filter buttons for mobile */}
          <div className="search-results-list d-block d-lg-none">
            <div className="row">
              <div className="col-12 col-md-6">
                <Button
                  variant="outlined"
                  onClick={handleClickOpenFilter}
                  className="bcgov-button bcgov-normal-white font-weight-bold"
                >
                  Filter
                </Button>
              </div>
              <div className="col-12 col-md-6">
                <Button
                  variant="outlined"
                  onClick={handleClickOpenModal}
                  className="bcgov-button bcgov-normal-white font-weight-bold mt-3 mt-md-0"
                >
                  More ways to find a park
                </Button>
              </div>
            </div>
          </div>
          {/* filter chips for mobile */}
          <div className="search-results-list d-block d-lg-none mt-3">
            <div className="row">
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
            {/* filter checkbox for desktop */}
            <div className="search-results-quick-filter col-12 col-lg-3 d-none d-lg-block pr-3">
              <div className="mb32">
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
              <div className="park-links">
                <h3 className="subtitle mb-2">More ways to find a park</h3>
                <div>
                  <GatsbyLink to="/find-a-park/a-z-list">A–Z park list</GatsbyLink>
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
            {/* park results */}
            <div className="col-12 col-lg-9">
              <div className="search-results-list">
                {/* park results text */}
                <p className="result-count-text sm-p10">
                  {(isLoading || isCityNameLoading) && <>Searching...</>}
                  {(!isLoading && !isCityNameLoading) && (
                    <>
                      <b>
                        {selectedCity.length > 0 &&
                          (selectedCity[0].latitude !== 0 && selectedCity[0].longitude !== 0) &&
                          hasParksWithinFifty(searchResults) ?
                          totalResultsWithinFifty : totalResults
                        }
                      </b>
                      {totalResults === 1 ? " result" : " results"}
                      {searchText &&
                        <> containing <b>‘{searchText}’</b></>
                      }
                      {selectedCity.length > 0 &&
                        (selectedCity[0].latitude !== 0 && selectedCity[0].longitude !== 0) &&
                        <>
                          {" "}within{" "}
                          <b>{hasParksWithinFifty(searchResults) ? 50 : 100} km </b>
                          radius of <b>{selectedCity[0].cityName}</b>
                        </>
                      }
                    </>
                  )}
                </p>
                {/* filter chips for desktop */}
                <div className="d-none d-lg-block">
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
              <div className="search-results-list">
                {(isLoading || isCityNameLoading) && (
                  <div className="container mt-5">
                    <LinearProgress />
                  </div>
                )}
                {(!isLoading && !isCityNameLoading) && (
                  <>
                    {!searchResults ||
                      (searchResults.length === 0 && (
                        <NoSearchResults
                          hasPark={inputText.length > 0}
                          hasCity={selectedCity.length > 0}
                          hasFilter={filterSelections.length > 0}
                          handleClickClearCity={handleClickClearCity}
                          handleKeyDownClearCity={handleKeyDownClearCity}
                          handleClickClearPark={handleClickClearPark}
                          handleKeyDownClearPark={handleKeyDownClearPark}
                          handleClickClearFilter={handleClearFilter}
                          handleKeyDownClearFilter={handleKeyDownClearFilter}
                        />
                      ))}
                    {/* park results cards */}
                    {searchResults && searchResults.length > 0 && (
                      <>
                        {selectedCity.length > 0 &&
                          (selectedCity[0].latitude !== 0 && selectedCity[0].longitude !== 0) ? (
                          <>
                            {searchResults.filter(r => r.distance <= 50).map((r, index) => (
                              <ParkCard r={r} key={index} />
                            ))}
                            {(hasParksWithinFifty(searchResults) && hasParksWithinOneHundred(searchResults)) &&
                              <h4 className="more-result-text">
                                More results within 100 km radius
                              </h4>
                            }
                            {searchResults.filter(r => r.distance > 50).map((r, index) => (
                              <ParkCard r={r} key={index} />
                            ))}
                          </>
                        ) : (
                          searchResults.map((r, index) => (
                            <ParkCard r={r} key={index} />
                          ))
                        )}
                        <div className="load-more-button-container mt32">
                          {totalResults > searchResults.length && (
                            <Button
                              variant="outlined"
                              onClick={handleLoadMore}
                              onKeyDown={e => handleKeyDownLoadMore(e)}
                              className="bcgov-button bcgov-normal-white load-more-button"
                            >
                              Load more
                            </Button>
                          )}
                          {totalResults === searchResults.length && (
                            <p className="mb-0">End of results</p>
                          )}
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