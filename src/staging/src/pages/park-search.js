import React, { useState, useEffect } from "react"
import { graphql } from "gatsby"
import Footer from "../components/footer"
import MegaMenu from "../components/megaMenu"
import "../styles/search.scss"
import {
  labelCompare,
  // compare,
  searchParkByCriteria,
  sortAsc,
  sortDesc,
} from "../components/search/search-util"
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Chip,
  TextField,
  // Switch,
  InputAdornment,
  Card,
  CardContent,
  Link,
} from "@material-ui/core"
import Pagination from "@material-ui/lab/Pagination"
// import { withStyles } from "@material-ui/core/styles"
import SearchIcon from "@material-ui/icons/Search"
import Select from "react-select"
import CloseIcon from "@material-ui/icons/Close"
// import * as ElasticAppSearch from "@elastic/app-search-javascript"
import dayUseIcon from "../images/park/day-use.png"
// import blueAlertIcon from "../images/park/blue-alert-32.png"
// import yellowAlertIcon from "../images/park/yellow-alert-32.png"
import redAlertIcon from "../images/park/red-alert-32.png"
import parksLogo from "../images/Mask_Group_5.png"
import Carousel from "react-material-ui-carousel"

const axios = require("axios");

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
      sort: {fields: order, order: ASC}
      filter: {show: {eq: true}}
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

