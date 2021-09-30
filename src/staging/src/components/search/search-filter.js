import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Collapse,
  Divider,
  Chip,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Link,
} from "@material-ui/core"
import "../../styles/search.scss"
import SearchIcon from "@material-ui/icons/Search"
import CancelIcon from "@material-ui/icons/Cancel"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
import Select from "react-select"
import { navigate } from "gatsby"

import { labelCompare } from "./search-util"

const SearchFilter = ({
  data: {
    activities,
    facilities,
    openFilter,
    setOpenFilter,
    selectedActivities,
    setSelectedActivities,
    selectedFacilities,
    setSelectedFacilities,
    searchText,
    setSearchText,
    sortOption,
    setSortOption,
    sortOptions,
  },
}) => {
  const [showFilters, setShowFilter] = useState([false, false])
  const [filterSelections, setFilterSelections] = useState([])

  const activityItems = activities.map(a => ({
    label: a.activityName,
    value: a.activityNumber,
  }))

  const facilityItems = facilities.map(f => ({
    label: f.facilityName,
    value: f.facilityNumber,
  }))

  const handleCloseFilter = () => {
    setOpenFilter(false)
  }

  const handleActivityCheck = (activity, event) => {
    if (event.target.checked) {
      setSelectedActivities([...selectedActivities, activity])
    } else {
      setSelectedActivities([
        ...selectedActivities.filter(a => a.value !== activity.value),
      ])
    }
  }

  const handleFacilityCheck = (facility, event) => {
    if (event.target.checked) {
      setSelectedFacilities([...selectedFacilities, facility])
    } else {
      setSelectedFacilities([
        ...selectedFacilities.filter(f => f.value !== facility.value),
      ])
    }
  }

  const handleShowFilterClick = index => {
    const tempShowFilter = showFilters
    tempShowFilter[index] = !tempShowFilter[index]
    setShowFilter([...tempShowFilter])
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
    }
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

  const searchParkFilter = () => {
    navigate("/explore", {
      state: {
        selectedActivities,
        selectedFacilities,
        searchText,
        sortOption,
      },
    })
  }

  useEffect(() => {
    setFilters()
  }, [searchText, selectedActivities, selectedFacilities])

  return (
    <div className="">
      <Dialog
        open={openFilter}
        onClose={handleCloseFilter}
        aria-labelledby="park-filter-dialog"
        className="park-filter-dialog"
      >
        <DialogTitle className="park-filter-title">
          <div className="container">
            <div className="row">
              <div className="col-12 p30t">
                <h1>Plan your next adventure</h1>
              </div>
            </div>
          </div>
        </DialogTitle>
        <DialogContent className="park-filter-dialog-content">
          <div className="container">
            <div className="row no-gutters">
              <div className="col-lg-7 col-md-12 col-sm-12">
                <TextField
                  margin="dense"
                  id="park-filter-text"
                  className="park-filter-text"
                  placeholder="Search by name or location"
                  fullWidth
                  variant="outlined"
                  value={searchText}
                  onChange={event => {
                    setSearchText(event.target.value)
                  }}
                  onKeyPress={ev => {
                    if (ev.key === "Enter") {
                      searchParkFilter()
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
              <div className="col-lg-3 col-md-8 col-sm-8 mt8 p10l d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                <Button
                  variant="contained"
                  onClick={() => {
                    searchParkFilter()
                  }}
                  className="bcgov-button bcgov-normal-blue"
                >
                  Search
                </Button>
              </div>
              <div className="col-lg-2 col-md-8 col-sm-4 mt8 p10l d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                <Button
                  variant="outlined"
                  onClick={() => {
                    handleCloseFilter()
                  }}
                  className="bcgov-button bcgov-normal-transparent"
                >
                  Cancel
                </Button>
              </div>
              <div className="p10t col-lg-4 col-md-4 col-sm-12 d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
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
              <div className="col-lg-4 col-md-12 col-sm-12 pb20">
                <div className="park-filter-options">
                  <div className="park-filter-option-label flex-display">
                    <div className="text-black">
                      <b>Selected Filters</b>
                    </div>
                    <Link
                      className="ml-auto pointer"
                      onClick={() => {
                        setSelectedActivities([])
                        setSelectedFacilities([])
                      }}
                    >
                      Reset all
                    </Link>
                  </div>
                  <Divider className="grey-divider" />
                  {filterSelections.length == 0 && (
                    <div className="no-filters-text">
                      No search filters selected
                    </div>
                  )}
                  <div>
                    {filterSelections.length > 0 && (
                      <>
                        <div className="row p10t">
                          <div className="col-12">
                            {filterSelections.map((f, index) => (
                              <div
                                key={index}
                                className="park-filter-chip-list-container"
                              >
                                <Chip
                                  key={f.label}
                                  onDelete={handleFilterDelete(f)}
                                  variant="outlined"
                                  className="park-filter-chip-list"
                                  deleteIcon={
                                    <CancelIcon
                                      fontSize="large"
                                      className="close-icon-blue"
                                    />
                                  }
                                />
                                {f.label}
                                {filterSelections.length - 1 > index && (
                                  <Divider className="grey-divider-light" />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              <div className="col-lg-8 col-md-12 col-sm-12">
                <div className="row">
                  <div className="col-12">
                    <div className="park-filter-options">
                      <div className="park-filter-option-label flex-display">
                        <div
                          className="flex-display pointer full-width"
                          onClick={() => {
                            handleShowFilterClick(0)
                          }}
                        >
                          {showFilters[0] ? (
                            <ExpandLess fontSize="large" className="mtm5" />
                          ) : (
                            <ExpandMore fontSize="large" className="mtm5" />
                          )}
                          <div className="p10l park-select-label">
                            Activities
                          </div>
                        </div>
                        <Link
                          className="ml-auto pointer"
                          onClick={() => {
                            setSelectedActivities([])
                          }}
                        >
                          Reset
                        </Link>
                      </div>

                      <Divider className="yellow-divider" />
                      <Collapse
                        in={showFilters[0]}
                        timeout="auto"
                        unmountOnExit
                        className="p20"
                      >
                        <div className="flex-display-list">
                          <div className="col-lg-6 col-md-12 col-sm-12">
                            {activityItems
                              .slice(0, Math.ceil(activityItems.length / 2))
                              .map((a, index) => (
                                <FormGroup className="pr30" key={index}>
                                  <FormControlLabel
                                    className={
                                      selectedActivities.filter(
                                        act => act.value === a.value
                                      ).length === 1
                                        ? "text-light-blue"
                                        : ""
                                    }
                                    control={
                                      <Checkbox
                                        checked={
                                          selectedActivities.filter(
                                            act => act.value === a.value
                                          ).length === 1
                                            ? true
                                            : false
                                        }
                                        onChange={event => {
                                          handleActivityCheck(a, event)
                                        }}
                                        name={a.label}
                                      />
                                    }
                                    label={a.label}
                                    className="no-wrap"
                                  />
                                </FormGroup>
                              ))}
                          </div>
                          <div className="col-lg-6 col-md-12 col-sm-12">
                            {activityItems
                              .slice(
                                Math.ceil(activityItems.length / 2),
                                activityItems.length
                              )
                              .map((a, index) => (
                                <FormGroup key={index}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={
                                          selectedActivities.filter(
                                            act => act.value === a.value
                                          ).length === 1
                                            ? true
                                            : false
                                        }
                                        onChange={event => {
                                          handleActivityCheck(a, event)
                                        }}
                                        name={a.label}
                                      />
                                    }
                                    label={a.label}
                                    className="no-wrap"
                                  />
                                </FormGroup>
                              ))}
                          </div>
                        </div>
                      </Collapse>
                    </div>
                  </div>
                </div>
                <div className="row p20t">
                  <div className="col-12">
                    <div className="park-filter-options">
                      <div className="park-filter-option-label flex-display">
                        <div
                          className="flex-display pointer full-width"
                          onClick={() => {
                            handleShowFilterClick(1)
                          }}
                        >
                          {showFilters[1] ? (
                            <ExpandLess fontSize="large" className="mtm5" />
                          ) : (
                            <ExpandMore fontSize="large" className="mtm5" />
                          )}
                          <div className="p10l park-select-label">
                            Facilities
                          </div>
                        </div>
                        <Link
                          className="ml-auto pointer"
                          onClick={() => {
                            setSelectedFacilities([])
                          }}
                        >
                          Reset
                        </Link>
                      </div>

                      <Divider className="yellow-divider" />
                      <Collapse
                        in={showFilters[1]}
                        timeout="auto"
                        unmountOnExit
                        className="p20"
                      >
                        <div className="flex-display-list">
                          <div className="col-lg-6 col-md-12 col-sm-12">
                            {facilityItems
                              .slice(0, Math.ceil(facilityItems.length / 2))
                              .map((f, index) => (
                                <FormGroup className="pr30" key={index}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={
                                          selectedFacilities.filter(
                                            fa => fa.value === f.value
                                          ).length === 1
                                            ? true
                                            : false
                                        }
                                        onChange={event => {
                                          handleFacilityCheck(f, event)
                                        }}
                                        name={f.label}
                                      />
                                    }
                                    label={f.label}
                                    className="no-wrap"
                                  />
                                </FormGroup>
                              ))}
                          </div>
                          <div className="col-lg-6 col-md-12 col-sm-12">
                            {facilityItems
                              .slice(
                                Math.ceil(facilityItems.length / 2),
                                facilityItems.length
                              )
                              .map((f, index) => (
                                <FormGroup key={index}>
                                  <FormControlLabel
                                    control={
                                      <Checkbox
                                        checked={
                                          selectedFacilities.filter(
                                            fa => fa.value === f.value
                                          ).length === 1
                                            ? true
                                            : false
                                        }
                                        onChange={event => {
                                          handleFacilityCheck(f, event)
                                        }}
                                        name={f.label}
                                      />
                                    }
                                    label={f.label}
                                    className="no-wrap"
                                  />
                                </FormGroup>
                              ))}
                          </div>
                        </div>
                      </Collapse>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <br />
            <br />
          </div>
        </DialogContent>
        <DialogActions className="d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
          <div className="container p30">
            <div className="row">
              <div className="col-lg-3 col-md-8 col-sm-8 mt8">
                <Button
                  variant="contained"
                  onClick={() => {
                    searchParkFilter()
                  }}
                  className="bcgov-button bcgov-normal-blue"
                >
                  Search
                </Button>
              </div>
              <div className="col-lg-2 col-md-8 col-sm-4 mt8">
                <Button
                  variant="outlined"
                  onClick={() => {
                    handleCloseFilter()
                  }}
                  className="bcgov-button bcgov-normal-transparent"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  )
}

SearchFilter.propTypes = {
  data: PropTypes.shape({
    activities: PropTypes.array.isRequired,
    facilities: PropTypes.array.isRequired,
    openFilter: PropTypes.bool.isRequired,
    setOpenFilter: PropTypes.func.isRequired,
    selectedActivities: PropTypes.array.isRequired,
    setSelectedActivities: PropTypes.func.isRequired,
    selectedFacilities: PropTypes.array.isRequired,
    setSelectedFacilities: PropTypes.func.isRequired,
    searchText: PropTypes.string.isRequired,
    setSearchText: PropTypes.func.isRequired,
    sortOption: PropTypes.object.isRequired,
    setSortOption: PropTypes.func.isRequired,
    sortOptions: PropTypes.array.isRequired,
  }),
}

export default SearchFilter
