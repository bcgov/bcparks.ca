import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { Modal, Collapse } from "react-bootstrap"
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
    <Modal
      show={openFilter}
      onHide={handleCloseFilter}
      aria-labelledby="park-filter-modal"
      className="park-filter-modal d-block d-lg-none"
      scrollable
    >
      <Modal.Body className="park-filter-modal-content">
        <div className="park-filter-modal-content--header">
          <h2>Filter</h2>
          <button
            aria-label="close"
            className="btn"
            onClick={() => handleCloseFilter()}
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>
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
        <div className="park-filter-options">
          <div
            className="park-filter-option-label pointer p-3"
            onClick={() => {
              handleShowFilterClick(0)
            }}
            tabIndex="0"
            role="button"
            onKeyDown={() => {
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
          <Collapse
            in={showFilters[0]}
            className="p-3"
          >
            <div>
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
            </div>
          </Collapse>
        </div>
        <div className="park-filter-options">
          <div
            className="park-filter-option-label pointer p-3"
            onClick={() => {
              handleShowFilterClick(1)
            }}
            tabIndex="0"
            role="button"
            onKeyDown={() => {
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
          <Collapse
            in={showFilters[1]}
            className="p-3"
          >
            <div>
              <Filter
                filterItems={alphabeticAreaItems}
                selectedFilterItems={selectedAreas}
                handleFilterCheck={handleAreaCheck}
                filterType="area"
              />
            </div>
          </Collapse>
        </div>
        <div className="park-filter-options">
          <div
            className="park-filter-option-label pointer p-3"
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
          <Collapse
            in={showFilters[2]}
            className="p-3"
          >
            <div>
              <Filter
                filterItems={campingFacilityItems}
                selectedFilterItems={selectedCampingFacilities}
                handleFilterCheck={handleCampingFacilityCheck}
                filterType="camping"
              />
            </div>
          </Collapse>
        </div>
        <div className="park-filter-options">
          <div
            className="park-filter-option-label  pointer p-3"
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
          <Collapse
            in={showFilters[3]}
            className="p-3"
          >
            <div>
              <Filter
                filterItems={activityItems}
                selectedFilterItems={selectedActivities}
                handleFilterCheck={handleActivityCheck}
                filterType="activities"
              />
            </div>
          </Collapse>
        </div>
        <div className="park-filter-options">
          <div
            className="park-filter-option-label pointer p-3"
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
          <Collapse
            in={showFilters[4]}
            className="p-3"
          >
            <div>
              <Filter
                filterItems={facilityItems}
                selectedFilterItems={selectedFacilities}
                handleFilterCheck={handleFacilityCheck}
                filterType="facilities"
              />
            </div>
          </Collapse>
        </div>
      </Modal.Body>
      <Modal.Footer className="d-block">
        <button
          aria-label="Show parks"
          onClick={() => {
            searchParkFilter()
          }}
          className="btn btn-primary w-100 mx-0 mb-2"
        >
          Show {totalResults} {totalResults > 1 ? "parks" : "park"}
        </button>
        <button
          className="btn btn-link clear-filter-link w-100"
          onClick={handleClearFilter}
        >
          Clear filters
        </button>
      </Modal.Footer>
    </Modal>
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
