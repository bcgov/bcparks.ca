import React, { useState, useEffect } from "react"
import { graphql } from "gatsby"
import Header from "../components/header"
import Menu from "../components/menu"
import Footer from "../components/footer"
import "../styles/search.scss"
import { labelCompare, compare } from "../components/search/search-util"
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  Chip,
  TextField,
  Link,
  Fab,
  Switch,
} from "@material-ui/core"
import Pagination from "@material-ui/lab/Pagination"
import { withStyles } from "@material-ui/core/styles"
import SearchIcon from "@material-ui/icons/Search"
import Select from "react-select"
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined"
import * as ElasticAppSearch from "@elastic/app-search-javascript"

export const query = graphql`
  query {
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
  }
`

export default function Home({ location, data }) {
  const client = ElasticAppSearch.createClient({
    searchKey: `${process.env.GATSBY_ELASTIC_SEARCH_KEY}`,
    endpointBase: `${process.env.GATSBY_ELASTIC_SEARCH_URL}`,
    engineName: `${process.env.GATSBY_ELASTIC_SEARCH_ENGINE}`,
  })

  const activityItems = location.state.activityItems
  const facilityItems = location.state.facilityItems

  const [quickSearch, setQuickSearch] = useState(
    location.state.quickSearch || {
      camping: false,
      petFriendly: false,
      wheelchair: false,
      marine: false,
      ecoReserve: false,
      electricalHookup: false,
    }
  )
  const [selectedActivities, setSelectedActivities] = useState(
    location.state.selectedActivities
      ? [...location.state.selectedActivities]
      : []
  )
  const [selectedFacilities, setSelectedFacilities] = useState(
    location.state.selectedFacilities
      ? [...location.state.selectedFacilities]
      : []
  )
  const [inputText, setInputText] = useState(location.state.searchText || "")
  const [searchText, setSearchText] = useState(location.state.searchText || "")

  const [filterSelections, setFilterSelections] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [showOpenParks, setShowOpenParks] = useState(false)
  const [numberOfPages, setNumberOfPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)

  const itemsPerPage = 6
  const [currentPage, setCurrentPage] = useState(1)
  const [resetCurrentPage, setResetCurrentPage] = useState(true)
  const [isLoading, setIsLoading] = useState(true)

  const sortOptions = [
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
    } else {
      handleFacilityDelete(chipToDelete)
    }
  }

  const handleRemoveAllChips = () => {
    setSelectedActivities([])
    setSelectedFacilities([])
  }

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
    filters.sort(labelCompare)
    setFilterSelections([...filters])
  }

  const CustomSwitch = withStyles(() => ({
    root: {
      width: 36,
      height: 20,
      padding: 0,
      display: "flex",
    },
    switchBase: {
      padding: 2,
      color: "#fff",
      "&$checked": {
        transform: "translateX(16px)",
        color: "#fff",
        "& + $track": {
          opacity: 1,
          backgroundColor: "#003366",
          borderColor: "#003366",
        },
      },
    },
    thumb: {
      width: 16,
      height: 16,
      boxShadow: "none",
    },
    track: {
      border: `1px solid #003366`,
      borderRadius: 20 / 2,
      opacity: 1,
      backgroundColor: "#003366",
    },
    checked: {},
  }))(Switch)

  useEffect(() => {
    setIsLoading(true)
    setFilters()

    const filterOptions = []

    const parkActivitiesFilter = selectedActivities.map(a => ({
      parkactivities: a.label,
    }))
    const parkFacilitiesFilter = selectedFacilities.map(f => ({
      parkfacilities: f.label,
    }))

    if (camping) {
      filterOptions.push({
        any: [
          { parkactivities: "Marine-Accessible Camping" },
          { parkactivities: "Wilderness Camping" },
          { parkactivities: "Backcountry Camping" },
          { parkactivities: "Group Camping" },
          { parkactivities: "Marine-Accessible Camping" },
          { parkactivities: "RV-Accessible Camping" },
          {
            parkactivities: "Vehicle-Accessible Camping",
          },
          { parkfacilities: "Walk-In Camping" },
          { parkfacilities: "Winter Camping" },
          { parkfacilities: "Wilderness Camping" },
        ],
      })
    }
    if (petFriendly) {
      parkActivitiesFilter.push({ parkactivities: "Pets on Leash" })
    }
    if (wheelchair) {
      parkFacilitiesFilter.push({ parkfacilities: "Accessibility Information" })
    }
    if (electricalHookup) {
      parkFacilitiesFilter.push({ parkfacilities: "Electrical Hookups" })
    }
    if (marine) {
      filterOptions.push({ all: [{ marineprotectedarea: ["Y"] }] })
    }
    if (ecoReserve) {
      filterOptions.push({ all: [{ typecode: ["ER"] }] })
    }

    if (parkActivitiesFilter && parkActivitiesFilter.length > 0) {
      filterOptions.push({ all: [...parkActivitiesFilter] })
    }

    if (parkFacilitiesFilter && parkFacilitiesFilter.length > 0) {
      filterOptions.push({ all: [...parkFacilitiesFilter] })
    }

    const options = {
      search_fields: {
        protectedareaname: {},
        parkactivities: {},
        parkfacilities: {},
      },
      filters: {
        all: filterOptions,
      },
      result_fields: {
        hascampfireban: {
          raw: {},
          snippet: { fallback: true },
        },

        hassmokingban: {
          raw: {},
          snippet: { fallback: true },
        },
        typecode: {
          raw: {},
          snippet: { fallback: true },
        },
        protectedareaname: {
          raw: {},
          snippet: { fallback: true },
        },
        marineprotectedarea: {
          raw: {},
          snippet: { fallback: true },
        },
        slug: {
          raw: {},
          snippet: { fallback: true },
        },

        parkactivities: {
          raw: {},
          snippet: { fallback: true },
        },
        url: {
          raw: {},
          snippet: { fallback: true },
        },
        parkfacilities: {
          raw: {},
          snippet: { fallback: true },
        },
        isdayusepass: {
          raw: {},
          snippet: { fallback: true },
        },
        id: {
          raw: {},
          snippet: { fallback: true },
        },
      },
      sort: { protectedareaname: sortOption.value },
      page: { size: itemsPerPage, current: resetCurrentPage ? 1 : currentPage },
    }
    client
      .search(searchText, options)
      .then(resultList => {
        setTotalResults(resultList.info.meta.page.total_results)
        setNumberOfPages(resultList.info.meta.page.total_pages)
        setCurrentPage(resultList.info.meta.page.current)
        const allResults = []
        resultList.results.forEach(result => {
          const park = {}
          park.protectedAreaName = result.data.protectedareaname.raw
          park.isOpenToPublic = true
          park.advisories = ["Wildfire Alert", "Road Closure Alert"]
          park.isDayUsePass = result.data.isdayusepass.raw
            ? result.data.isdayusepass.raw
            : true
          park.parkActivities = result.data.parkactivities.raw
            ? result.data.parkactivities.raw.sort(compare)
            : []
          park.parkFacilities = result.data.parkfacilities.raw
            ? result.data.parkfacilities.raw.sort(compare)
            : []
          park.parkPhotos = [
            "/uploads/mt_assiniboine_photos_images_20_d4bfb5f8ec.jpg",
            "/uploads/mt_assiniboine_photos_images_19_0d09398ed7.jpg",
          ]
          allResults.push(park)
        })
        setSearchResults([...allResults])
        setResetCurrentPage(true)
        setIsLoading(false)
      })
      .catch(error => {
        console.log(`error: ${error}`)
        setIsLoading(false)
      })
  }, [
    sortOption,
    currentPage,
    searchText,
    selectedActivities,
    selectedFacilities,
    quickSearch,
  ])

  return (
    <>
      <Header>{data.strapiWebsites.Header}</Header>
      <Menu>{data.strapiWebsites.Navigation}</Menu>
      <div className="search-results-main">
        <div className="search-results-headline">
          <img
            className="headline-image"
            src="http://localhost:1337/uploads/https_bcparks_ca_photos_images_0001_00_VIFC_0003_ad6ecb7fdb.jpg"
          />
        </div>
        <div className="search-results-container container">
          <h1 className="headline-text">Find your next adventure here.</h1>
          <div className="row">
            <div className="col-lg-3">
              <div className="search-results-quick-filter">
                <h2 className="filter-heading">Filter by</h2>
                <div className="p20t">
                  <FormGroup className="p30l">
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
                    styles={{
                      menuPortal: base => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPortalTarget={document.body}
                    menuPosition={"fixed"}
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
                    styles={{
                      menuPortal: base => ({ ...base, zIndex: 9999 }),
                    }}
                    menuPortalTarget={document.body}
                    menuPosition={"fixed"}
                  />
                </div>
                <br />
                <br />
              </div>
            </div>
            <div className="col-lg-9">
              <div className="search-results-list container">
                <div className="row p20t">
                  <div className="col-12">
                    If you know the name of the park you want to visit, just
                    type in the mane and follow the link. If you're seeking new
                    adventures, use the buttons to search by your favorite
                    activity or by the amenity or service you require.
                  </div>
                </div>
                <div className="row p20t">
                  <div className="col-lg-7 col-md-7 col-sm-12 pt-sm-4 flex-display">
                    <TextField
                      id="park-search-text"
                      variant="outlined"
                      placeholder="Search by park name, location, activity..."
                      className="park-search-text-box"
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
                    />
                    <Fab
                      className="search-icon-fab"
                      aria-label="search"
                      onClick={() => {
                        setSearchText(inputText)
                      }}
                    >
                      <SearchIcon fontSize="large" className="search-icon" />
                    </Fab>
                  </div>
                </div>
                {!isLoading && (
                  <div className="row  p20t">
                    <div className="col-12">
                      {(selectedActivities.length !== 0 ||
                        selectedFacilities.length !== 0 ||
                        quickSearch.camping ||
                        quickSearch.petFriendly ||
                        quickSearch.wheelchair ||
                        quickSearch.marine ||
                        quickSearch.ecoReserve ||
                        quickSearch.electricalHookup ||
                        searchText.length !== 0) && (
                        <>
                          {searchResults.length > 0 && (
                            <>
                              {totalResults} search{" "}
                              {totalResults === 1 && <>result</>}
                              {totalResults !== 1 && <>results</>}{" "}
                              {searchText.length > 0 && <>for "{searchText}"</>}
                            </>
                          )}
                          {searchResults.length === 0 && <>No parks found</>}
                        </>
                      )}
                    </div>
                  </div>
                )}
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
                            deleteIcon={<HighlightOffOutlinedIcon />}
                          />
                        ))}
                        <Link
                          component="button"
                          variant="inherit"
                          className="remove-link"
                          onClick={handleRemoveAllChips}
                        >
                          Remove all
                        </Link>
                      </div>
                    </div>
                    <Divider className="m20t" />
                  </>
                )}
                <div className="row p20t">
                  <div className="col-lg-8 col-md-8 col-sm-12">
                    <div className="park-af-list pr15">
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
                    </div>
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
                    />
                  </div>
                </div>
                <Divider className="m20t" />
                <div className="row p20t">
                  <div className="col-12"></div>
                </div>
                {!isLoading && (
                  <>
                    {searchResults && searchResults.length > 0 && (
                      <div>
                        {searchResults.map((r, index) => (
                          <div key={index}>
                            <div className="row search-result-card">
                              <div className="col-lg-8">
                                <div className="row">
                                  <div className="col-lg-8">
                                    <h2>{r.protectedAreaName}</h2>
                                  </div>
                                  <div className="col-lg-4 text-black">
                                    {r.isOpenToPublic && (
                                      <>Open public access</>
                                    )}
                                  </div>
                                </div>
                                <div className="row text-black p30t">
                                  <div className="col-lg-6">
                                    {r.advisories.map((a, index1) => (
                                      <div key={index1}>{a}</div>
                                    ))}
                                  </div>
                                  <div className="col-lg-6">
                                    {r.isDayUsePass && (
                                      <div className="flex-display">
                                        <img
                                          className="search-result-icon"
                                          src={`${process.env.GATSBY_CMS_BASE_URL}/uploads/camp_32px_713d4b8b90.png`}
                                        />
                                        <div className="pl15">
                                          Day use and camping offered at this
                                          park
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                                <div className="row p30t">
                                  <div className="col-6">
                                    {r.parkActivities &&
                                      r.parkActivities.length > 0 && (
                                        <>
                                          <div className="park-af-list pr3">
                                            <b>Activities: </b>
                                          </div>
                                          {r.parkActivities.map((a, index2) => (
                                            <div
                                              key={index2}
                                              className="park-af-list pr3 text-black"
                                            >
                                              {a}
                                              {index2 ===
                                              r.parkActivities.length - 1
                                                ? ""
                                                : ", "}{" "}
                                            </div>
                                          ))}
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
                                          {r.parkFacilities.map((f, index3) => (
                                            <div
                                              key={index3}
                                              className="park-af-list pr3 text-black"
                                            >
                                              {f}
                                              {index3 ===
                                              r.parkFacilities.length - 1
                                                ? ""
                                                : ", "}{" "}
                                            </div>
                                          ))}{" "}
                                        </>
                                      )}
                                  </div>
                                </div>
                                <br />
                              </div>
                              <div className="col-lg-4 p30t">
                                <img
                                  className="search-result-image"
                                  src={`${process.env.GATSBY_CMS_BASE_URL}${r.parkPhotos[0]}`}
                                />
                              </div>
                            </div>
                            <Divider />
                            <br />
                          </div>
                        ))}
                        <div className="flex-display p20t m20t">
                          <div className="m-auto">
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
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer>{data.strapiWebsites.Footer}</Footer>
    </>
  )
}
