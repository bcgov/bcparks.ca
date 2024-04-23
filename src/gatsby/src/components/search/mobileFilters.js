import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
  Dialog,
  DialogContent,
  DialogActions,
  Collapse,
} from "@mui/material"
import IconButton from '@mui/material/IconButton'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faXmark } from "@fortawesome/free-solid-svg-icons"
import Filter from "./filter"

import "../../styles/search.scss"

const MobileFilters = ({
  data: {
    totalResults,
    areaItems,
    campingFacilityItems,
    activityItems,
    facilityItems,
    openFilter,
    setOpenFilter,
    selectedAreas,
    selectedCampingFacilities,
    selectedActivities,
    selectedFacilities,
    searchText,
    setCurrentPage,
    setFilters,
    handleAreaCheck,
    handleCampingFacilityCheck,
    handleActivityCheck,
    handleFacilityCheck,
    handleClearFilter
  },

}) => {
  const [showFilters, setShowFilter] = useState([false, false, false, false, false])
  const [expandAll, setExpandAll] = useState(false)

  const alphabeticAreaItems = areaItems.slice(0)
  alphabeticAreaItems.sort((a, b) => { return a.label > b.label ? 1 : -1 })

  const handleExpandAll = () => {
    const newShowFilters = Array.from(showFilters, (filter) => !expandAll)
    setShowFilter(newShowFilters)
    setExpandAll(!expandAll)
  }

  const handleCloseFilter = () => {
    setOpenFilter(false)
  }

  // event handlers
  const handleShowFilterClick = index => {
    const tempShowFilter = showFilters
    tempShowFilter[index] = !tempShowFilter[index]
    setShowFilter([...tempShowFilter])
  }

  const searchParkFilter = () => {
    setCurrentPage(1);
    setOpenFilter(false)
  }

  useEffect(() => {
    setFilters()
  }, [
    searchText,
    selectedAreas,
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
          <div className="park-filter-dialog-content--header">
            <h1>Filter</h1>
            <IconButton
              aria-label="close"
              onClick={() => {
                handleCloseFilter()
              }}
            >
              <FontAwesomeIcon icon={faXmark} />
            </IconButton>
          </div>
          <button
            className="btn btn-link expand-link expand-icon"
            onClick={handleExpandAll}
          >
            {expandAll ? "Collapse" : "Expand"} all
            {expandAll ? (
              <i className="fa fa-angle-up"></i>
            ) : (
              <i className="fa fa-angle-down"></i>
            )}
          </button>
          <div className="row mt-3">
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
                      <i className="fa fa-angle-up"></i>
                    ) : (
                      <i className="fa fa-angle-down"></i>
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
                    filterType="popular"
                  />
                  <Filter
                    filterItems={activityItems.filter(
                      a => a.value === 1 || a.value === 8 || a.value === 9
                    )}
                    selectedFilterItems={selectedActivities}
                    handleFilterCheck={handleActivityCheck}
                    filterType="popular"
                  />
                  <Filter
                    filterItems={facilityItems.filter(f => f.value === 6)}
                    selectedFilterItems={selectedFacilities}
                    handleFilterCheck={handleFacilityCheck}
                    filterType="popular"
                  />
                  <Filter
                    filterItems={activityItems.filter(
                      a => a.value === 3
                    )}
                    selectedFilterItems={selectedActivities}
                    handleFilterCheck={handleActivityCheck}
                    filterType="popular"
                  />
                  <Filter
                    filterItems={campingFacilityItems.filter(
                      c => c.value === 1
                    )}
                    selectedFilterItems={selectedCampingFacilities}
                    handleFilterCheck={handleCampingFacilityCheck}
                    filterType="popular"
                  />
                </Collapse>
              </div>
            </div>
          </div>
          <div className="row mt-3">
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
                      Area
                    </div>
                    {showFilters[1] ? (
                      <i className="fa fa-angle-up"></i>
                    ) : (
                      <i className="fa fa-angle-down"></i>
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
                    filterItems={alphabeticAreaItems}
                    selectedFilterItems={selectedAreas}
                    handleFilterCheck={handleAreaCheck}
                    filterType="area"
                  />
                </Collapse>
              </div>
            </div>
          </div>

          <div className="row mt-3">
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
                    onKeyDown={() => {
                      handleShowFilterClick(2)
                    }}
                  >
                    <div className="park-select-label">
                      Camping
                    </div>
                    {showFilters[2] ? (
                      <i className="fa fa-angle-up"></i>
                    ) : (
                      <i className="fa fa-angle-down"></i>
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
                    filterType="camping"
                  />
                </Collapse>
              </div>
            </div>
          </div>

          <div className="row mt-3">
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
                    onKeyDown={() => {
                      handleShowFilterClick(3)
                    }}
                  >
                    <div className="park-select-label">
                      Activities
                    </div>
                    {showFilters[3] ? (
                      <i className="fa fa-angle-up"></i>
                    ) : (
                      <i className="fa fa-angle-down"></i>
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
                    filterType="activities"
                  />
                </Collapse>
              </div>
            </div>
          </div>
          <div className="row mt-3">
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
                    onKeyDown={() => {
                      handleShowFilterClick(4)
                    }}
                  >
                    <div className="park-select-label">
                      Facilities
                    </div>
                    {showFilters[4] ? (
                      <i className="fa fa-angle-up"></i>
                    ) : (
                      <i className="fa fa-angle-down"></i>
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
                    filterType="facilities"
                  />
                </Collapse>
              </div>
            </div>
          </div>
        </DialogContent>
        <DialogActions className="park-filter-dialog-action d-block">
          <div className="row">
            <div className="col-12">
              <button
                aria-label="Show parks"
                onClick={() => {
                  searchParkFilter()
                }}
                className="btn btn-primary w-100"
              >
                Show {totalResults} {totalResults > 1 ? "parks" : "park"}
              </button>
            </div>
            <div className="col-12 d-flex justify-content-center mt-3">
              <button
                className="btn btn-link clear-filter-link"
                onClick={handleClearFilter}
              >
                Clear filters
              </button>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  );
}

MobileFilters.propTypes = {
  data: PropTypes.shape({
    totalResults: PropTypes.number.isRequired,
    areaItems: PropTypes.array.isRequired,
    campingFacilityItems: PropTypes.array.isRequired,
    activityItems: PropTypes.array.isRequired,
    facilityItems: PropTypes.array.isRequired,
    openFilter: PropTypes.bool.isRequired,
    setOpenFilter: PropTypes.func.isRequired,
    selectedAreas: PropTypes.array.isRequired,
    selectedCampingFacilities: PropTypes.array.isRequired,
    selectedActivities: PropTypes.array.isRequired,
    selectedFacilities: PropTypes.array.isRequired,
    searchText: PropTypes.string.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    setFilters: PropTypes.func.isRequired,
    handleAreaCheck: PropTypes.func.isRequired,
    handleCampingFacilityCheck: PropTypes.func.isRequired,
    handleActivityCheck: PropTypes.func.isRequired,
    handleFacilityCheck: PropTypes.func.isRequired,
    handleClearFilter: PropTypes.func.isRequired
  }),
}

export default MobileFilters
