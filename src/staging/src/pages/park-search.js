import React, { useState, useRef } from "react"
import { graphql } from "gatsby"
import Header from "../components/header"
import Menu from "../components/menu"
import Footer from "../components/footer"
import "../styles/search.scss"
import {
  searchParkByCriteria,
  labelCompare,
} from "../components/search/search-util"
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
import { withStyles } from "@material-ui/core/styles"
import SearchIcon from "@material-ui/icons/Search"
import Select from "react-select"
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined"

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
  const [searchResults, setSearchResults] = useState(
    location.state.searchResults
  )
  const quickSearch = useRef(location.state.quickSearch)
  const selectedActivities = useRef([...location.state.selectedActivities])
  const selectedFacilities = useRef([...location.state.selectedFacilities])
  const [inputText, setInputText] = useState(location.state.searchText)
  const searchText = useRef(location.state.searchText)
  const activityItems = location.state.activityItems
  const facilityItems = location.state.facilityItems
  const filterSelections = useRef([])
  const protectedAreas = location.state.protectedAreas
  const [showOpenParks, setShowOpenParks] = useState(false)

  const handleQuickSearchChange = e => {
    quickSearch.current = {
      ...quickSearch.current,
      [e.target.name]: e.target.checked,
    }
    searchParkFilter()
  }

  const handleActivityDelete = chipToDelete => {
    selectedActivities.current = selectedActivities.current.filter(
      chip => chip.value !== chipToDelete.value
    )
  }

  const handleFacilityDelete = chipToDelete => {
    selectedFacilities.current = selectedFacilities.current.filter(
      chip => chip.value !== chipToDelete.value
    )
  }

  const handleFilterDelete = chipToDelete => () => {
    if (chipToDelete.type === "activity") {
      handleActivityDelete(chipToDelete)
    } else {
      handleFacilityDelete(chipToDelete)
    }
    setFilters()
    searchParkFilter()
  }

  const handleRemoveAllChips = () => {
    selectedActivities.current = []
    selectedFacilities.current = []
    setFilters()
    searchParkFilter()
  }

  const handleActivityAdd = activity => {
    selectedActivities.current = [...activity]
    setFilters()
    searchParkFilter()
  }

  const handleFacilityAdd = facility => {
    selectedFacilities.current = [...facility]
    setFilters()
    searchParkFilter()
  }

  const setFilters = () => {
    const filters = []
    selectedActivities.current.forEach(a => {
      filters.push({ ...a, type: "activity" })
    })
    selectedFacilities.current.forEach(f => {
      filters.push({ ...f, type: "facility" })
    })
    filters.sort(labelCompare)
    filterSelections.current = [...filters]
  }

  setFilters()

  const searchParkFilter = () => {
    const results = searchParkByCriteria(
      false,
      protectedAreas,
      selectedActivities.current,
      selectedFacilities.current,
      searchText.current,
      quickSearch.current.camping,
      quickSearch.current.petFriendly,
      quickSearch.current.wheelchair,
      quickSearch.current.marine,
      quickSearch.current.ecoReserve,
      quickSearch.current.electricalHookup
    )
    console.log(results)
    setSearchResults([...results])
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
                          checked={quickSearch.current.camping}
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
                          checked={quickSearch.current.petFriendly}
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
                          checked={quickSearch.current.wheelchair}
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
                          checked={quickSearch.current.marine}
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
                          checked={quickSearch.current.ecoReserve}
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
                          checked={quickSearch.current.electricalHookup}
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
                    value={selectedActivities.current}
                    controlShouldRenderValue={false}
                    isClearable={false}
                    isMulti
                    onChange={handleActivityAdd}
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
                    value={selectedFacilities.current}
                    controlShouldRenderValue={false}
                    isClearable={false}
                    isMulti
                    onChange={handleFacilityAdd}
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
                <div className="row">
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
                          searchText.current = inputText
                          searchParkFilter(true)
                          ev.preventDefault()
                        }
                      }}
                    />
                    <Fab
                      className="search-icon-fab"
                      aria-label="search"
                      onClick={() => {
                        searchText.current = inputText
                        searchParkFilter(true)
                      }}
                    >
                      <SearchIcon fontSize="large" className="search-icon" />
                    </Fab>
                  </div>
                </div>
                <div className="row  p20t">
                  <div className="col-12">
                    {(selectedActivities.current.length !== 0 ||
                      selectedFacilities.current.length !== 0 ||
                      quickSearch.current.camping ||
                      quickSearch.current.petFriendly ||
                      quickSearch.current.wheelchair ||
                      quickSearch.current.marine ||
                      quickSearch.current.ecoReserve ||
                      quickSearch.current.electricalHookup ||
                      searchText.current.length !== 0) && (
                      <>
                        {searchResults.length > 0 && (
                          <>
                            {searchResults.length} search{" "}
                            {searchResults.length === 1 && <>result</>}
                            {searchResults.length !== 1 && <>results</>}{" "}
                            {searchText.current.length > 0 && (
                              <>for "{searchText.current}"</>
                            )}
                          </>
                        )}
                        {searchResults.length === 0 && <>No parks found</>}
                      </>
                    )}
                  </div>
                </div>
                {filterSelections.current.length > 0 && (
                  <>
                    <div className="row p20t">
                      <div className="col-12">
                        {filterSelections.current.map(f => (
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
                    <div className="park-af-list pr7">
                      <i>Show all</i>
                    </div>
                    <div className="park-af-list pr7">
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
                      className="park-filter-select"
                      variant="outlined"
                      options={[
                        { value: "ASC", label: "Sort A-Z" },
                        { value: "DESC", label: "Sort Z-A" },
                      ]}
                    />
                  </div>
                </div>
                <Divider className="m20t" />
                <div className="row p20t">
                  <div className="col-12"></div>
                </div>
                {searchResults && searchResults.length > 0 && (
                  <div>
                    {searchResults.map((r, index1) => (
                      <div key={index1}>
                        <div className="row">
                          <div className="col-lg-8">
                            <div>
                              <h2>{r.protectedAreaName}</h2>
                            </div>
                            <br />
                            <div className="row">
                              <div className="col-6">
                                <div className="park-af-list pr3">
                                  <b>Activities: </b>
                                </div>
                                {r.parkActivities.map((a, index2) => (
                                  <div
                                    key={index2}
                                    className="park-af-list pr3"
                                  >
                                    {a.name.split(":")[1]}
                                    {index2 === r.parkActivities.length - 1
                                      ? ""
                                      : ", "}{" "}
                                  </div>
                                ))}
                              </div>
                              <div className="col-6">
                                <div className="park-af-list pr3">
                                  <b>Facilities:</b>
                                </div>
                                {r.parkFacilities.map((f, index3) => (
                                  <div
                                    key={index3}
                                    className="park-af-list pr3"
                                  >
                                    {f.name.split(":")[1]}
                                    {index3 === r.parkFacilities.length - 1
                                      ? ""
                                      : ", "}{" "}
                                  </div>
                                ))}
                              </div>
                            </div>
                            <br />
                          </div>
                          <div className="col-lg-4"></div>
                        </div>
                        <Divider />
                        <br />
                      </div>
                    ))}
                  </div>
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
