import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { navigate } from "gatsby"
import {
  Link,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
  Collapse,
} from "@mui/material"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
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
    handleFacilityCheck
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
                      Area
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
                    filterItems={alphabeticAreaItems}
                    selectedFilterItems={selectedAreas}
                    handleFilterCheck={handleAreaCheck}
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
    handleFacilityCheck: PropTypes.func.isRequired
  }),
}

export default MobileFilters
