import React, { useState, useEffect, useCallback } from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import {
  Link,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Collapse,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"

import "../../styles/search.scss"

const Filter = ({ filterItems, selectedFilterItems, handleFilterCheck }) => {
  return (
    <FormGroup className="filter-options-container">
      {filterItems.map(item =>
        <FormControlLabel
          key={item.label}
          control={
            <Checkbox
              checked={
                selectedFilterItems.filter(
                  selectedFilterItem =>
                    selectedFilterItem.value === item.value
                ).length === 1 ? true : false
              }
              onChange={event => {
                handleFilterCheck(item, event)
              }}
              name={item.label}
            />
          }
          label={`${item.label} (${item.count})`}
          className={
            selectedFilterItems.filter(
              selectedFilterItem =>
                selectedFilterItem.value === item.value
            ).length === 1 ? "text-light-blue no-wrap" : "no-wrap"
          }
          disabled={item.count === 0}
        />
      )}
    </FormGroup>
  )
}

const SearchFilter = ({
  data: {
    totalResults,
    regionItems,
    campingFacilityItems,
    activityItems,
    facilityItems,
    openFilter,
    setOpenFilter,
    selectedRegions,
    setSelectedRegions,
    selectedCampingFacilities,
    setSelectedCampingFacilities,
    selectedActivities,
    setSelectedActivities,
    selectedFacilities,
    setSelectedFacilities,
    searchText,
    setCurrentPage,
  },

}) => {
  const [showFilters, setShowFilter] = useState([false, false, false, false, false])
  const [expandAll, setExpandAll] = useState(false)

  const handleExpandAll = () => {
    const newShowFilters = Array.from(showFilters, (filter) => !expandAll)
    setShowFilter(newShowFilters)
    setExpandAll(!expandAll)
  }

  const handleCloseFilter = () => {
    setOpenFilter(false)
  }

  // event handlers
  const handleRegionCheck = (region, event) => {
    setCurrentPage(1)
    if (event.target.checked) {
      setSelectedRegions([...selectedRegions, region])
    } else {
      setSelectedRegions([
        ...selectedRegions.filter(r => r.value !== region.value),
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

  const handleShowFilterClick = index => {
    const tempShowFilter = showFilters
    tempShowFilter[index] = !tempShowFilter[index]
    setShowFilter([...tempShowFilter])
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
        className="park-filter-dialog d-block d-lg-none"
        scroll="paper"
      >
        <DialogContent className="park-filter-dialog-content">
          <h1>Filter</h1>
          <Link
            className="expand-link"
            onClick={handleExpandAll}
            tabIndex="0"
            role="link"
            underline="hover"
          >
            {expandAll ? "Collapse" : "Expand"} all
            {expandAll ? (
              <ExpandLess fontSize="small" />
            ) : (
              <ExpandMore fontSize="small" />
            )}
          </Link>
          <div className="row p20t">
            <div className="col-12">
              <div className="park-filter-options">
                <div className="park-filter-option-label flex-display">
                  <div
                    className="flex-display pointer full-width p-3"
                    onClick={() => {
                      handleShowFilterClick(0)
                    }}
                    tabIndex="0"
                    role="button"
                    onKeyPress={() => {
                      handleShowFilterClick(0)
                    }}
                  >
                    <div className="park-select-label">
                      Popular
                    </div>
                    {showFilters[0] ? (
                      <ExpandLess fontSize="large" className="mtm5" />
                    ) : (
                      <ExpandMore fontSize="large" className="mtm5" />
                    )}
                  </div>
                </div>
                <Collapse
                  in={showFilters[0]}
                  timeout="auto"
                  unmountOnExit
                  className="p-3"
                >
                  <Filter
                    filterItems={campingFacilityItems.filter(
                      c => c.value === 36
                    )}
                    selectedFilterItems={selectedCampingFacilities}
                    handleFilterCheck={handleCampingFacilityCheck}
                  />
                  <Filter
                    filterItems={activityItems.filter(
                      a => a.value === 1 || a.value === 8 || a.value === 9
                    )}
                    selectedFilterItems={selectedActivities}
                    handleFilterCheck={handleActivityCheck}
                  />
                  <Filter
                    filterItems={facilityItems.filter(f => f.value === 6)}
                    selectedFilterItems={selectedFacilities}
                    handleFilterCheck={handleFacilityCheck}
                  />
                  <Filter
                    filterItems={activityItems.filter(
                      a => a.value === 3
                    )}
                    selectedFilterItems={selectedActivities}
                    handleFilterCheck={handleActivityCheck}
                  />
                  <Filter
                    filterItems={campingFacilityItems.filter(
                      c => c.value === 1
                    )}
                    selectedFilterItems={selectedCampingFacilities}
                    handleFilterCheck={handleCampingFacilityCheck}
                  />
                </Collapse>
              </div>
            </div>
          </div>
          <div className="row p20t">
            <div className="col-12">
              <div className="park-filter-options">
                <div className="park-filter-option-label flex-display">
                  <div
                    className="flex-display pointer full-width p-3"
                    onClick={() => {
                      handleShowFilterClick(1)
                    }}
                    tabIndex="0"
                    role="button"
                    onKeyPress={() => {
                      handleShowFilterClick(1)
                    }}
                  >
                    <div className="park-select-label">
                      Region
                    </div>
                    {showFilters[1] ? (
                      <ExpandLess fontSize="large" className="mtm5" />
                    ) : (
                      <ExpandMore fontSize="large" className="mtm5" />
                    )}
                  </div>
                </div>
                <Collapse
                  in={showFilters[1]}
                  timeout="auto"
                  unmountOnExit
                  className="p-3"
                >
                  <Filter
                    filterItems={regionItems}
                    selectedFilterItems={selectedRegions}
                    handleFilterCheck={handleRegionCheck}
                  />
                </Collapse>
              </div>
            </div>
          </div>

          <div className="row p20t">
            <div className="col-12">
              <div className="park-filter-options">
                <div className="park-filter-option-label flex-display">
                  <div
                    className="flex-display pointer full-width p-3"
                    onClick={() => {
                      handleShowFilterClick(2)
                    }}
                    tabIndex="0"
                    role="button"
                    onKeyPress={() => {
                      handleShowFilterClick(2)
                    }}
                  >
                    <div className="park-select-label">
                      Camping
                    </div>
                    {showFilters[2] ? (
                      <ExpandLess fontSize="large" className="mtm5" />
                    ) : (
                      <ExpandMore fontSize="large" className="mtm5" />
                    )}
                  </div>
                </div>
                <Collapse
                  in={showFilters[2]}
                  timeout="auto"
                  unmountOnExit
                  className="p-3"
                >
                  <Filter
                    filterItems={campingFacilityItems}
                    selectedFilterItems={selectedCampingFacilities}
                    handleFilterCheck={handleCampingFacilityCheck}
                  />
                </Collapse>
              </div>
            </div>
          </div>

          <div className="row p20t">
            <div className="col-12">
              <div className="park-filter-options">

                <div className="park-filter-option-label flex-display">
                  <div
                    className="flex-display pointer full-width p-3"
                    onClick={() => {
                      handleShowFilterClick(3)
                    }}
                    tabIndex="0"
                    role="button"
                    onKeyPress={() => {
                      handleShowFilterClick(3)
                    }}
                  >
                    <div className="park-select-label">
                      Activities
                    </div>
                    {showFilters[3] ? (
                      <ExpandLess fontSize="large" className="mtm5" />
                    ) : (
                      <ExpandMore fontSize="large" className="mtm5" />
                    )}
                  </div>
                </div>
                <Collapse
                  in={showFilters[3]}
                  timeout="auto"
                  unmountOnExit
                  className="p-3"
                >
                  <Filter
                    filterItems={activityItems}
                    selectedFilterItems={selectedActivities}
                    handleFilterCheck={handleActivityCheck}
                  />
                </Collapse>
              </div>
            </div>
          </div>
          <div className="row p20t">
            <div className="col-12">
              <div className="park-filter-options">
                <div className="park-filter-option-label flex-display">
                  <div
                    className="flex-display pointer full-width p-3"
                    onClick={() => {
                      handleShowFilterClick(4)
                    }}
                    tabIndex="0"
                    role="button"
                    onKeyPress={() => {
                      handleShowFilterClick(4)
                    }}
                  >
                    <div className="park-select-label">
                      Facilities
                    </div>
                    {showFilters[4] ? (
                      <ExpandLess fontSize="large" className="mtm5" />
                    ) : (
                      <ExpandMore fontSize="large" className="mtm5" />
                    )}
                  </div>
                </div>
                <Collapse
                  in={showFilters[4]}
                  timeout="auto"
                  unmountOnExit
                  className="p-3"
                >
                  <Filter
                    filterItems={facilityItems}
                    selectedFilterItems={selectedFacilities}
                    handleFilterCheck={handleFacilityCheck}
                  />
                </Collapse>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="park-filter-dialog-action d-block">
          <div className="row">
            <div className="col-12 mt8">
              <Button
                variant="contained"
                onClick={() => {
                  searchParkFilter()
                }}
                className="bcgov-button bcgov-normal-blue"
              >
                Show {totalResults} {totalResults > 1 ? "parks" : "park"}
              </Button>
            </div>
            <div className="col-12 mt8">
              <Button
                variant="outlined"
                onClick={() => {
                  handleCloseFilter()
                }}
                className="bcgov-button bcgov-normal-white"
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
    totalResults: PropTypes.number.isRequired,
    regionItems: PropTypes.array.isRequired,
    campingFacilityItems: PropTypes.array.isRequired,
    activityItems: PropTypes.array.isRequired,
    facilityItems: PropTypes.array.isRequired,
    openFilter: PropTypes.bool.isRequired,
    setOpenFilter: PropTypes.func.isRequired,
    selectedRegions: PropTypes.array.isRequired,
    setSelectedRegions: PropTypes.func.isRequired,
    selectedCampingFacilities: PropTypes.array.isRequired,
    setSelectedCampingFacilities: PropTypes.func.isRequired,
    selectedActivities: PropTypes.array.isRequired,
    setSelectedActivities: PropTypes.func.isRequired,
    selectedFacilities: PropTypes.array.isRequired,
    setSelectedFacilities: PropTypes.func.isRequired,
    searchText: PropTypes.string.isRequired,
    setCurrentPage: PropTypes.func.isRequired
  }),
}

export default SearchFilter
