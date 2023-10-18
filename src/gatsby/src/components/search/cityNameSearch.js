import React, { useEffect, useState } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Typeahead, ClearButton, Menu, MenuItem } from "react-bootstrap-typeahead"
import NearMeIcon from "@mui/icons-material/NearMe"
import "react-bootstrap-typeahead/css/Typeahead.css"

const HighlightText = ({ city, input }) => {
  const words = city.split(" ")
  return (
    words.map((word, index) => {
      if (word.toLowerCase() === input) {
        return <span key={index}> {word} </span>
      } else {
        return <b key={index}> {word} </b>
      }
    })
  )
}

const CityNameSearch = ({ optionLimit, handleClick, handleKeyDown }) => {
  const data = useStaticQuery(graphql`
    query {
			allStrapiSearchCity(
				sort: {rank: ASC},
				filter: {rank: {lte: 4}}
			) {
				nodes {
					strapi_id
					cityName
					latitude
					longitude
					rank
				}
			}
    }
  `)

  // useState and constants
  const [selectedCity, setSelectedCity] = useState([])
  const [searchText, setSearchText] = useState("")
  const [latitude, setLatitude] = useState(0)
  const [longitude, setLongitude] = useState(0)
  const [currentLocation, setCurrentLocation] = useState({
    strapi_id: 0,
    cityName: "Current location",
    latitude: 0,
    longitude: 0,
    rank: 1
  })
  const cities = data?.allStrapiSearchCity?.nodes || []

  // functions
  const showPosition = (position) => {
    setLatitude(position.coords.latitude)
    setLongitude(position.coords.longitude)
  }
  const showError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        console.log("User denied the request for Geolocation.")
        break
      case error.POSITION_UNAVAILABLE:
        console.log("Location information is unavailable.")
        break
      case error.TIMEOUT:
        console.log("The request to get user location timed out.")
        break
      case error.UNKNOWN_ERROR:
        console.log("An unknown error occurred.")
        break
      default:
        console.log("An unspecified error occurred.")
    }
  }

  // event handlers
  const handleInputChange = (text) => {
    if (text.length) {
      setSearchText(text)
    }
  }
  const handleClickGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError);
    } else {
      console.log("Geolocation is not supported by your browser");
    }
  }
  const handleKeyDownGetLocation = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClickGetLocation()
    }
  }

  // useEffects
  useEffect(() => {
    const updatedCurrentLocation = {
      strapi_id: 0,
      cityName: "Current location",
      latitude: latitude,
      longitude: longitude,
      rank: 1,
    };
    // set the updated currentLocation state
    setCurrentLocation(updatedCurrentLocation)
  }, [latitude, longitude])
  // console.log("cities:", cities)
  // console.log("selected:", selectedCity)
  // console.log(latitude, longitude)

  return (
    <Typeahead
      id="city-search-typehead"
      minLength={1}
      // filterBy={() => true}
      // isLoading={isSearchNameLoading}
      labelKey={city => `${city.cityName}`}
      options={cities.slice(0, optionLimit)}
      selected={selectedCity}
      // onSearch={handleSearchName}
      onChange={setSelectedCity}
      onInputChange={handleInputChange}
      placeholder="Near a city"
      className="city-search-typeahead"
      isInvalid={false}
      renderMenu={(cities, menuProps) => (
        <Menu {...menuProps}>
          {cities.map((city, index) => (
            <MenuItem option={city} position={index} key={index}>
              <HighlightText
                city={city.cityName}
                input={searchText}
              />
            </MenuItem>
          ))}
          <MenuItem option={currentLocation} position={cities.length} key={cities.length}>
            <div
              role="button"
              tabIndex="0"
              onClick={handleClickGetLocation}
              onKeyDown={(e) => handleKeyDownGetLocation(e)}
            >
              <NearMeIcon />{currentLocation.cityName}
            </div>
          </MenuItem>
        </Menu>
      )}
    >
      {({ onClear, selected }) =>
        (!!selected.length || searchText?.length > 0) && (
          <div className="rbt-aux">
            <ClearButton
              onClick={() => {
                onClear()
                handleClick()
              }}
              onKeyDown={(e) => {
                onClear()
                handleKeyDown(e)
              }}
            />
          </div>
        )
      }
    </Typeahead>
  )
}

export default CityNameSearch