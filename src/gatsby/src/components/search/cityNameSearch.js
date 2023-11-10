import React, { useState, useEffect, useRef } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Typeahead, ClearButton, Menu, MenuItem } from "react-bootstrap-typeahead"
import { Form } from "react-bootstrap"
import PermissionToast from "./permissionToast"
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

const CityNameSearch = ({
  isCityNameLoading, showPosition, currentLocation, optionLimit, selectedItems, handleChange, handleClick, handleKeyDown
}) => {
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
  const [cityText, setCityText] = useState("")
  const [hasResult, setHasResult] = useState(false)
  const [hasPermission, setHasPermission] = useState(true)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const cities = data?.allStrapiSearchCity?.nodes || []
  const typeaheadRef = useRef(null)

  // functions
  const cityOptions = (optionLimit) => {
    const cityTextLower = cityText.toLowerCase()
    const filteredCities = cities.filter(city =>
      city.cityName.toLowerCase().startsWith(cityTextLower) || city.cityName.toLowerCase().includes(` ${cityTextLower}`)
    )
    const sortedCities = filteredCities.slice().sort((a, b) => {
      if (a.cityName.toLowerCase().startsWith(cityTextLower) && !b.cityName.toLowerCase().startsWith(cityTextLower)) {
        return -1
      } else if (!a.cityName.toLowerCase().startsWith(cityTextLower) && b.cityName.toLowerCase().startsWith(cityTextLower)) {
        return 1
      } else if (b.rank !== a.rank) {
        return b.rank > a.rank ? -1 : 1
      } else {
        return a.cityName.localeCompare(b.cityName)
      }
    })
    return cityText ? sortedCities.slice(0, optionLimit) : []
  }
  const checkResult = (text) => {
    const cityTextLower = text.toLowerCase()
    const results = cities.filter(city =>
      city.cityName.toLowerCase().startsWith(cityTextLower) || city.cityName.toLowerCase().includes(` ${cityTextLower}`)
    )
    if (results.length > 0) {
      setHasResult(true)
    } else {
      setHasResult(false)
    }
  }
  const showError = (error) => {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        setHasPermission(false)
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
      setCityText(text)
      checkResult(text)
    }
  }
  const handleClickGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition, showError)
    } else {
      console.log("Geolocation is not supported by your browser")
    }
  }
  const handleKeyDownGetLocation = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleClickGetLocation()
    }
  }
  const handleClickInput = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  // useEffect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeaheadRef.current && !typeaheadRef.current.inputNode.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }
    document.body.addEventListener("click", handleClickOutside)
    return () => {
      document.body.removeEventListener("click", handleClickOutside)
    }
  }, [])

  // clear input field if text does not exist in options
  useEffect(() => {
    if (!isDropdownOpen && cityText.length > 0 && !hasResult) {
      setCityText("")
    }
  }, [isDropdownOpen, cityText, hasResult])


  return (
    <>
      {!hasPermission && <PermissionToast />}
      <Typeahead
        ref={typeaheadRef}
        id="city-search-typehead"
        minLength={1}
        isLoading={isCityNameLoading}
        labelKey={city => `${city.cityName}`}
        options={cityOptions(optionLimit)}
        selected={selectedItems}
        onChange={handleChange}
        onInputChange={handleInputChange}
        open={isDropdownOpen}
        onToggle={(isOpen) => setIsDropdownOpen(isOpen)}
        placeholder=" "
        className={`has-text--${cityText.length > 0 ? 'true' : 'false'
          } city-search-typeahead`}
        renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
          return (
            <Form.Group controlId="city-search-typeahead">
              <Form.Control
                {...inputProps}
                value={selectedItems.length > 0 ? selectedItems[0].cityName : cityText}
                ref={(node) => {
                  inputRef(node)
                  referenceElementRef(node)
                }}
                onClick={handleClickInput}
              />
              <label htmlFor="city-search-typeahead">
                Near a city
              </label>
            </Form.Group>
          )
        }}
        renderMenu={cities => (
          <Menu id="city-search-typeahead">
            {cities.map((city, index) => (
              <MenuItem option={city} position={index} key={index}>
                <HighlightText
                  city={city.cityName}
                  input={cityText}
                />
              </MenuItem>
            ))}
            {(!hasResult && cityText) &&
              <MenuItem position={cities.length} key={cities.length} className="no-suggestion-text">
                No suggestions, please check your spelling or try a larger city in B.C.
              </MenuItem>
            }
            <MenuItem option={currentLocation} position={cities.length + 1} key={cities.length + 1}>
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
          (!!selected.length || cityText?.length > 0) && (
            <div className="rbt-aux">
              <ClearButton
                onClick={() => {
                  onClear()
                  handleClick()
                  setCityText("")
                }}
                onKeyDown={(e) => {
                  onClear()
                  handleKeyDown(e)
                  setCityText("")
                }}
              />
            </div>
          )
        }
      </Typeahead>
    </>
  )
}

export default CityNameSearch