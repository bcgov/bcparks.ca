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
  Chip,
  InputAdornment,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Link,
} from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"
import CancelIcon from "@mui/icons-material/Cancel"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"

import "../../styles/search.scss"


const SearchFilter = ({
  data: {
    regionItems,
    campingFacilityItems,
    activityItems,
    facilityItems,
    quickSearchFilters,
    openFilter,
    setOpenFilter,
    quickSearch,
    selectedRegions,
    setSelectedRegions,
    selectedCampingFacilities,
    setSelectedCampingFacilities,
    selectedActivities,
    setSelectedActivities,
    selectedFacilities,
    setSelectedFacilities,
    setQuickSearch,
    searchText,
    setSearchText,
    setCurrentPage,
  },

}) => {
  const [showFilters, setShowFilter] = useState([false, false, false, false, false])
  const [filterSelections, setFilterSelections] = useState([])

  const handleCloseFilter = () => {
    setOpenFilter(false)
  }

  const handleQuickSearchChange = event => {
    setQuickSearch({
      ...quickSearch,
      [event.target.name]: event.target.checked,
    })
    setCurrentPage(1)
  }

  const handleRegionCheck = (region, event) => {
    if (event.target.checked) {
      setSelectedRegions([...selectedRegions, region])
    } else {
      setSelectedRegions([
        ...selectedRegions.filter(r => r.value !== region.value),
      ])
    }
    setCurrentPage(1);
  }

  const handleCampingFacilityCheck = (camping, event) => {
    if (event.target.checked) {
      setSelectedCampingFacilities([...selectedCampingFacilities, camping])
    } else {
      setSelectedCampingFacilities([
        ...selectedCampingFacilities.filter(c => c.value !== camping.value),
      ])
    }
    setCurrentPage(1);
  }

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

  const handleRegionDelete = chipToDelete => {
    setSelectedRegions(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
    setCurrentPage(1)
  }

  const handleCampingFacilityDelete = chipToDelete => {
    setSelectedCampingFacilities(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
    setCurrentPage(1)
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
    if (chipToDelete.type === "region") {
      handleRegionDelete(chipToDelete)
    } else if (chipToDelete.type === "campingFacility") {
      handleCampingFacilityDelete(chipToDelete)
    } else if (chipToDelete.type === "activity") {
      handleActivityDelete(chipToDelete)
    } else if (chipToDelete.type === "facility") {
      handleFacilityDelete(chipToDelete)
    }
    setCurrentPage(1);
  }

  const setFilters = useCallback(() => {
    const filters = []
    selectedRegions.forEach(r => {
      filters.push({ ...r, type: "region" })
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

    filters.sort((a, b) => a.label.localeCompare(b.label))
    setFilterSelections([...filters])
  }, [
    selectedRegions,
    selectedCampingFacilities,
    selectedActivities,
    selectedFacilities,
  ])

  const searchParkFilter = () => {
    setCurrentPage(1);
    navigate("/find-a-park", {
      state: {
        selectedRegions,
        selectedCampingFacilities,
        selectedActivities,
        selectedFacilities,
        searchText,
      },
    })
    setOpenFilter(false)
  }

  useEffect(() => {
    setFilters()
  }, [
    searchText,
    selectedRegions,
    selectedCampingFacilities,
    selectedActivities,
    selectedFacilities,
    setFilters
  ])

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
              <div className="p20l-filter col-lg-8 col-md-12 col-sm-12">
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
                            Popular
                          </div>
                        </div>
                      </div>
                      <Collapse
                        in={showFilters[0]}
                        timeout="auto"
                        unmountOnExit
                        className="p20"
                      >
                        <div className="row container">
                          <div className="col-lg-6 col-md-12 col-sm-12">
                            {quickSearchFilters.map((item, index) => (
                              <FormGroup
                                className="pr30 filter-options-container"
                                key={index}
                              >
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={quickSearch[item.type]}
                                      onChange={handleQuickSearchChange}
                                      name={item.type}
                                    />
                                  }
                                  label={item.label}
                                  className={
                                    quickSearch[item.type]
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
                            Region
                          </div>
                        </div>
                      </div>
                      <Collapse
                        in={showFilters[1]}
                        timeout="auto"
                        unmountOnExit
                        className="p20"
                      >
                        <div className="row container">
                          <div className="col-lg-6 col-md-12 col-sm-12">
                            {regionItems.map((item, index) => (
                              <FormGroup
                                className="pr30 filter-options-container"
                                key={index}
                              >
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        selectedRegions.filter(
                                          region => region.value === item.value
                                        ).length === 1
                                          ? true
                                          : false
                                      }
                                      onChange={event => {
                                        handleRegionCheck(item, event)
                                      }}
                                      name={item.label}
                                    />
                                  }
                                  label={item.label}
                                  className={
                                    selectedRegions.filter(
                                      region => region.value === item.value
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
                            handleShowFilterClick(2)
                          }}
                          tabIndex="0"
                          role="button"
                          onKeyPress={() => {
                            handleShowFilterClick(2)
                          }}
                        >
                          {showFilters[2] ? (
                            <ExpandLess fontSize="large" className="mtm5" />
                          ) : (
                            <ExpandMore fontSize="large" className="mtm5" />
                          )}
                          <div className="p10l park-select-label">
                            Camping
                          </div>
                        </div>
                      </div>
                      <Collapse
                        in={showFilters[2]}
                        timeout="auto"
                        unmountOnExit
                        className="p20"
                      >
                        <div className="row container">
                          <div className="col-lg-6 col-md-12 col-sm-12">
                            {campingFacilityItems.map((item, index) => (
                              <FormGroup
                                className="pr30 filter-options-container"
                                key={index}
                              >
                                <FormControlLabel
                                  control={
                                    <Checkbox
                                      checked={
                                        selectedCampingFacilities.filter(
                                          camping => camping.value === item.value
                                        ).length === 1
                                          ? true
                                          : false
                                      }
                                      onChange={event => {
                                        handleCampingFacilityCheck(item, event)
                                      }}
                                      name={item.label}
                                    />
                                  }
                                  label={item.label}
                                  className={
                                    selectedCampingFacilities.filter(
                                      camping => camping.value === item.value
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
                            handleShowFilterClick(3)
                          }}
                          tabIndex="0"
                          role="button"
                          onKeyPress={() => {
                            handleShowFilterClick(3)
                          }}
                        >
                          {showFilters[3] ? (
                            <ExpandLess fontSize="large" className="mtm5" />
                          ) : (
                            <ExpandMore fontSize="large" className="mtm5" />
                          )}
                          <div className="p10l park-select-label">
                            Activities
                          </div>
                        </div>
                      </div>
                      <Collapse
                        in={showFilters[3]}
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
                            handleShowFilterClick(4)
                          }}
                          tabIndex="0"
                          role="button"
                          onKeyPress={() => {
                            handleShowFilterClick(4)
                          }}
                        >
                          {showFilters[4] ? (
                            <ExpandLess fontSize="large" className="mtm5" />
                          ) : (
                            <ExpandMore fontSize="large" className="mtm5" />
                          )}
                          <div className="p10l park-select-label">
                            Facilities
                          </div>
                        </div>
                      </div>
                      <Collapse
                        in={showFilters[4]}
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
  );
}

SearchFilter.propTypes = {
  data: PropTypes.shape({
    regionItems: PropTypes.array.isRequired,
    campingFacilityItems: PropTypes.array.isRequired,
    activityItems: PropTypes.array.isRequired,
    facilityItems: PropTypes.array.isRequired,
    quickSearchFilters: PropTypes.array.isRequired,
    openFilter: PropTypes.bool.isRequired,
    setOpenFilter: PropTypes.func.isRequired,
    quickSearch: PropTypes.object.isRequired,
    selectedRegions: PropTypes.array.isRequired,
    setSelectedRegions: PropTypes.func.isRequired,
    selectedCampingFacilities: PropTypes.array.isRequired,
    setSelectedCampingFacilities: PropTypes.func.isRequired,
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
