import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"
import { Button } from "@mui/material"
import ParkNameSearch from "./parkNameSearch"
import CityNameSearch from "./cityNameSearch"
import { useScreenSize } from "../../utils/helpers"
import "../../styles/search.scss"

const MainSearch = () => {
  // useState
  const [inputText, setInputText] = useState("")
  const [searchText, setSearchText] = useState("")
  const [isCityNameLoading, setIsCityNameLoading] = useState(false)
  const [selectedCity, setSelectedCity] = useState([])
  const [currentLocation, setCurrentLocation] = useState({
    strapi_id: 0,
    cityName: "Current location",
    latitude: 0,
    longitude: 0,
    rank: 1
  })

  // functions
  const searchParkFilter = () => {
    navigate(`/find-a-park`, {
      state: {
        "searchText": searchText || inputText,
        "qsLocation": selectedCity.length > 0 ? selectedCity[0].strapi_id : null,
        "qsCity": selectedCity
      },
    })
  }
  const showPosition = (position) => {
    setCurrentLocation(currentLocation => ({
      ...currentLocation,
      latitude: position.coords.latitude,
      longitude: position.coords.longitude
    }))
    setIsCityNameLoading(false)
  }

  // event handlers
  const handleSearchNameChange = (selected) => {
    if (selected.length) {
      setSearchText(selected[0]?.protectedAreaName)
    }
  }
  const handleSearchNameInputChange = (text) => {
    if (text.length) {
      setInputText(text)
    }
  }
  const handleKeyDownSearchPark = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      searchParkFilter()
    }
  }
  const handleClickClear = () => {
    setInputText("")
    setSearchText("")
    setSelectedCity([])
  }
  const handleKeyDownClear = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClickClear()
    }
  }

  // useEffect
  useEffect(() => {
    if (searchText || (selectedCity.length > 0 &&
      (selectedCity[0].latitude !== 0 && selectedCity[0].longitude !== 0)
    )) {
      searchParkFilter()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, selectedCity])

  useEffect(() => {
    if (selectedCity.length > 0) {
      if (selectedCity[0].strapi_id === 0) {
        setIsCityNameLoading(true)
      }
      if (currentLocation.latitude !== 0 || currentLocation.longitude !== 0) {
        setSelectedCity([currentLocation])
        if (currentLocation === selectedCity[0]) {
          searchParkFilter()
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCity, currentLocation])

  return (
    <div className="parks-search-wrapper">
      <h1 className="text-white">Find a park</h1>
      <div className="parks-search-field">
        <ParkNameSearch
          optionLimit={useScreenSize().width > 767 ? 7 : 4}
          searchText={inputText}
          handleChange={handleSearchNameChange}
          handleInputChange={handleSearchNameInputChange}
          handleKeyDownSearch={handleKeyDownSearchPark}
          handleClick={handleClickClear}
          handleKeyDown={handleKeyDownClear}
        />
        <span className="or-span">or</span>
        <CityNameSearch
          isCityNameLoading={isCityNameLoading}
          showPosition={showPosition}
          currentLocation={currentLocation}
          optionLimit={useScreenSize().width > 767 ? 7 : 4}
          selectedItems={selectedCity}
          handleChange={setSelectedCity}
          handleClick={handleClickClear}
          handleKeyDown={handleKeyDownClear}
        />
        <Button
          className="parks-search-button"
          onClick={searchParkFilter}
        >
          Search
        </Button>
      </div>
    </div>
  )
}

export default MainSearch
