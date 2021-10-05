import React, { useState, useEffect, useCallback } from "react"
import { graphql } from "gatsby"
import Footer from "../components/footer"
import MegaMenu from "../components/megaMenu"
import "../styles/search.scss"
import {
  labelCompare,
  searchParkByCriteria,
  sortAsc,
  sortDesc,
} from "../components/search/searchUtil"
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
  Breadcrumbs,
  Button,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core"
import Pagination from "@material-ui/lab/Pagination"
import SearchIcon from "@material-ui/icons/Search"
import Select from "react-select"
import CloseIcon from "@material-ui/icons/Close"
import dayUseIcon from "../images/park/day-use.png"
// import blueAlertIcon from "../images/park/blue-alert-32.png"
// import yellowAlertIcon from "../images/park/yellow-alert-32.png"
import redAlertIcon from "../images/park/red-alert-32.png"
import parksLogo from "../images/Mask_Group_5.png"
import Carousel from "react-material-ui-carousel"
import SearchFilter from "../components/search/searchFilter"

const axios = require("axios")

export const query = graphql`
  query {
    site {
      siteMetadata {
        apiURL
      }
    }
    strapiWebsites(Name: { eq: "BCParks.ca" }) {
      Footer
      Header
      Name
      Navigation
      id
      homepage {
        id
        Template
        Content {
          id
          strapi_component
          HTML
        }
      }
    }
    allStrapiActivityTypes(sort: { fields: activityName }) {
      totalCount
      nodes {
        activityName
        activityNumber
      }
    }
    allStrapiFacilityTypes(sort: { fields: facilityName }) {
      totalCount
      nodes {
        facilityName
        facilityNumber
      }
    }
    allStrapiProtectedArea(sort: { fields: protectedAreaName }) {
      nodes {
        parkActivities {
          activityType
          isActive
          isActivityOpen
          name
        }
        parkFacilities {
          facilityType
          isActive
          isFacilityOpen
          name
        }
        id
        orcs
        latitude
        longitude
        protectedAreaName
        slug
        parkNames {
          parkName
          id
          parkNameType
        }
        status
        typeCode
        marineProtectedArea
      }
    }
    allStrapiMenus(
      sort: { fields: order, order: ASC }
      filter: { show: { eq: true } }
    ) {
      nodes {
        strapiId
        title
        url
        order
        id
        strapiChildren {
          id
          title
          url
          order
          parent
        }
        strapiParent {
          id
          title
        }
      }
    }
  }
`

