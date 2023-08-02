import React, { useState } from "react"
import { navigate } from "gatsby"
import { TextField, Button, InputAdornment, InputLabel } from "@mui/material"
import SearchIcon from "@mui/icons-material/Search"

import "../../styles/search.scss"
  
const MainSearch = () => {

  const [searchText, setSearchText] = useState("")

  const searchParkFilter = () => {
    navigate("/find-a-park", {
      state: {
        searchText
      },
    })
  }

  return (
    <div className="parks-search-wrapper">
      <h1 className="text-white">Find a park</h1>
      <div className="parks-search-field">
        <InputLabel className="sr-only" htmlFor="park-search-text">
            Search
        </InputLabel>
        <TextField
          id="park-search-text"
          variant="outlined"
          placeholder="Search by park name"
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
      <div className="parks-search-filter-link"
        role="button"
        tabIndex={0}
        onClick={searchParkFilter}>
        Search by activity
      </div>
    </div>
  )
}

export default MainSearch
