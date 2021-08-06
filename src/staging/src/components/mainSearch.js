import React, { useState } from "react"
import PropTypes from "prop-types"
import SearchIcon from "@material-ui/icons/Search"
import {
  TextField,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Link,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  Chip,
} from "@material-ui/core"
import Select from "react-select"
import "../styles/search.scss"
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined"
import { navigate } from "gatsby"

const MainSearch = ({ data: { activities, facilities, protectedAreas } }) => {
  const [openFilter, setOpenFilter] = useState(false)
  const [quickSearch, setQuickSearch] = useState({
    camping: false,
    petFriendly: false,
    wheelchair: false,
    marine: false,
    ecoReserve: false,
    electricalHookup: false,
  })
  const [selectedActivities, setSelectedActivities] = useState([])
  const [selectedFacilities, setSelectedFacilities] = useState([])
  const [searchText, setSearchText] = useState("")

  const {
    camping,
    petFriendly,
    wheelchair,
    marine,
    ecoReserve,
    electricalHookup,
  } = quickSearch

  const activityItems = activities.map(a => ({
    label: a.activityName,
    value: a.activityNumber,
  }))

  const facilityItems = facilities.map(f => ({
    label: f.facilityName,
    value: f.facilityNumber,
  }))

  const handleClickOpenFilter = () => {
    setOpenFilter(true)
  }

  const handleCloseFilter = () => {
    setOpenFilter(false)
  }

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

  const searchParkByCriteria = textOnly => {
    const textResults = []
    const activityResults = []
    const facilityResults = []
    const activityNames = selectedActivities.map(a => a.label)
    const facilityNames = selectedFacilities.map(f => f.label)
    const campingResults = []
    const petResults = []
    const wheelchairResults = []
    const marineResults = []
    const ecoReserveResults = []
    const electricalHookupResults = []
    const quickSearchResults = {
      campingResults: campingResults,
      petResults: petResults,
      wheelchairResults: wheelchairResults,
      marineResults: marineResults,
      ecoReserveResults: ecoReserveResults,
      electricalHookupResults: electricalHookupResults,
    }
    let requiredResults = {
      text: false,
      camping: false,
      petFriendly: false,
      wheelchair: false,
      marine: false,
      ecoReserve: false,
      electricalHookup: false,
      activity: false,
      facility: false,
    }

    protectedAreas.forEach(park => {
      if (searchText) {
        requiredResults.text = true
        searchParkNames(park, textResults)
        searchActivityText(park, searchText, textResults)
        searchFacilityText(park, searchText, textResults)
      }
      if (!textOnly) {
        filterQuickSearch(park, quickSearchResults, requiredResults)

        if (activityNames && activityNames.length > 0) {
          requiredResults.activity = true
          searchParkActivities(park, activityResults, activityNames)
        }

        if (facilityNames && facilityNames.length > 0) {
          requiredResults.facility = true
          searchParkFacilities(park, facilityResults, facilityNames)
        }
      }
    })

    if (
      (requiredResults.text && (!textResults || textResults.length == 0)) ||
      (requiredResults.camping &&
        (!campingResults || campingResults.length == 0)) ||
      (requiredResults.petFriendly &&
        (!petResults || petResults.length == 0)) ||
      (requiredResults.wheelchair &&
        (!wheelchairResults || wheelchairResults.length == 0)) ||
      (requiredResults.marine &&
        (!marineResults || marineResults.length == 0)) ||
      (requiredResults.ecoReserve &&
        (!ecoReserveResults || ecoReserveResults.length == 0)) ||
      (requiredResults.electricalHookup &&
        (!electricalHookupResults || electricalHookupResults.length == 0)) ||
      (requiredResults.activity &&
        (!activityResults || activityResults.length == 0)) ||
      (requiredResults.facility &&
        (!facilityResults || facilityResults.length == 0))
    ) {
      return []
    }

    let results = []
    let isResultAvailable = false

    if (textResults.length > 0) {
      results = [...textResults]
      isResultAvailable = true
    }

    if (!textOnly) {
      // Consolidate quick search results
      let groupedQuickSearchResults = []
      let isQuickSearchResultAvailable = false

      if (campingResults.length > 0) {
        groupedQuickSearchResults = [...campingResults]
        isQuickSearchResultAvailable = true
      }
      if (petResults.length > 0) {
        if (isQuickSearchResultAvailable) {
          groupedQuickSearchResults = groupedQuickSearchResults.filter(t =>
            petResults.includes(t)
          )
        } else {
          groupedQuickSearchResults = [...petResults]
          isQuickSearchResultAvailable = true
        }
      }
      if (wheelchairResults.length > 0) {
        if (isQuickSearchResultAvailable) {
          groupedQuickSearchResults = groupedQuickSearchResults.filter(t =>
            wheelchairResults.includes(t)
          )
        } else {
          groupedQuickSearchResults = [...wheelchairResults]
          isQuickSearchResultAvailable = true
        }
      }
      if (marineResults.length > 0) {
        if (isQuickSearchResultAvailable) {
          groupedQuickSearchResults = groupedQuickSearchResults.filter(t =>
            marineResults.includes(t)
          )
        } else {
          groupedQuickSearchResults = [...marineResults]
          isQuickSearchResultAvailable = true
        }
      }
      if (ecoReserveResults.length > 0) {
        if (isQuickSearchResultAvailable) {
          groupedQuickSearchResults = groupedQuickSearchResults.filter(t =>
            ecoReserveResults.includes(t)
          )
        } else {
          groupedQuickSearchResults = [...ecoReserveResults]
          isQuickSearchResultAvailable = true
        }
      }
      if (electricalHookupResults.length > 0) {
        if (isQuickSearchResultAvailable) {
          groupedQuickSearchResults = groupedQuickSearchResults.filter(t =>
            electricalHookupResults.includes(t)
          )
        } else {
          groupedQuickSearchResults = [...electricalHookupResults]
          isQuickSearchResultAvailable = true
        }
      }

      if (groupedQuickSearchResults.length > 0) {
        if (isResultAvailable) {
          results = results.filter(t => groupedQuickSearchResults.includes(t))
        } else {
          results = [...groupedQuickSearchResults]
          isResultAvailable = true
        }
      }

      // Consolidate activity select results
      if (activityResults.length > 0) {
        if (isResultAvailable) {
          results = results.filter(t => activityResults.includes(t))
        } else {
          results = [...activityResults]
          isResultAvailable = true
        }
      }
      // Consolidate facility select results
      if (facilityResults.length > 0) {
        if (isResultAvailable) {
          results = results.filter(t => facilityResults.includes(t))
        } else {
          results = [...facilityResults]
          isResultAvailable = true
        }
      }
    }
    return results
  }

  const searchParkNames = (park, textResults) => {
    if (park && park.parkNames) {
      park.parkNames.forEach(name => {
        if (name.parkName.toLowerCase().includes(searchText.toLowerCase())) {
          if (!textResults.includes(park)) {
            textResults.push(park)
          }
        }
      })
    }
  }

  const searchActivityText = (park, keyword, textResults) => {
    if (park && park.parkActivities) {
      park.parkActivities.forEach(activity => {
        const name = activity.name.split(":")[1]
        if (
          name.toLowerCase().includes(keyword.toLowerCase()) &&
          !textResults.includes(park)
        ) {
          textResults.push(park)
        }
      })
    }
  }

  const searchFacilityText = (park, keyword, textResults) => {
    if (park && park.parkFacilities) {
      park.parkFacilities.forEach(facility => {
        const name = facility.name.split(":")[1]
        if (
          name.toLowerCase().includes(keyword.toLowerCase()) &&
          !textResults.includes(park)
        ) {
          textResults.push(park)
        }
      })
    }
  }

  const filterQuickSearch = (park, quickSearchResults, requiredResults) => {
    if (camping) {
      requiredResults.camping = true
      searchActivityText(park, "camping", quickSearchResults.campingResults)
      searchFacilityText(park, "camping", quickSearchResults.campingResults)
    }
    if (petFriendly) {
      requiredResults.petFriendly = true
      searchActivityText(park, "pets on leash", quickSearchResults.petResults)
    }
    if (wheelchair) {
      requiredResults.wheelchair = true
      searchFacilityText(
        park,
        "accessibility information",
        quickSearchResults.wheelchairResults
      )
    }
    if (marine) {
      requiredResults.marine = true
      if (
        park.marineProtectedArea == "Y" &&
        !quickSearchResults.marineResults.includes(park)
      ) {
        quickSearchResults.marineResults.push(park)
      }
    }
    if (ecoReserve) {
      requiredResults.ecoReserve = true
      if (
        park.typeCode == "ER" &&
        !quickSearchResults.ecoReserveResults.includes(park)
      ) {
        quickSearchResults.ecoReserveResults.push(park)
      }
    }
    if (electricalHookup) {
      requiredResults.electricalHookup = true
      searchFacilityText(
        park,
        "electrical hookup",
        quickSearchResults.electricalHookupResults
      )
    }
  }

  const searchParkActivities = (park, activityResults, activityNames) => {
    if (park && park.parkActivities) {
      let count = 0
      let addedActivity = []
      park.parkActivities.forEach(activity => {
        const name = activity.name.split(":")[1]
        if (activityNames.includes(name) && !addedActivity.includes(name)) {
          addedActivity.push(name)
          count++
        }
      })
      if (count == activityNames.length && !activityResults.includes(park)) {
        activityResults.push(park)
      }
    }
  }

  const searchParkFacilities = (park, facilityResults, facilityNames) => {
    if (park && park.parkFacilities) {
      let count = 0
      let addedFacility = []
      park.parkFacilities.forEach(facility => {
        const name = facility.name.split(":")[1]
        if (facilityNames.includes(name) && !addedFacility.includes(name)) {
          addedFacility.push(name)
          count++
        }
      })
      if (count == facilityNames.length && !facilityResults.includes(park)) {
        facilityResults.push(park)
      }
    }
  }

  const searchParkFilter = isTextOnly => {
    const results = searchParkByCriteria(isTextOnly)
    navigate("/park-search", { state: { searchResults: [...results] } })
  }

  return (
    <div className="park-search-text-container">
      <div className="row">
        <div className="col-12">
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
      <div className="row">
        <div className="col-12">
          <Link
            component="button"
            className="park-search-filter"
            onClick={handleClickOpenFilter}
          >
            Filters
          </Link>
        </div>
      </div>
      <Dialog
        open={openFilter}
        onClose={handleCloseFilter}
        aria-labelledby="park-filter-dialog"
        className="park-filter-dialog"
      >
        <DialogContent className="park-filter-dialog-content">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <TextField
                  autoFocus
                  margin="dense"
                  id="park-filter-text"
                  className="park-filter-text"
                  placeholder="Search by park name, location"
                  fullWidth
                  variant="outlined"
                  value={searchText}
                  onChange={event => {
                    setSearchText(event.target.value)
                  }}
                  onKeyPress={ev => {
                    if (ev.key === "Enter") {
                      handleCloseFilter()
                      searchParkFilter(false)
                      ev.preventDefault()
                    }
                  }}
                />
              </div>
            </div>
            <div className="row p20t">
              <div className="col-lg-6 col-md-6 col-sm-12">
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
                </FormGroup>
              </div>
              <div className="col-lg-6 col-md-6 col-sm-12">
                <FormGroup className="p30l">
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
            <Divider className="m20t" />
            <div className="row p20t">
              <div className="col-12">
                <div className="p20l park-select-label">Activities</div>
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
                  placeholder="Add an activity from this list"
                  styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={document.body}
                />
              </div>
            </div>
            <div className="row p20t">
              <div className="col-12">
                {selectedActivities.map(a => (
                  <Chip
                    key={a.value}
                    label={a.label}
                    onDelete={handleActivityDelete(a)}
                    variant="outlined"
                    className="park-filter-chip"
                    deleteIcon={<HighlightOffOutlinedIcon />}
                  />
                ))}
              </div>
            </div>
            <Divider className="m20t" />
            <div className="row p20t">
              <div className="col-12">
                <div className="p20l park-select-label">Facilities</div>
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
                  placeholder="Add a facility from this list"
                  styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={document.body}
                />
              </div>
            </div>
            <div className="row p20t">
              <div className="col-12">
                {selectedFacilities.map(f => (
                  <Chip
                    key={f.value}
                    label={f.label}
                    onDelete={handleFacilityDelete(f)}
                    variant="outlined"
                    className="park-filter-chip"
                    deleteIcon={<HighlightOffOutlinedIcon />}
                  />
                ))}
              </div>
            </div>
            <Divider className="m20t" />
          </div>
        </DialogContent>
        <DialogActions>
          <div className="container">
            <div className="row">
              <div className="col-12 p30">
                <Button
                  variant="contained"
                  onClick={() => {
                    handleCloseFilter()
                    searchParkFilter(false)
                  }}
                  className="bcgov-button bcgov-normal-blue"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  )
}

MainSearch.propTypes = {
  data: PropTypes.shape({
    activities: PropTypes.array.isRequired,
    facilities: PropTypes.array.isRequired,
    protectedAreas: PropTypes.array.isRequired,
  }),
}

export default MainSearch
