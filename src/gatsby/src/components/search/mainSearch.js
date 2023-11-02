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
    // const params = {
    //   l: `${latitude},${longitude}`,
    //   q: searchText || inputText,
    // }
    // navigate(`/find-a-park/?l=${params.l}&q=${params.q}`, {
    navigate(`/find-a-park`, {
      state: {
        "searchText": searchText || inputText,
        "qsLocation": `${latitude},${longitude}`,
        "qsCity": selectedCity
      },
    })
  }
  const showPosition = (position) => {
    setLatitude(position.coords.latitude)
    setLongitude(position.coords.longitude)
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
    if (searchText || (latitude !== 0 && longitude !== 0)) {
      searchParkFilter()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText, latitude, longitude])

  useEffect(() => {
    if (selectedCity.length) {
      setLatitude(selectedCity[0].latitude)
      setLongitude(selectedCity[0].longitude)
      if (selectedCity[0].strapi_id === 0) {
        setIsCityNameLoading(true)
      }
    }
  }, [selectedCity])

  useEffect(() => {
    setCurrentLocation(currentLocation => ({
      ...currentLocation,
      latitude: latitude,
      longitude: longitude
    }))
  }, [latitude, longitude])

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