export default function Explore({ location, data }) {
  const menuContent = data?.allStrapiMenus?.nodes || []

  const activityItems = data.allStrapiActivityTypes.nodes.map(a => ({
    label: a.activityName,
    value: a.activityNumber,
  }))
  const facilityItems = data.allStrapiFacilityTypes.nodes.map(f => ({
    label: f.facilityName,
    value: f.facilityNumber,
  }))

  const protectedAreas = data.allStrapiProtectedArea.nodes

  const [quickSearch, setQuickSearch] = useState({
    camping: false,
    petFriendly: false,
    wheelchair: false,
    marine: false,
    ecoReserve: false,
    electricalHookup: false,
  })
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

  const sortOptions = [
    { value: "rel", label: "Sort by Relevence" },
    { value: "asc", label: "Sort A-Z" },
    { value: "desc", label: "Sort Z-A" },
  ]

  const [sortOption, setSortOption] = useState(
    location.state && location.state.sortOption
      ? location.state.sortOption
      : sortOptions[0]
  )

  const breadcrumbs = [
    <Link key="1" href="/">
      Home
    </Link>,
    <div key="2" className="breadcrumb-text">
      Find a Park
    </div>,
  ]

  const {
    camping,
    petFriendly,
    wheelchair,
    marine,
    ecoReserve,
    electricalHookup,
  } = quickSearch

  const handleQuickSearchChange = event => {
    setQuickSearch({
      ...quickSearch,
      [event.target.name]: event.target.checked,
    })
  }
  const handleActivityDelete = chipToDelete => {
    setSelectedActivities(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
  }

  const handleFacilityDelete = chipToDelete => {
    setSelectedFacilities(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
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
    }
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }

  const handleClickOpenFilter = () => {
    setOpenFilter(true)
  }

  const handleOpenQuickView = () => {
    setOpenQuickView(true)
  }

  const handleCloseQuickView = () => {
    setOpenQuickView(false)
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
      filters.push({ label: "Dog Friendly", type: "petFriendly" })
    }
    if (wheelchair) {
      filters.push({ label: "Wheelchair Accessible", type: "wheelchair" })
    }
    if (marine) {
      filters.push({ label: "Marine Park", type: "marine" })
    }
    if (ecoReserve) {
      filters.push({ label: "Ecological reserve", type: "ecoReserve" })
    }
    if (electricalHookup) {
      filters.push({ label: "Electrical Hookup", type: "electricalHookup" })
    }
    filters.sort(labelCompare)
    setFilterSelections([...filters])
  }, [
    camping,
    ecoReserve,
    electricalHookup,
    marine,
    petFriendly,
    selectedActivities,
    selectedFacilities,
    wheelchair,
  ])

  const processResults = useCallback(
    (results, dataSet) => {
      const allResults = results.map(r => {
        if (dataSet === 0) {
          return {
            protectedAreaName: r.protectedAreaName,
            isOpenToPublic: true,
            advisories: ["Wildfire alert"],
            isDayUsePass: true,
            parkActivities: [],
            parkFacilities: [],
            parkPhotos: [
              "https://bcparks.ca/explore/parkpgs/strath/photos/images/12.jpg",
              "https://bcparks.ca/explore/parkpgs/strath/photos/images/13.jpg",
            ],
            slug: r.slug,
          }
        }
        return {
          protectedAreaName: r.protectedAreaName,
          isOpenToPublic: true,
          advisories: ["Wildfire alert"],
          isDayUsePass: true,
          parkActivities: r.parkActivities.map(a => a.name.split(":")[1]),
          parkFacilities: r.parkFacilities.map(a => a.name.split(":")[1]),
          parkPhotos: [
            "https://bcparks.ca/explore/parkpgs/strath/photos/images/12.jpg",
            "https://bcparks.ca/explore/parkpgs/strath/photos/images/13.jpg",
          ],
          slug: r.slug,
        }
      })
      if (sortOption.value === "asc") {
        allResults.sort(sortAsc)
      } else {
        allResults.sort(sortDesc)
      }
      setSearchResults([...allResults])
      setTotalResults(allResults.length)
      setNumberOfPages(Math.ceil(results.length / itemsPerPage))
      setIsLoading(false)
    },
    [sortOption]
  )

  useEffect(() => {
    setIsLoading(true)
    setFilters()

    // TODO: Execute live search here.
    const dataSet = 1 // Live search: 0, Strapi search: 1

    if (dataSet === 0) {
      let postBody = {
        selectedActivities: selectedActivities,
        selectedFacilities: selectedFacilities,
        searchText: searchText,
        camping: quickSearch.camping,
        petFriendly: quickSearch.petFriendly,
        wheelchair: quickSearch.wheelchair,
        marine: quickSearch.marine,
        ecoReserve: quickSearch.ecoReserve,
        electricalHookup: quickSearch.electricalHookup,
      }

      axios
        .post(`${data.site.siteMetadata.apiURL}/search-views`, postBody)
        .then(function (data) {
          let results = data.data
          processResults(results, dataSet)
        })
    } else {
      const resultsStrapi = searchParkByCriteria(
        false,
        protectedAreas,
        selectedActivities,
        selectedFacilities,
        searchText,
        quickSearch.camping,
        quickSearch.petFriendly,
        quickSearch.wheelchair,
        quickSearch.marine,
        quickSearch.ecoReserve,
        quickSearch.electricalHookup
      )
      processResults(resultsStrapi, dataSet)
    }
  }, [
    sortOption,
    currentPage,
    searchText,
    selectedActivities,
    selectedFacilities,
    quickSearch,
    protectedAreas,
    data.site.siteMetadata.apiURL,
    processResults,
    setFilters,
  ])

  return (
    <>
      <MegaMenu content={menuContent} />
      <div className="search-body">
        <div className="search-results-main container">
          <div className="search-results-container">
            <Breadcrumbs
              separator="›"
              aria-label="breadcrumb"
              className="p40t sm-p10"
            >
              {breadcrumbs}
            </Breadcrumbs>
            <div className="row no-gutters">
              <div className="col-12">
                <h1 className="headline-text p40t sm-p10">
                  Find your next adventure
                </h1>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-lg-3 col-md-12 col-sm-12">
                <div className="search-results-quick-filter m15t">
                  <div className="row no-gutters">
                    <div className="col-12 park-search-text-box-container d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                      <h4 className="filter-heading pr30 p10t sm-p10">
                        Search by park name, <br />
                        location, activity
                      </h4>
                      <TextField
                        id="park-search-text"
                        variant="outlined"
                        placeholder="e.g Alice Park"
                        className="park-search-text-box m10t h50p"
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
                        }}
                      />
                    </div>
                    <div className="col-12  d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
                      <h4 className="filter-heading p30t ">
                        Search by park name, location, activity
                      </h4>
                      <TextField
                        id="park-search-text"
                        variant="outlined"
                        placeholder="e.g Alice Park"
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
                        }}
                      />
                    </div>
                  </div>
                  <div className="row p20t no-gutters d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                    <div className="col-12">
                      <h4 className="filter-heading p30t">Filter by</h4>
                      <div className="">
                        <h4 className="filter-heading p10t">Popular filters</h4>
                        <FormGroup className="p10l filter-options-container">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={camping}
                                onChange={handleQuickSearchChange}
                                name="camping"
                              />
                            }
                            label="Camping"
                            className={
                              camping ? "text-light-blue no-wrap" : "no-wrap"
                            }
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={petFriendly}
                                onChange={handleQuickSearchChange}
                                name="petFriendly"
                              />
                            }
                            label="Dog friendly"
                            className={
                              petFriendly
                                ? "text-light-blue no-wrap"
                                : "no-wrap"
                            }
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={wheelchair}
                                onChange={handleQuickSearchChange}
                                name="wheelchair"
                              />
                            }
                            label="Wheelchair accessible"
                            className={
                              wheelchair ? "text-light-blue no-wrap" : "no-wrap"
                            }
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={marine}
                                onChange={handleQuickSearchChange}
                                name="marine"
                              />
                            }
                            label="Marine park"
                            className={
                              marine ? "text-light-blue no-wrap" : "no-wrap"
                            }
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={ecoReserve}
                                onChange={handleQuickSearchChange}
                                name="ecoReserve"
                              />
                            }
                            label="Ecological reserve"
                            className={
                              ecoReserve ? "text-light-blue no-wrap" : "no-wrap"
                            }
                          />
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={electricalHookup}
                                onChange={handleQuickSearchChange}
                                name="electricalHookup"
                              />
                            }
                            label="Electrical hookups"
                            className={
                              electricalHookup
                                ? "text-light-blue no-wrap"
                                : "no-wrap"
                            }
                          />
                        </FormGroup>
                      </div>
                    </div>
                  </div>
                  <div className="select-padding d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                    <Select
                      id="activities-select"
                      options={activityItems}
                      value={selectedActivities}
                      controlShouldRenderValue={false}
                      isClearable={false}
                      isMulti
                      onChange={e => {
                        setSelectedActivities(e)
                      }}
                      className="park-filter-select h50p"
                      variant="outlined"
                      placeholder="Activities"
                    />
                  </div>

                  <div className="select-padding d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                    <Select
                      id="facilities-select"
                      options={facilityItems}
                      value={selectedFacilities}
                      controlShouldRenderValue={false}
                      isClearable={false}
                      isMulti
                      onChange={e => {
                        setSelectedFacilities(e)
                      }}
                      className="park-filter-select h50p"
                      variant="outlined"
                      placeholder="Facilities"
                    />
                    <br />
                    <br />
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-12 col-sm-12">
                <div className="search-results-list container">
                  {filterSelections.length > 0 && (
                    <>
                      <div className="row p20t d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                        <div className="col-12">
                          {filterSelections.map((f, index) => (
                            <Chip
                              key={index}
                              label={f.label}
                              onDelete={handleFilterDelete(f)}
                              variant="outlined"
                              className="park-filter-chip"
                              deleteIcon={<CloseIcon className="close-icon" />}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                  <div className="row p30t no-gutters">
                    <div className="col-lg-8 col-md-6 col-sm-6 col-xs-6 w50 pr3">
                      <div className="d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
                        <Button
                          variant="outlined"
                          onClick={handleClickOpenFilter}
                          className="bcgov-button bcgov-normal-white h50p"
                        >
                          Filter
                        </Button>
                      </div>
                    </div>
                    <div className="col-lg-4 col-md-6 col-sm-6 col-xs-6 w50">
                      <Select
                        value={sortOption}
                        className="park-filter-select h50p"
                        variant="outlined"
                        options={sortOptions}
                        onChange={e => {
                          setSortOption(e)
                        }}
                        placeholder="Sort by"
                      />
                    </div>
                  </div>
                  {!isLoading && (
                    <>
                      {!searchResults ||
                        (searchResults.length === 0 && (
                          <div className="container p30 align-center">
                            No parks found
                            <br />
                          </div>
                        ))}
                      {searchResults && searchResults.length > 0 && (
                        <>
                          {searchResults
                            .slice(
                              (currentPage - 1) * itemsPerPage,
                              searchResults.length === 1
                                ? searchResults.length
                                : currentPage * itemsPerPage >
                                  searchResults.length - 1
                                ? searchResults.length
                                : currentPage * itemsPerPage
                            )
                            .map((r, index) => (
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
                                                  src={r.parkPhotos[0]}
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
                                                          src={`${item}`}
                                                        />
                                                      )
                                                    }
                                                  )}
                                                </Carousel>
                                              </div>
                                            )}

                                          <div className="col-lg-7 p20t park-content p20l">
                                            <div className="row">
                                              <div className="col-12 park-overview-content text-blue small-font">
                                                {r.isOpenToPublic && (
                                                  <div className="text-green">
                                                    Open to public access
                                                  </div>
                                                )}
                                                {!r.isOpenToPublic && (
                                                  <div className="text-red">
                                                    Closed public access
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            <Link
                                              href={`/${r.slug}`}
                                              className="p10t"
                                            >
                                              <h3 className="park-heading-text">
                                                {r.protectedAreaName}
                                              </h3>
                                            </Link>
                                            <div className="row p10t mr5">
                                              <div className="col-6">
                                                {r.advisories.map(
                                                  (a, index1) => (
                                                    // TODO Display all advisories when Event types are
                                                    // available in elastic search results based on severity
                                                    <div
                                                      key={index1}
                                                      className="flex-display"
                                                    >
                                                      {index1 === 0 && (
                                                        <>
                                                          <img
                                                            alt=""
                                                            className="search-result-icon"
                                                            src={redAlertIcon}
                                                          />
                                                          <div className="pl15 text-blue">
                                                            {a} (1)
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                              <div className="col-6">
                                                {r.isDayUsePass && (
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
                                                  r.parkActivities.length >
                                                    0 && (
                                                    <>
                                                      <div className="park-af-list pr3">
                                                        <b>Activities:</b>
                                                      </div>
                                                      {r.parkActivities.map(
                                                        (a, index2) => (
                                                          <div
                                                            key={index2}
                                                            className="park-af-list pr3 text-black"
                                                          >
                                                            {index2 < 11 && (
                                                              <>
                                                                {a}
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
                                                  r.parkFacilities.length >
                                                    0 && (
                                                    <>
                                                      <div className="park-af-list pr3">
                                                        <b>Facilities:</b>
                                                      </div>
                                                      {r.parkFacilities.map(
                                                        (f, index3) => (
                                                          <div
                                                            key={index3}
                                                            className="park-af-list pr3 text-black"
                                                          >
                                                            {index3 < 6 && (
                                                              <>
                                                                {f}
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
                                                  src={r.parkPhotos[0]}
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
                                                          src={`${item}`}
                                                        />
                                                      )
                                                    }
                                                  )}
                                                </Carousel>
                                              </div>
                                            )}

                                          <div className="col-12 p20t park-content-mobile">
                                            <div className="row">
                                              <div className="col-12 park-overview-content text-blue small-font">
                                                {r.isOpenToPublic && (
                                                  <div className="text-green">
                                                    Open to public access
                                                  </div>
                                                )}
                                                {!r.isOpenToPublic && (
                                                  <div className="text-red">
                                                    Closed public access
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            <Link
                                              href={`/${r.slug}`}
                                              className="p10t"
                                            >
                                              <h3 className="park-heading-text">
                                                {r.protectedAreaName}
                                              </h3>
                                            </Link>
                                          </div>
                                        </div>
                                        <div className="row p20">
                                          <div className="col-12 p0 align-center flex-display full-width">
                                            <div className="full-width">
                                              <Link
                                                href={`/${r.slug}`}
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
                                                onClick={handleOpenQuickView}
                                                className="park-quick-link link"
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
                                                  src={r.parkPhotos[0]}
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
                                                          src={`${item}`}
                                                        />
                                                      )
                                                    }
                                                  )}
                                                </Carousel>
                                              </div>
                                            )}

                                          <div className="col-12 park-content-mobile p30 container">
                                            <div className="row">
                                              <div className="col-12 park-overview-content text-blue small-font">
                                                {r.isOpenToPublic && (
                                                  <div className="text-green">
                                                    Open to public access
                                                  </div>
                                                )}
                                                {!r.isOpenToPublic && (
                                                  <div className="text-red">
                                                    Closed public access
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            <Link
                                              href={`/${r.slug}`}
                                              className="p10t"
                                            >
                                              <h3 className="park-heading-text">
                                                {r.protectedAreaName}
                                              </h3>
                                            </Link>

                                            <div className="row p20t mr5">
                                              <div className="col-12">
                                                {r.advisories.map(
                                                  (a, index1) => (
                                                    // TODO Display all advisories when Event types are
                                                    // available in elastic search results based on severity
                                                    <div
                                                      key={index1}
                                                      className="flex-display"
                                                    >
                                                      {index1 === 0 && (
                                                        <>
                                                          <img
                                                            alt=""
                                                            className="search-result-icon"
                                                            src={redAlertIcon}
                                                          />
                                                          <div className="pl15 text-blue">
                                                            {a} (1)
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                              <div className="col-12 p20t">
                                                {r.isDayUsePass && (
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
                                            <div className="row p20t mr5">
                                              <div className="col-12">
                                                {r.parkActivities &&
                                                  r.parkActivities.length >
                                                    0 && (
                                                    <>
                                                      <div className="park-af-list pr3">
                                                        <b>Activities:</b>
                                                      </div>
                                                      {r.parkActivities.map(
                                                        (a, index2) => (
                                                          <div
                                                            key={index2}
                                                            className="park-af-list pr3 text-black"
                                                          >
                                                            {index2 < 11 && (
                                                              <>
                                                                {a}
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
                                              <div className="col-12 p20t">
                                                {r.parkFacilities &&
                                                  r.parkFacilities.length >
                                                    0 && (
                                                    <>
                                                      <div className="park-af-list pr3">
                                                        <b>Facilities:</b>
                                                      </div>
                                                      {r.parkFacilities.map(
                                                        (f, index3) => (
                                                          <div
                                                            key={index3}
                                                            className="park-af-list pr3 text-black"
                                                          >
                                                            {index3 < 6 && (
                                                              <>
                                                                {f}
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
                                  </DialogContent>
                                  <DialogActions className="d-block p20 background-blue">
                                    <div className="row">
                                      <div className="col-12 p0 align-center flex-display full-width">
                                        <div className="full-width">
                                          <Link
                                            href={`/${r.slug}`}
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
                                          >
                                            Close Quick View
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </DialogActions>
                                </Dialog>
                              </div>
                            ))}
                          <div className="small-flex-display p20t">
                            <div className="small-m-auto">
                              {searchResults.length > 0 && (
                                <>
                                  Showing results{" "}
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
                                size="small"
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
          openFilter,
          setOpenFilter,
          quickSearch,
          setQuickSearch,
          selectedActivities,
          setSelectedActivities,
          selectedFacilities,
          setSelectedFacilities,
          searchText,
          setSearchText,
          sortOption,
          setSortOption,
          sortOptions,
        }}
      />
      <Footer>{data.strapiWebsites.Footer}</Footer>
    </>
  )
}
