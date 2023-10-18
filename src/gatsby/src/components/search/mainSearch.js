import React, { useState } from "react"
import { navigate } from "gatsby"
import { Button } from "@mui/material"
import ParkNameSearch from "./parkNameSearch"
import CityNameSearch from "./cityNameSearch"
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
  // event handlers
  const handleSearchNameChange = (selected) => {
    if (selected.length) {
      setSearchText(selected[0]?.protectedAreaName)
      searchParkFilter()
    }
  }
  const handleSearchNameInputChange = (text) => {
    if (text.length) {
      setSearchText(text)
    }
  }
  const handleClickClear = () => {
    setSearchText("")
  }
  const handleKeyDownClear = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClickClear()
    }
  }

  return (
    <div className="parks-search-wrapper">
      <h1 className="text-white">Find a park</h1>
      <div className="parks-search-field">
        <ParkNameSearch
          optionLimit={8}
          handleChange={handleSearchNameChange}
          handleInputChange={handleSearchNameInputChange}
          handleClick={handleClickClear}
          handleKeyDown={handleKeyDownClear}
          searchText={searchText}
        />
        or
        <CityNameSearch
          optionLimit={8}
        />
        <Button
          variant="contained"
          onClick={searchParkFilter}
          className="parks-search-button"
        >
          Search
        </Button>
      </div>
    </div>
  )
}

export default MainSearch
