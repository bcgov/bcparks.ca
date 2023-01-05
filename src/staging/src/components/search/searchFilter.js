import React, { useState, useEffect, useCallback } from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import {
  TextField,
  Dialog,
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
import SearchIcon from "@material-ui/icons/Search"
import CancelIcon from "@material-ui/icons/Cancel"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"

import "../../styles/search.scss"


const SearchFilter = ({
  data: {
    activityItems,
    facilityItems,
    openFilter,
    setOpenFilter,
    selectedActivities,
    setSelectedActivities,
    selectedFacilities,
    setSelectedFacilities,
    searchText,
    setSearchText,
    setCurrentPage,
  },

}) => {
  const [showFilters, setShowFilter] = useState([false, false])
  const [filterSelections, setFilterSelections] = useState([])

  const handleCloseFilter = () => {
    setOpenFilter(false)
  }

  //TODO: Quick Search/Popular

  const handleActivityCheck = (activity, event) => {
    if (event.target.checked) {
      setSelectedActivities([...selectedActivities, activity])
    } else {
      setSelectedActivities([
        ...selectedActivities.filter(a => a.value !== activity.value),
      ])
    }
    setCurrentPage(1);
  }

  const handleFacilityCheck = (facility, event) => {
    if (event.target.checked) {
      setSelectedFacilities([...selectedFacilities, facility])
    } else {
      setSelectedFacilities([
        ...selectedFacilities.filter(f => f.value !== facility.value),
      ])
    }
    setCurrentPage(1);
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
    setCurrentPage(1);
  }

  const handleFacilityDelete = chipToDelete => {
    setSelectedFacilities(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
    setCurrentPage(1);
  }

  const handleFilterDelete = chipToDelete => () => {
    if (chipToDelete.type === "activity") {
      handleActivityDelete(chipToDelete)
    } else if (chipToDelete.type === "facility") {
      handleFacilityDelete(chipToDelete)
    }
    setCurrentPage(1);
  }

  const setFilters = useCallback(() => {
    const filters = []
    selectedActivities.forEach(a => {
      filters.push({ ...a, type: "activity" })
    })
    selectedFacilities.forEach(f => {
      filters.push({ ...f, type: "facility" })
    })

    filters.sort((a, b) => a.label.localeCompare(b.label))
    setFilterSelections([...filters])
  }, [
    selectedActivities,
    selectedFacilities,])

  const searchParkFilter = () => {
    setCurrentPage(1);
    navigate("/find-a-park", {
      state: {
        selectedActivities,
        selectedFacilities,
        searchText,
      },
    })
    setOpenFilter(false)
  }

  useEffect(() => {
    setFilters()
  }, [searchText, selectedActivities, selectedFacilities, setFilters])

  return (
    <div>
      <Dialog
        open={openFilter}
        onClose={handleCloseFilter}
        aria-labelledby="park-filter-dialog"
        className="park-filter-dialog"
        scroll="paper"
      >
        <DialogContent className="park-filter-dialog-content">
          <div className="container p10">
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
              <div className="col-lg-3 col-md-8 col-sm-8 mt8 d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
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
            </div>
            <div className="row p20t no-gutters">
              <div className="col-lg-4 col-md-12 col-sm-12 pb20">
                <div className="park-filter-options">
                  <div className="park-filter-option-label p20 flex-display">
                    <div className="text-black">
                      <b>Selected Filters</b>
                    </div>
                    <Link
                      className="ml-auto pointer"
                      onClick={() => {
                        setSelectedActivities([])
                        setSelectedFacilities([])
                        //TODO: Quick Search/Popular
                        //setQuickSearch([])
                      }}
                      tabIndex="0"
                    >
                      Reset all
                    </Link>
                  </div>
                  <Divider className="grey-divider" />
                  {filterSelections.length === 0 && (
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
              <div className="p20l-filter col-lg-8 col-md-12 col-sm-12">

                {/* TODO: Quick Search/Popular */}

                <div className="row p20t">
                  <div className="col-12">
                    <div className="park-filter-options">

                      <div className="park-filter-option-label flex-display">
                        <div
                          className="flex-display pointer full-width p20"
                          onClick={() => {
                            handleShowFilterClick(0)
                          }}
                          tabIndex="0"
                          role="button"
                          onKeyPress={() => {
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
                          className="ml-auto pointer p20"
                          onClick={() => {
                            setSelectedActivities([])
                          }}
                          tabIndex="0"
                          href="#"
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
                        <div className="row container">
                          <div className="col-lg-6 col-md-12 col-sm-12">
                            {activityItems.map((a, index) => (
                              <FormGroup
                                className="pr30 filter-options-container"
                                key={index}
                              >
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
                                  className={
                                    selectedActivities.filter(
                                      act => act.value === a.value
                                    ).length === 1
                                      ? "text-light-blue no-wrap"
                                      : "no-wrap"
                                  }
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
                          className="flex-display pointer full-width p20"
                          onClick={() => {
                            handleShowFilterClick(1)
                          }}
                          tabIndex="0"
                          role="button"
                          onKeyPress={() => {
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
                          className="ml-auto pointer p20"
                          onClick={() => {
                            setSelectedFacilities([])
                          }}
                          tabIndex="0"
                          href="#"
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
                        <div className="row container">
                          <div className="col-lg-6 col-md-12 col-sm-12">
                            {facilityItems.map((f, index) => (
                              <FormGroup
                                className="pr30 filter-options-container"
                                key={index}
                              >
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
                                  className={
                                    selectedFacilities.filter(
                                      fa => fa.value === f.value
                                    ).length === 1
                                      ? "text-light-blue no-wrap"
                                      : "no-wrap"
                                  }
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
          </div>
        </DialogContent>
        <DialogActions className="d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none p20 container">
          <div className="row">
            <div className="col-12 mt8">
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
            <div className="col-12 mt8">
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
        </DialogActions>
      </Dialog>
    </div>
  )
}

SearchFilter.propTypes = {
  data: PropTypes.shape({
    activityItems: PropTypes.array.isRequired,
    facilityItems: PropTypes.array.isRequired,
    quickSearchFilters: PropTypes.array.isRequired,
    openFilter: PropTypes.bool.isRequired,
    setOpenFilter: PropTypes.func.isRequired,
    quickSearch: PropTypes.object.isRequired,
    selectedActivities: PropTypes.array.isRequired,
    setSelectedActivities: PropTypes.func.isRequired,
    selectedFacilities: PropTypes.array.isRequired,
    setSelectedFacilities: PropTypes.func.isRequired,
    setQuickSearch: PropTypes.func.isRequired,
    searchText: PropTypes.string.isRequired,
    setSearchText: PropTypes.func.isRequired,
    setCurrentPage: PropTypes.func.isRequired
  }),
}

export default SearchFilter