export default function Home({ location, data }) {
  // const client = ElasticAppSearch.createClient({
  //   searchKey: `${process.env.GATSBY_ELASTIC_SEARCH_KEY}`,
  //   endpointBase: `${process.env.GATSBY_ELASTIC_SEARCH_URL}`,
  //   engineName: `${process.env.GATSBY_ELASTIC_SEARCH_ENGINE}`,
  // })

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

  const [quickSearch, setQuickSearch] = useState(
    location.state
      ? location.state.quickSearch
      : {
          camping: false,
          petFriendly: false,
          wheelchair: false,
          marine: false,
          ecoReserve: false,
          electricalHookup: false,
        }
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
    location.state ? location.state.searchText : ""
  )
  const [searchText, setSearchText] = useState(
    location.state ? location.state.searchText : ""
  )

  const [filterSelections, setFilterSelections] = useState([])
  const [searchResults, setSearchResults] = useState([])
  // const [showOpenParks, setShowOpenParks] = useState(false)
  const [numberOfPages, setNumberOfPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)

  const itemsPerPage = 6
  const [currentPage, setCurrentPage] = useState(1)
  const [resetCurrentPage, setResetCurrentPage] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const sortOptions = [
    { value: "rel", label: "Sort by Relevence" },
    { value: "asc", label: "Sort A-Z" },
    { value: "desc", label: "Sort Z-A" },
  ]

  const [sortOption, setSortOption] = useState(sortOptions[0])

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

  // const handleRemoveAllChips = () => {
  //   setSelectedActivities([])
  //   setSelectedFacilities([])
  // }

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
    setResetCurrentPage(false)
  }

  const setFilters = () => {
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
  }

  function processResults(results) {
    console.log("DATA:", results);
    const allResults = results.map(r => ({
      protectedAreaName: r.protectedAreaName,
      isOpenToPublic: true,
      advisories: ["Wildfire alert"],
      isDayUsePass: true,
      parkPhotos: [
        "https://bcparks.ca/explore/parkpgs/strath/photos/images/13.jpg",
      ],
      slug: r.slug,
    }))
    if (sortOption === "asc") {
      results.sort(sortAsc)
    } else {
      results.sort(sortDesc)
    }
    setSearchResults([...allResults])
    setTotalResults(allResults.length)
    setNumberOfPages(Math.ceil(results.length / itemsPerPage))
    setIsLoading(false)
  }

  useEffect(() => {
    setIsLoading(true)
    setFilters()

    // TODO: Execute live search here.
    const dataSet = 0; // Live search: 0, Strapi search: 1

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
        electricalHookup: quickSearch.electricalHookup
      };

      axios.post(`${data.site.siteMetadata.apiURL}/search-views`, postBody)
      .then(function (data) {
        let results = data.data;
        processResults(results);
      });
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
      processResults(resultsStrapi);
    }

  }, [
    sortOption,
    currentPage,
    searchText,
    selectedActivities,
    selectedFacilities,
    quickSearch,
    protectedAreas,
  ])

  return (
    <>
      <MegaMenu content={menuContent} />
      <div className="search-body">
        <div className="search-results-main container">
          <div className="search-results-container">
            <h1 className="headline-text">Find your next adventure</h1>
            <div className="row no-gutters">
              <div className="col-lg-3 pr15">
                <div className="search-results-quick-filter m15t">
                  <div className="row">
                    <div className="col-12 pr30">
                      <h4 className="filter-heading p30t">
                        Search by park name, <br />
                        location, activity
                      </h4>
                      <TextField
                        id="park-search-text"
                        variant="outlined"
                        placeholder="e.g Alice Park"
                        className="park-search-text-box p10t"
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
                  <div className="row p20t">
                    <div className="col-12">
                      <h4 className="filter-heading p30t">Filter by</h4>
                      <div className="">
                        <h4 className="filter-heading p10t">Popular filters</h4>
                        <FormGroup className="p10l">
                          <FormControlLabel
                            control={
                              <Checkbox
                                checked={camping}
                                onChange={handleQuickSearchChange}
                                name="camping"
                              />
                            }
                            label="Camping"
                            className="no-wrap"
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
                            className="no-wrap"
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
                            className="no-wrap"
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
                            className="no-wrap"
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
                            className="no-wrap"
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
                            className="no-wrap"
                          />
                        </FormGroup>
                      </div>
                    </div>
                  </div>
                  <div className="select-padding">
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
                      className="park-filter-select"
                      variant="outlined"
                      placeholder="Activities"
                    />
                  </div>

                  <div className="select-padding">
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
                      className="park-filter-select"
                      variant="outlined"
                      placeholder="Facilities"
                    />
                  </div>
                  <br />
                  <br />
                </div>
              </div>
              <div className="col-lg-9">
                <div className="search-results-list container">
                  {filterSelections.length > 0 && (
                    <>
                      <div className="row p20t">
                        <div className="col-12">
                          {filterSelections.map(f => (
                            <Chip
                              key={f.label}
                              label={f.label}
                              onDelete={handleFilterDelete(f)}
                              variant="outlined"
                              className="park-filter-chip"
                              deleteIcon={<CloseIcon className="close-icon" />}
                            />
                          ))}
                          {/* <Link
                          component="button"
                          variant="inherit"
                          className="remove-link"
                          onClick={handleRemoveAllChips}
                        >
                          Remove all
                        </Link> */}
                        </div>
                      </div>
                    </>
                  )}
                  <div className="row p20t">
                    <div className="col-lg-8 col-md-8 col-sm-12">
                      {/* <div className="park-af-list pr15">
                      <i>Show all</i>
                    </div>
                    <div className="park-af-list pr15">
                      <CustomSwitch
                        checked={showOpenParks}
                        onChange={e => {
                          setShowOpenParks(e.target.checked)
                        }}
                        name="showOpenParks"
                        className="mtm5"
                      />
                    </div>
                    <div className="park-af-list">
                      <i>Only parks open for public access</i>
                    </div> */}
                    </div>
                    <div className="col-lg-4 col-md-4 col-sm-12">
                      <Select
                        value={sortOption}
                        className="park-filter-select"
                        variant="outlined"
                        options={sortOptions}
                        onChange={e => {
                          setSortOption(e)
                        }}
                        placeholder="Sort by"
                      />
                    </div>
                  </div>
                  <div className="row p20t">
                    <div className="col-12"></div>
                  </div>
                  {!isLoading && (
                    <>
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
                                <Card>
                                  <CardContent className="park-card">
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

                                          <div className="col-lg-7 p20t park-content">
                                            <div className="row">
                                              <div className="col-12 park-overview-content text-blue small-font">
                                                {r.isOpenToPublic && (
                                                  <>Open public access</>
                                                )}
                                                {!r.isOpenToPublic && (
                                                  <>Closed public access</>
                                                )}
                                              </div>
                                            </div>
                                            <Link
                                              href={`/${r.slug}`}
                                              className="p10t"
                                            >
                                              <h2 className="park-heading">
                                                {r.protectedAreaName}
                                              </h2>
                                            </Link>
                                            <div className="row p20t mr5">
                                              <div className="col-6">
                                                {r.advisories.map(
                                                  (a, index1) => (
                                                    // TODO Display all advisories when Event types are
                                                    // available in elastic search results based on severity
                                                    <>
                                                      {index1 === 0 && (
                                                        <div
                                                          key={index1}
                                                          className="flex-display"
                                                        >
                                                          <img
                                                            alt=""
                                                            className="search-result-icon"
                                                            src={redAlertIcon}
                                                          />
                                                          <div className="pl15 text-blue">
                                                            {a} (1)
                                                          </div>
                                                        </div>
                                                      )}
                                                    </>
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
                                            <div className="row p30t mr5">
                                              <div className="col-6">
                                                {r.parkactivities &&
                                                  r.parkactivities.length >
                                                    0 && (
                                                    <>
                                                      <div className="park-af-list pr3">
                                                        <b>Activities:</b>
                                                      </div>
                                                      {r.parkactivities.map(
                                                        (a, index2) => (
                                                          <>
                                                            {index2 < 10 && (
                                                              <div
                                                                key={index2}
                                                                className="park-af-list pr3 text-black"
                                                              >
                                                                {a}
                                                                {index2 === 9
                                                                  ? " ..."
                                                                  : index2 ===
                                                                    r
                                                                      .parkactivities
                                                                      .length -
                                                                      1
                                                                  ? ""
                                                                  : ", "}
                                                              </div>
                                                            )}
                                                          </>
                                                        )
                                                      )}
                                                      <br />
                                                    </>
                                                  )}
                                              </div>
                                              <div className="col-6">
                                                {r.parkfacilities &&
                                                  r.parkfacilities.length >
                                                    0 && (
                                                    <>
                                                      <div className="park-af-list pr3">
                                                        <b>Facilities:</b>
                                                      </div>
                                                      {r.parkfacilities.map(
                                                        (f, index3) => (
                                                          <>
                                                            {index3 < 7 && (
                                                              <div
                                                                key={index3}
                                                                className="park-af-list pr3 text-black"
                                                              >
                                                                {f}
                                                                {index3 === 6
                                                                  ? " ..."
                                                                  : index3 ===
                                                                    r
                                                                      .parkfacilities
                                                                      .length -
                                                                      1
                                                                  ? ""
                                                                  : ", "}
                                                              </div>
                                                            )}
                                                          </>
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
      <Footer>{data.strapiWebsites.Footer}</Footer>
    </>
  )
}
