import React, { useState, useRef } from "react"
import { Link, graphql } from "gatsby"
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
  Fab,
} from "@material-ui/core"
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

  const [quickSearch, setQuickSearch] = useState(location.state.quickSearch)
  const [selectedActivities, setSelectedActivities] = useState(
    location.state.selectedActivities
  )
  const [selectedFacilities, setSelectedFacilities] = useState(
    location.state.selectedFacilities
  )
  const [searchText, setSearchText] = useState(location.state.searchText)
  const activityItems = location.state.activityItems
  const facilityItems = location.state.facilityItems
  const filterSelections = useRef([])

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

  const handleActivityDelete = chipToDelete => () => {
    setSelectedActivities(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
  }

  const handleFacilityDelete = chipToDelete => () => {
    setSelectedFacilities(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
  }

  const handleFilterDelete = chipToDelete => () => {
    console.log(chipToDelete)
    if (chipToDelete.type === "activity") {
      handleActivityDelete(chipToDelete)
    } else {
      handleFacilityDelete(chipToDelete)
    }
    setFilters()
  }

  const setFilters = () => {
    const filters = []
    selectedActivities.forEach(a => {
      filters.push({ ...a, type: "activity" })
    })
    selectedFacilities.forEach(f => {
      filters.push({ ...f, type: "facility" })
    })
    console.log(filters)
    filters.sort(labelCompare)
    filterSelections.current = [...filters]
  }

  setFilters()

  const searchParkFilter = () => {}

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
                      setFilters()
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
                      setFilters()
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
                <div className="row">
                  <div className="col-lg-7 col-md-7 col-sm-12 pt-sm-4 flex-display">
                    <TextField
                      id="park-search-text"
                      variant="outlined"
                      placeholder="Search by park name, location, activity..."
                      className="park-search-text-box"
                      value={searchText}
                      onChange={event => {
                        setSearchText(event.target.value)
                      }}
                      onKeyPress={ev => {
                        if (ev.key === "Enter") {
                          searchParkFilter(true)
                          ev.preventDefault()
                        }
                      }}
                    />
                    <Fab
                      className="search-icon-fab"
                      aria-label="search"
                      onClick={() => {
                        searchParkFilter(true)
                      }}
                    >
                      <SearchIcon fontSize="large" className="search-icon" />
                    </Fab>
                  </div>
                </div>
                <div className="row  p20t">
                  <div className="col-12">{searchResults.length} results</div>
                </div>
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
                                <b>Activities: </b>
                                {r.parkActivities.map((a, index2) => (
                                  <span key={index2}>
                                    {a.name.split(":")[1]}
                                    {index2 === r.parkActivities.length - 1
                                      ? ""
                                      : ", "}{" "}
                                  </span>
                                ))}
                              </div>
                              <div className="col-6">
                                <b>Facilities: </b>
                                {r.parkFacilities.map((f, index3) => (
                                  <span key={index3}>
                                    {f.name.split(":")[1]}
                                    {index3 === r.parkFacilities.length - 1
                                      ? ""
                                      : ", "}{" "}
                                  </span>
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
