import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronUp, faChevronDown } from "@fortawesome/free-solid-svg-icons"
import Filter from "./filter"

import "../../styles/search.scss"

const DesktopFilters = ({
  data: {
    areaItems,
    campingTypeItems,
    activityItems,
    facilityItems,
    selectedAreas,
    selectedParkCampingTypes,
    selectedActivities,
    selectedFacilities,
    searchText,
    setFilters,
    handleAreaCheck,
    handleCampingTypeCheck,
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
    selectedParkCampingTypes,
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
          filterItems={campingTypeItems.filter(
            c => c.value === 36
          )}
          selectedFilterItems={selectedParkCampingTypes}
          handleFilterCheck={handleCampingTypeCheck}
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
          filterItems={campingTypeItems.filter(
            c => c.value === 1
          )}
          selectedFilterItems={selectedParkCampingTypes}
          handleFilterCheck={handleCampingTypeCheck}
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
          aria-label={showMoreAreas ?
            `Show all ${areaItems.length} areas` : "Show fewer areas"}
          onClick={() => {
            setMoreAreas(!showMoreAreas)
          }}
        >
          {showMoreAreas ? (
            <>
              Show all {areaItems.length}
              <FontAwesomeIcon icon={faChevronDown} />
            </>
          ) : (
            <>
              Show less
              <FontAwesomeIcon icon={faChevronUp} />
            </>
          )}
        </button>
      </fieldset>
      <fieldset className="mb-2">
        <legend className="filter-heading">Camping</legend>
        <Filter
          filterItems={campingTypeItems}
          selectedFilterItems={selectedParkCampingTypes}
          handleFilterCheck={handleCampingTypeCheck}
          filterType="camping"
        />
      </fieldset>
      <fieldset className="mb-2">
        <legend className="filter-heading">Things to do</legend>
        <Filter
          filterItems={activityItems.slice(0, truncatedActivityFilterLength)}
          selectedFilterItems={selectedActivities}
          handleFilterCheck={handleActivityCheck}
          filterType="activities"
        />
        <button
          className="btn btn-link show-all-link"
          aria-label={showMoreActivities ? 
            `Show all ${activityItems.length} things to do` : "Show fewer things to do"}
          onClick={() => {
            setMoreActivites(!showMoreActivities)
          }}
        >
          {showMoreActivities ? (
            <>
              Show all {activityItems.length}
              <FontAwesomeIcon icon={faChevronDown} />
            </>
          ) : (
            <>
              Show less
              <FontAwesomeIcon icon={faChevronUp} />
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
          aria-label={showMoreFacilities ? 
            `Show all ${facilityItems.length} facilities` : "Show fewer facilities"}
          onClick={() => {
            setMoreFacilities(!showMoreFacilities)
          }}
        >
          {showMoreFacilities ? (
            <>
              Show all {facilityItems.length}
              <FontAwesomeIcon icon={faChevronDown} />
            </>
          ) : (
            <>
              Show less
              <FontAwesomeIcon icon={faChevronUp} />
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
    campingTypeItems: PropTypes.array.isRequired,
    activityItems: PropTypes.array.isRequired,
    facilityItems: PropTypes.array.isRequired,
    selectedAreas: PropTypes.array.isRequired,
    selectedParkCampingTypes: PropTypes.array.isRequired,
    selectedActivities: PropTypes.array.isRequired,
    selectedFacilities: PropTypes.array.isRequired,
    searchText: PropTypes.string.isRequired,
    setFilters: PropTypes.func.isRequired,
    handleAreaCheck: PropTypes.func.isRequired,
    handleCampingTypeCheck: PropTypes.func.isRequired,
    handleActivityCheck: PropTypes.func.isRequired,
    handleFacilityCheck: PropTypes.func.isRequired
  }),
}

export default DesktopFilters
