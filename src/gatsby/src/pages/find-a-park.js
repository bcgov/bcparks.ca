import React, { useState, useEffect, useCallback, useMemo } from "react"
import { graphql, Link as GatsbyLink } from "gatsby"
import axios from "axios"
import { orderBy } from "lodash"
import ProgressBar from "react-bootstrap/ProgressBar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleXmark, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
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
  const [qsLocation, setQsLocation, qsLocationInitialized] = useQueryParamString("l", "")
  const [searchText, setSearchText, searchTextInitialized] = useQueryParamString(
    "q", location.state?.searchText ? location.state.searchText : ""
  )
  const [selectedAreas, setSelectedAreas] = useState([])
  const [selectedCampingFacilities, setSelectedCampingFacilities] = useState([])
  const [selectedActivities, setSelectedActivities] = useState([])
  const [selectedFacilities, setSelectedFacilities] = useState([])
  const [selectedCity, setSelectedCity] = useState(location.state?.selectedCity ? location.state.selectedCity : [])
  const [inputText, setInputText] = useState("")
  const [cityText, setCityText] = useState("")

  const [filterSelections, setFilterSelections] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [totalResults, setTotalResults] = useState(0)
  const [totalResultsWithinFifty, setTotalResultsWithinFifty] = useState(0)

  const itemsPerPage = 10
  const [currentPage, setCurrentPage, currentPageInitialized] = useQueryParamString("p", 1)
  const [isLoading, setIsLoading] = useState(true)
  const [acquiringGeolocation, setAcquiringGeolocation] = useState(false)
  const [isKeyDownLoadingMore, setIsKeyDownLoadingMore] = useState(false)

  const [openFilter, setOpenFilter] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [hasPermission, setHasPermission] = useState(false)

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
  const handleSearch = (clickedCity) => {
    setCurrentPage(1)
    if (searchText === "" || (inputText && (searchText !== inputText))) {
      setSearchText(inputText)
    }
    if (clickedCity?.length > 0) {
      setSelectedCity(clickedCity)
    } else if (cityText.length > 0) {
      const enteredCity = searchCities.filter(city =>
        city.cityName.toLowerCase() === cityText.toLowerCase())
      if (enteredCity.length > 0) {
        setSelectedCity(enteredCity)
      }
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
      setInputText(selected[0]?.protectedAreaName)
    }
  }
  const handleSearchNameInputChange = (text) => {
    setInputText(text)
    if (text === "") {
      setSearchText("")
    }
  }
  const handleCityNameInputChange = (text) => {
    setCityText(text)
    // clear all city states if text field is cleared
    if (text === "") {
      handleClickClearCity()
    }
  }
  const handleClickClearPark = () => {
    setCurrentPage(1)
    setInputText("")
    setSearchText("")
  }
  const handleClickClearCity = () => {
    setCurrentPage(1)
    setCityText("")
    setSelectedCity([])
    setQsLocation(undefined)
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
    setHasPermission(true)
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

  // bulid the params object (args used for REST queries)
  const params = useMemo(() => {
    const params = {};
    if (searchText) {
      params.queryText = searchText;
    }
    if (selectedCity.length) {
      const city = selectedCity[0];
      if (city.latitude !== 0 || city.longitude !== 0) {
        params.near = `${city.latitude},${city.longitude}`;
        params.radius = 100;
      }
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
    const hasCity = selectedCity.length > 0 && (selectedCity[0].latitude !== 0 || selectedCity[0].longitude !== 0);
    return currentPageInitialized
      && searchTextInitialized
      && qsLocationInitialized
      && qsCampingsInitialized
      && qsActivitiesInitialized
      && qsAreasInitialized
      && qsFacilitiesInitialized
      && (hasCity || !qsLocation)
      && Math.sign(qsCampingFacilities.length) === Math.sign(selectedCampingFacilities.length)
      && Math.sign(qsActivities.length) === Math.sign(selectedActivities.length)
      && Math.sign(qsAreas.length) === Math.sign(selectedAreas.length)
      && Math.sign(qsFacilities.length) === Math.sign(selectedFacilities.length);
  }

  // useEffect

  // makes REST calls and refreshes the page as the use adds and removes filters
  useEffect(() => {
    if (queryParamStateSyncComplete()) {
      setIsLoading(true)
      setFilters()
      // first Axios request
      const request1 = axios.get(searchApiUrl, {
        params: { ...params, _start: 0, _limit: currentPage * itemsPerPage },
      })
      // second Axios request
      let request2 = null;
      if (selectedCity.length) {
        request2 = axios.get(searchApiUrl, {
          params: { ...params, radius: 50, _start: 0, _limit: 0 },
        })
      }
      Promise.all([request1, request2])
        .then(([resultResponse1, resultResponse2]) => {
          if (resultResponse1.status === 200) {
            const total = parseInt(resultResponse1.data.meta.pagination.total, 10)
            const newResults = resultResponse1.data.data
            setSearchResults(newResults);
            setTotalResults(total)
            setAreasCount(resultResponse1.data.meta.aggregations.areas.buckets)
            setActivitiesCount(resultResponse1.data.meta.aggregations.activities.buckets)
            setFacilitiesCount(resultResponse1.data.meta.aggregations.facilities.buckets)
            setCampingsCount(resultResponse1.data.meta.aggregations.campings.buckets)
          } else {
            setSearchResults([])
            setTotalResults(0)
          }
          if (request2 && resultResponse2.status === 200) {
            const total = parseInt(resultResponse2.data.meta.pagination.total, 10)
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
    qsLocation,
    searchTextInitialized,
    currentPageInitialized
  ])

  // apply querystring state to complex state objects
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
    if (qsLocation && qsLocation !== "0") {
      const selectedCities = searchCities.filter(city => city.strapi_id.toString() === qsLocation)
      if (!selectedCities.length) {
        setQsLocation(undefined)
      }
      setSelectedCity(selectedCities)
    }
    if (qsLocation === "0") {
      setAcquiringGeolocation(true)
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition, () => {
          setAcquiringGeolocation(false)
          setQsLocation(undefined)
          setSelectedCity([])
        }, { maximumAge: 600000 })
      } else {
        setAcquiringGeolocation(false);
        console.log("Geolocation is not supported by your browser")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    qsActivities,
    qsCampingFacilities,
    qsFacilities,
    qsAreas,
    qsLocation
  ])

  // save changes made to complex state objects into the querystring
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
    if (searchText) {
      setInputText(searchText)
    }
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
      if (selectedCity[0].latitude === 0 || selectedCity[0].longitude === 0) {
        setAcquiringGeolocation(true)
      } else {
        setAcquiringGeolocation(false)
      }
      if (qsLocation !== selectedCity[0].strapi_id.toString()) {
        setQsLocation(selectedCity[0].strapi_id.toString())
      }
    } else {
      setAcquiringGeolocation(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity])

  useEffect(() => {
    if (currentLocation.latitude !== 0 || currentLocation.longitude !== 0) {
      setSelectedCity([currentLocation])
    }
  }, [currentLocation])

  return (
    <>
      <Header content={menuContent} />
      {/* new search header section */}
      <div id="main-content" className="search-header">
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
                handleClear={handleClickClearPark}
              />
              <span className="or-span">or</span>
              <CityNameSearch
                acquiringGeolocation={hasPermission && acquiringGeolocation}
                hasPermission={hasPermission}
                setHasPermission={setHasPermission}
                showPosition={showPosition}
                currentLocation={currentLocation}
                optionLimit={useScreenSize().width > 767 ? 7 : 4}
                selectedItems={selectedCity}
                setSelectedItems={setSelectedCity}
                cityText={cityText}
                setCityText={setCityText}
                handleInputChange={handleCityNameInputChange}
                handleKeyDownSearch={handleKeyDownSearchPark}
                handleClear={handleClickClearCity}
                handleSearch={handleSearch}
              />
              <button
                aria-label="Search"
                className="btn btn-primary"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* main content */}
      <div className="search-body">
        <div className="search-results-main container">
          {/* filter buttons for mobile */}
          <div className="search-results-list d-block d-lg-none">
            <div className="row">
              <div className="col-12 col-md-6">
                <button
                  aria-label="Filter"
                  onClick={handleClickOpenFilter}
                  className="btn btn-secondary w-100"
                >
                  Filter
                </button>
              </div>
              <div className="col-12 col-md-6">
                <button
                  aria-label="More ways to find a park"
                  onClick={handleClickOpenModal}
                  className="btn btn-secondary w-100 mt-3 mt-md-0"
                >
                  More ways to find a park
                </button>
              </div>
            </div>
          </div>
          <div className="row no-gutters">
            {/* filter checkbox for desktop */}
            <div className="search-results-quick-filter col-12 col-lg-3 d-none d-lg-block pr-3">
              <div className="mb-4">
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
                    className="map-link"
                    href="https://governmentofbc.maps.arcgis.com/apps/webappviewer/index.html?id=077ef73a1eae4ca88f2bafbb831215af&query=British_Columbia_Parks_Ecological_Reserves_and_Protected_Areas_8747,ORCS_PRIMARY,0000"
                  >
                    Map
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="link-icon" />
                  </a>
                </div>
              </div>
            </div>
            {/* park results */}
            <div className="col-12 col-lg-9">
              <div className="search-results-list">
                {/* park results text */}
                <p className="result-count-text">
                  {acquiringGeolocation && <>Getting location...</>}
                  {(isLoading && !acquiringGeolocation) && <>Searching...</>}
                  {(!isLoading && !acquiringGeolocation) && (
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
                {/* filter chips for mobile */}
                <div className="d-block d-lg-none">
                  {filterSelections.length > 0 && filterSelections.map((f, index) => (
                    <button
                      key={index}
                      onClick={handleFilterDelete(f)}
                      onDelete={handleFilterDelete(f)}
                      className="btn btn-primary park-filter-chip"
                    >
                      {shortenFilterLabel(f.label)}
                      <FontAwesomeIcon icon={faCircleXmark} className="close-icon" />
                    </button>
                  ))}
                  {filterSelections.length > 0 && (
                    <button
                      className="btn btn-link clear-filter-link"
                      onClick={handleClearFilter}
                      onKeyDown={e => handleKeyDownClearFilter(e)}
                    >
                      Clear filters
                    </button>
                  )}
                </div>
                {/* filter chips for desktop */}
                <div className="d-none d-lg-block">
                  {filterSelections.length > 0 && filterSelections.map((f, index) => (
                    <button
                      key={index}
                      onClick={handleFilterDelete(f)}
                      onDelete={handleFilterDelete(f)}
                      className="btn btn-primary park-filter-chip"
                    >
                      {shortenFilterLabel(f.label)}
                      <FontAwesomeIcon icon={faCircleXmark} className="close-icon" />
                    </button>
                  ))}
                  {filterSelections.length > 0 && (
                    <button
                      className="btn btn-link clear-filter-link"
                      onClick={handleClearFilter}
                      onKeyDown={e => handleKeyDownClearFilter(e)}
                    >
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
              <div className="search-results-list">
                {(isLoading || acquiringGeolocation) && (
                  <div className="container mt-5">
                    <ProgressBar animated now={100} />
                  </div>
                )}
                {(!isLoading && !acquiringGeolocation) && (
                  <>
                    {!searchResults || searchResults.length === 0 ? (
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
                    ) : (
                      // park results cards
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
                        <div className="load-more-button-container mt-4">
                          {totalResults > searchResults.length && (
                            <button
                              aria-label="Load more results"
                              onClick={handleLoadMore}
                              onKeyDown={e => handleKeyDownLoadMore(e)}
                              className="btn btn-secondary load-more-button"
                            >
                              Load more
                            </button>
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
      <ScrollToTop />
      <Footer />
    </>
  )
}

export const Head = () => (
  <Seo title="Find a park" description="Search for the webpages of parks and protected areas across British Columbia. Get detailed information on camping and other activities at specific BC Parks." />
)