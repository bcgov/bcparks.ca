import React, { useState } from "react"
import PropTypes from "prop-types"
import { TextField, Button, Link, InputAdornment } from "@material-ui/core"
import "../../styles/search.scss"
import { navigate } from "gatsby"
import SearchFilter from "./searchFilter"

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

  const renderDesktop = () => {
    return (
      <div className="park-search-container-inner row align-items-center w-100 no-gutters">
        <div className="col-12">
          <div className="row no-gutters">
            <div className="col-12 park-search-intro text-center text-sm-left">
              <h2 className="heading-white-space">Welcome to BC Parks</h2>
              <p className="pt-sm-3">
                Plan your next adventure by searching for campsites and day-use
                areas around B.C.
              </p>
              <TextField
                id="park-search-text"
                variant="outlined"
                placeholder="Search by park name, location, activity..."
                className="park-search-text-box pr-2"
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
              <Button
                  variant="contained"
                  onClick={() => {
                    handleClickOpenFilter()
                    searchParkFilter()
                  }}
                  className="bcgov-normal-gold mobile-search-element-height"
              >
                Search
              </Button>
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
    )
  }

  const renderMobile = () => {
    return (
      <div className="row align-items-center w-100 no-gutters park-search-group">
        <div className="col-12">
          <div className="row no-gutters px-3">
            <div className="col-12 text-center">
              <h2 className="heading-white-space">Plan your next adventure</h2>
            </div>
          </div>
          <div className="row no-gutters pb-2 px-3">
            <div className="col-9 pr-1">
              <TextField
                  id="park-search-text"
                  variant="outlined"
                  placeholder="Search by park name, location, activity..."
                  className="park-search-text-box mobile-search-element-height"
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <i className="fas fa-search"></i>
                      </InputAdornment>
                    )
                  }}
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
            </div>
            <div className="col-3">
              <Button
                  variant="outlined"
                  onClick={handleClickOpenFilter}
                  className="bg-transparent rounded text-light mobile-filter mobile-search-element-height"
              >
                Filters
              </Button>
            </div>
          </div>
          <div className="row no-gutters pb-2 px-3">
            <div className="col-12">
              <Button
                  variant="contained"
                  fullWidth
                  onClick={() => {
                    handleClickOpenFilter()
                    searchParkFilter()
                  }}
                  className="bcgov-normal-blue mobile-search-element-height"
              >
                Search
              </Button>
            </div>
          </div>
          <div className="row no-gutters px-3">
            <div className="col-12">
              <Button
                  variant="contained"
                  href="https://www.discovercamping.ca/"
                  target="_blank"
                  rel="norefferer"
                  fullWidth
                  onClick={() => {
                    handleClickOpenFilter()
                    searchParkFilter()
                  }}
                  className="bcgov-normal-gold mobile-search-element-height"
              >
                Book a campsite
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="park-search-container park-search-text-container">
      <div className="d-none d-lg-block v-align-abs">
        {renderDesktop()}
      </div>
      <div className="d-block d-lg-none v-align-abs">
        {renderMobile()}
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
