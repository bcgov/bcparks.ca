import React, { useState, useEffect } from "react"
import { navigate } from "gatsby"
import { Button } from "@mui/material"
import ParkNameSearch from "./parkNameSearch"
import CityNameSearch from "./cityNameSearch"
import "../../styles/search.scss"

const MainSearch = () => {
  // useState
  const [searchText, setSearchText] = useState("")
  const [selectedCity, setSelectedCity] = useState([])
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [currentLocation, setCurrentLocation] = useState({
    strapi_id: 0,
    cityName: "Current location",
    latitude: 0,
    longitude: 0,
    rank: 1
  })

  // functions
  const searchParkFilter = () => {
    navigate("/find-a-park", {
      state: {
        "searchText": searchText,
        "qsLocation": `${latitude},${longitude}`
      },
    })
  }
  const showPosition = (position) => {
    setLatitude(position.coords.latitude)
    setLongitude(position.coords.longitude)
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
    if (selectedCity.length) {
      setLatitude(selectedCity[0].latitude)
      setLongitude(selectedCity[0].longitude)

      const updatedCurrentLocation = {
        strapi_id: 0,
        cityName: "Current location",
        latitude: selectedCity[0].latitude,
        longitude: selectedCity[0].longitude,
        rank: 1,
      }
      setCurrentLocation(updatedCurrentLocation)
    }
  }, [selectedCity])

  // console.log("selected:", selectedCity)
  // console.log("latitude:", latitude)
  // console.log("longitude:", longitude)
  // console.log("currentLocation:", currentLocation)

  return (
    <div className="parks-search-wrapper">
      <h1 className="text-white">Find a park</h1>
      <div className="parks-search-field">
        <ParkNameSearch
          optionLimit={8}
          searchText={searchText}
          handleChange={handleSearchNameChange}
          handleInputChange={handleSearchNameInputChange}
          handleClick={handleClickClear}
          handleKeyDown={handleKeyDownClear}
        />
        <span className="or-span">or</span>
        <CityNameSearch
          showPosition={showPosition}
          currentLocation={currentLocation}
          optionLimit={8}
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
