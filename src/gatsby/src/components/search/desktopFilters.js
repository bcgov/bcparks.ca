import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import Filter from "./filter"

import "../../styles/search.scss"

const DesktopFilters = ({
  data: {
    areaItems,
    campingFacilityItems,
    activityItems,
    facilityItems,
    selectedAreas,
    selectedCampingFacilities,
    selectedActivities,
    selectedFacilities,
    searchText,
    setFilters,
    handleAreaCheck,
    handleCampingFacilityCheck,
    handleActivityCheck,
    handleFacilityCheck
  },

}) => {
  const [showMoreActivities, setMoreActivites] = useState(true)
  const [showMoreFacilities, setMoreFacilities] = useState(true)
  const [showMoreAreas, setMoreAreas] = useState(true)
  const [truncatedActivityFilterLength, setTruncatedActivityFilterLength] = useState(5)
  const [truncatedFacilityFilterLength, setTruncatedFacilityFilterLength] = useState(5)
  const [truncatedAreaFilterLength, setTruncatedAreaFilterLength] = useState(6)

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

  useEffect(() => {
    if (showMoreActivities) {
      setTruncatedActivityFilterLength(5)
    } else {
      setTruncatedActivityFilterLength(activityItems.length)
    }
    if (showMoreFacilities) {
      setTruncatedFacilityFilterLength(5)
    } else {
      setTruncatedFacilityFilterLength(facilityItems.length)
    }
    if (showMoreAreas) {
      setTruncatedAreaFilterLength(6)
    } else {
      setTruncatedAreaFilterLength(areaItems.length)
    }
  }, [
    showMoreActivities, activityItems.length, showMoreFacilities,
    facilityItems.length, showMoreAreas, areaItems.length
  ])

  return (
    <div className="">
      <fieldset className="mb-2">
        <legend className="filter-heading">Popular</legend>
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
      </fieldset>
      <fieldset className="mb-2">
        <legend className="filter-heading">Area</legend>
        <Filter
          filterItems={areaItems.slice(0, truncatedAreaFilterLength)}
          selectedFilterItems={selectedAreas}
          handleFilterCheck={handleAreaCheck}
          filterType="area"
        />
        <button
          className="btn btn-link show-all-link"
          onClick={() => {
            setMoreAreas(!showMoreAreas)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              setMoreAreas(!showMoreAreas)
            }
          }}
        >
          {showMoreAreas ? (
            <>
              Show all {areaItems.length}
              <i className="fa fa-angle-down"></i>
            </>
          ) : (
            <>
              Show less
              <i className="fa fa-angle-up"></i>
            </>
          )}
        </button>
      </fieldset>
      <fieldset className="mb-2">
        <legend className="filter-heading">Camping</legend>
        <Filter
          filterItems={campingFacilityItems}
          selectedFilterItems={selectedCampingFacilities}
          handleFilterCheck={handleCampingFacilityCheck}
          filterType="camping"
        />
      </fieldset>
      <fieldset className="mb-2">
        <legend className="filter-heading">Activities</legend>
        <Filter
          filterItems={activityItems.slice(0, truncatedActivityFilterLength)}
          selectedFilterItems={selectedActivities}
          handleFilterCheck={handleActivityCheck}
          filterType="activities"
        />
        <button
          className="btn btn-link show-all-link"
          onClick={() => {
            setMoreActivites(!showMoreActivities)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              setMoreActivites(!showMoreActivities)
            }
          }}
        >
          {showMoreActivities ? (
            <>
              Show all {activityItems.length}
              <i className="fa fa-angle-down"></i>
            </>
          ) : (
            <>
              Show less
              <i className="fa fa-angle-up"></i>
            </>
          )}
        </button>
      </fieldset>
      <fieldset>
        <legend className="filter-heading">Facilities</legend>
        <Filter
          filterItems={facilityItems.slice(0, truncatedFacilityFilterLength)}
          selectedFilterItems={selectedFacilities}
          handleFilterCheck={handleFacilityCheck}
          filterType="facilities"
        />
        <button
          className="btn btn-link show-all-link"
          onClick={() => {
            setMoreFacilities(!showMoreFacilities)
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault()
              setMoreFacilities(!showMoreFacilities)
            }
          }}
        >
          {showMoreFacilities ? (
            <>
              Show all {facilityItems.length}
              <i className="fa fa-angle-down"></i>
            </>
          ) : (
            <>
              Show less
              <i className="fa fa-angle-up"></i>
            </>
          )}
        </button>
      </fieldset>
    </div>
  );
}

DesktopFilters.propTypes = {
  data: PropTypes.shape({
    areaItems: PropTypes.array.isRequired,
    campingFacilityItems: PropTypes.array.isRequired,
    activityItems: PropTypes.array.isRequired,
    facilityItems: PropTypes.array.isRequired,
    selectedAreas: PropTypes.array.isRequired,
    selectedCampingFacilities: PropTypes.array.isRequired,
    selectedActivities: PropTypes.array.isRequired,
    selectedFacilities: PropTypes.array.isRequired,
    searchText: PropTypes.string.isRequired,
    setFilters: PropTypes.func.isRequired,
    handleAreaCheck: PropTypes.func.isRequired,
    handleCampingFacilityCheck: PropTypes.func.isRequired,
    handleActivityCheck: PropTypes.func.isRequired,
    handleFacilityCheck: PropTypes.func.isRequired
  }),
}

export default DesktopFilters
