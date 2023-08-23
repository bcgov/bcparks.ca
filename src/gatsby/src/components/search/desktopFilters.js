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
    regionItems,
    campingFacilityItems,
    activityItems,
    facilityItems,
    selectedRegions,
    selectedCampingFacilities,
    selectedActivities,
    selectedFacilities,
    searchText,
    setFilters,
    handleRegionCheck,
    handleCampingFacilityCheck,
    handleActivityCheck,
    handleFacilityCheck
  },

}) => {
  const [showMoreActivities, setMoreActivites] = useState(true)
  const [showMoreFacilities, setMoreFacilities] = useState(true)
  const [truncatedActivityFilterLength, setTruncatedActivityFilterLength] = useState(5)
  const [truncatedFacilityFilterLength, setTruncatedFacilityFilterLength] = useState(5)

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
  }, [showMoreActivities, activityItems.length, showMoreFacilities, facilityItems.length])

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
        <legend className="filter-heading">Regions</legend>
        <Filter
          filterItems={regionItems}
          selectedFilterItems={selectedRegions}
          handleFilterCheck={handleRegionCheck}
        />
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
    totalResults: PropTypes.number.isRequired,
    regionItems: PropTypes.array.isRequired,
    campingFacilityItems: PropTypes.array.isRequired,
    activityItems: PropTypes.array.isRequired,
    facilityItems: PropTypes.array.isRequired,
    openFilter: PropTypes.bool.isRequired,
    setOpenFilter: PropTypes.func.isRequired,
    selectedRegions: PropTypes.array.isRequired,
    selectedCampingFacilities: PropTypes.array.isRequired,
    selectedActivities: PropTypes.array.isRequired,
    selectedFacilities: PropTypes.array.isRequired,
    searchText: PropTypes.string.isRequired,
    setFilters: PropTypes.func.isRequired,
    handleRegionCheck: PropTypes.func.isRequired,
    handleCampingFacilityCheck: PropTypes.func.isRequired,
    handleActivityCheck: PropTypes.func.isRequired,
    handleFacilityCheck: PropTypes.func.isRequired
  }),
}

export default DesktopFilters
