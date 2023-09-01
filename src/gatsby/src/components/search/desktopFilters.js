import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import {
  Link
} from "@mui/material"
import ExpandLess from "@mui/icons-material/ExpandLess"
import ExpandMore from "@mui/icons-material/ExpandMore"
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
  const [truncatedAreaFilterLength, setTruncatedAreaFilterLength] = useState(5)

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
      setTruncatedAreaFilterLength(5)
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
        <legend className="filter-heading p10t">Popular</legend>
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
      </fieldset>
      <fieldset className="mb-2">
        <legend className="filter-heading">Area</legend>
        <Filter
          filterItems={areaItems.slice(0, truncatedAreaFilterLength)}
          selectedFilterItems={selectedAreas}
          handleFilterCheck={handleAreaCheck}
        />
        <Link
          className="ml-auto pointer"
          onClick={() => {
            setMoreAreas(!showMoreAreas)
          }}
          tabIndex="0"
          role="link"
          underline="hover"
        >
          {showMoreAreas ? (
            <div style={{ color: `#2464A4` }}>
              Show all {areaItems.length}
              <ExpandMore fontSize="small" />
            </div>
          ) : (
            <div style={{ color: `#2464A4` }}>
              Show less
              <ExpandLess fontSize="small" />
            </div>
          )}
        </Link>

      </fieldset>
      <fieldset className="mb-2">
        <legend className="filter-heading">Camping</legend>
        <Filter
          filterItems={campingFacilityItems}
          selectedFilterItems={selectedCampingFacilities}
          handleFilterCheck={handleCampingFacilityCheck}
        />
      </fieldset>
      <fieldset className="mb-2">
        <legend className="filter-heading">Activities</legend>
        <Filter
          filterItems={activityItems.slice(0, truncatedActivityFilterLength)}
          selectedFilterItems={selectedActivities}
          handleFilterCheck={handleActivityCheck}
        />
        <Link
          className="ml-auto pointer"
          onClick={() => {
            setMoreActivites(!showMoreActivities)
          }}
          tabIndex="0"
          role="link"
          underline="hover"
        >
          {showMoreActivities ? (
            <div style={{ color: `#2464A4` }}>
              Show all {activityItems.length}
              <ExpandMore fontSize="small" />
            </div>
          ) : (
            <div style={{ color: `#2464A4` }}>
              Show less
              <ExpandLess fontSize="small" />
            </div>
          )}
        </Link>
      </fieldset>
      <fieldset>
        <legend className="filter-heading">Facilities</legend>
        <Filter
          filterItems={facilityItems.slice(0, truncatedFacilityFilterLength)}
          selectedFilterItems={selectedFacilities}
          handleFilterCheck={handleFacilityCheck}
        />
        <Link
          className="ml-auto pointer"
          onClick={() => {
            setMoreFacilities(!showMoreFacilities)
          }}
          tabIndex="0"
          role="link"
          underline="hover"
        >
          {showMoreFacilities ? (
            <div style={{ color: `#2464A4` }}>
              Show all {facilityItems.length}
              <ExpandMore fontSize="small" />
            </div>
          ) : (
            <div style={{ color: `#2464A4` }}>
              Show less
              <ExpandLess fontSize="small" />
            </div>
          )}
        </Link>
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
