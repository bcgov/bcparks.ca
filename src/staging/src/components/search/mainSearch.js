import React, { useState } from "react"
import PropTypes from "prop-types"
import { TextField, Button, InputAdornment, InputLabel } from "@material-ui/core"
import "../../styles/search.scss"
import { navigate } from "gatsby"
import SearchIcon from "@material-ui/icons/Search"

  
const MainSearch = () => {

  // search options not set here, but need to be passed to search page
  // via state, so setting all to initial values below
  let quickSearch = {
    camping: false,
    petFriendly: false,
    wheelchair: false,
    marine: false,
    ecoReserve: false,
    electricalHookup: false,
  }
  const selectedActivities = [];
  const selectedFacilities = [];

  const [searchText, setSearchText] = useState("")

  const sortOptions = [
    { value: "rel", label: "Sort by Relevance" },
    { value: "asc", label: "Sort A-Z" },
    { value: "desc", label: "Sort Z-A" },
  ]

  const sortOption= sortOptions[0]

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
    <div className="parks-search-wrapper">
      <div className="parks-search-header">
        Find your next adventure
      </div>
      <div className="parks-search-field">
        <InputLabel className="sr-only" htmlFor="park-search-text">
            Search
        </InputLabel>
        <TextField
          id="park-search-text"
          variant="outlined"
          placeholder="Plan your next adventure by searching for campsites and day use areas"
          className="park-search-text-box h50p"
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
        <Button
            variant="contained"
            onClick={searchParkFilter}
            className="parks-search-button"
        >
          Search
        </Button>
      </div>
      <div className="parks-search-filter-link" onClick={searchParkFilter}>
        Search by activity
      </div>
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
