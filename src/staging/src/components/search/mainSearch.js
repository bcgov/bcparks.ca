import React, { useState } from "react"
import PropTypes from "prop-types"
import { TextField, Button, Link, InputAdornment, InputLabel } from "@material-ui/core"
import "../../styles/search.scss"
import { navigate } from "gatsby"
import SearchFilter from "./searchFilter"
import SearchIcon from "@material-ui/icons/Search"
import { makeStyles } from "@material-ui/core/styles";


const useStyles = makeStyles(theme => ({
  searchLabel: {
    display: "none"
  }
}));
  
const MainSearch = ({ data: { activities, facilities } }) => {

  const classes = useStyles()

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
    { value: "rel", label: "Sort by Relevance" },
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
      <div className="parks-search-filter-link">
        <a href="/explore">Search by activity</a>
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
