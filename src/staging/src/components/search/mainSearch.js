import React, { useState } from "react"
import PropTypes from "prop-types"
import { TextField, Button, InputAdornment, InputLabel } from "@material-ui/core"
import "../../styles/search.scss"
import { navigate } from "gatsby"
import SearchIcon from "@material-ui/icons/Search"

  
const MainSearch = () => {

  const [searchText, setSearchText] = useState("")

  const searchParkFilter = () => {
    navigate("/explore", {
      state: {
        searchText
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
      <div className="mt-1">
        <i className="fa fa-info-circle"></i> <em>Park search is limited during beta</em>
      </div>
      <div className="parks-search-filter-link"
        role="button"
        tabIndex={0}
        onKeyDown={searchParkFilter}
        onClick={searchParkFilter}>
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
