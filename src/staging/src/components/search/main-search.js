import React, { useState } from "react"
import PropTypes from "prop-types"
import { TextField, Fab, Link } from "@material-ui/core"
import "../../styles/search.scss"
import SearchIcon from "@material-ui/icons/Search"
import { navigate } from "gatsby"
import SearchFilter from "./search-filter"

const MainSearch = ({ data: { activities, facilities } }) => {
  const activityItems = activities.map(a => ({
    label: a.activityName,
    value: a.activityNumber,
  }))

  const facilityItems = facilities.map(f => ({
    label: f.facilityName,
    value: f.facilityNumber,
  }))
  const [openFilter, setOpenFilter] = useState(false)
  const [quickSearch, setQuickSearch] = useState({
    camping: false,
    petFriendly: false,
    wheelchair: false,
    marine: false,
    ecoReserve: false,
    electricalHookup: false,
  })
  const [selectedActivities, setSelectedActivities] = useState([])
  const [selectedFacilities, setSelectedFacilities] = useState([])
  const [searchText, setSearchText] = useState("")

  const sortOptions = [
    { value: "rel", label: "Sort by Relevence" },
    { value: "asc", label: "Sort A-Z" },
    { value: "desc", label: "Sort Z-A" },
  ]

  const [sortOption, setSortOption] = useState(sortOptions[0])

  const handleClickOpenFilter = () => {
    setOpenFilter(true)
  }

  const searchParkFilter = () => {
    navigate("/explore", {
      state: {
        quickSearch,
        selectedActivities,
        selectedFacilities,
        searchText,
        sortOption,
      },
    })
  }

  return (
    <div className="park-search-container park-search-text-container">
      <div className="park-search-container-inner row align-items-center w-100 no-gutters">
        <div className="col-12">
          <div className="row no-gutters">
            <div className="col-12 park-search-intro text-center text-sm-left">
              <h2 className="heading-white-space">Welcome to BC Parks</h2>
              <p className="pt-sm-3">
                Plan your next adventure by searching for campsites and day-use
                areas around B.C.
              </p>
            </div>
            <div className="col-12 pt-sm-4 park-search-text">
              <TextField
                id="park-search-text"
                variant="outlined"
                placeholder="Search by name or location"
                className="park-search-text-box"
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
              />
              <Fab
                className="search-icon-fab"
                aria-label="search"
                onClick={() => {
                  searchParkFilter()
                }}
              >
                <SearchIcon className="search-icon" alt="Search" />
              </Fab>
            </div>
          </div>
          <div className="row no-gutters"></div>
          <div className="col-12 pl-sm-0 pt-sm-3">
            <Link
              component="button"
              className="park-search-filter"
              onClick={handleClickOpenFilter}
            >
              Filters
            </Link>
          </div>
        </div>
      </div>
      <SearchFilter
        data={{
          activityItems,
          facilityItems,
          openFilter,
          setOpenFilter,
          quickSearch,
          setQuickSearch,
          selectedActivities,
          setSelectedActivities,
          selectedFacilities,
          setSelectedFacilities,
          searchText,
          setSearchText,
          sortOption,
          setSortOption,
          sortOptions,
        }}
      />
    </div>
  )
}

MainSearch.propTypes = {
  data: PropTypes.shape({
    activities: PropTypes.array.isRequired,
    facilities: PropTypes.array.isRequired,
  }),
}

export default MainSearch
