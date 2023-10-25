import React, { useState } from "react"
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
  showPosition, currentLocation, optionLimit, selectedItems, handleChange, handleClick, handleKeyDown
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
  const [searchText, setSearchText] = useState("")
  const [hasResult, setHasResult] = useState(false)
  const [hasPermission, setHasPermission] = useState(true)
  const cities = data?.allStrapiSearchCity?.nodes || []

  // functions
  const checkResult = (text) => {
    const results = cities.filter((city) =>
      city.cityName.toLowerCase().includes(text.toLowerCase())
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
      setSearchText(text)
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

  return (
    <>
      {!hasPermission && <PermissionToast />}
      <Typeahead
        id="city-search-typehead"
        minLength={1}
        labelKey={city => `${city.cityName}`}
        options={cities.slice(0, optionLimit)}
        selected={selectedItems}
        // onSearch={handleSearchName}
        onChange={handleChange}
        onInputChange={handleInputChange}
        placeholder=" "
        className={`has-text--${searchText.length > 0 ? 'true' : 'false'
          } has-error--${(searchText.length > 0 && !hasResult) ? 'true' : 'false'
          } city-search-typeahead`}
        renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
          return (
            <Form.Group controlId="city-search-typeahead">
              <Form.Control
                {...inputProps}
                ref={(node) => {
                  inputRef(node)
                  referenceElementRef(node)
                }}
              />
              <label htmlFor="city-search-typeahead">
                Near a city
              </label>
              {(searchText.length > 0 && !hasResult) &&
                <small className="helper-text--error">
                  <b>{searchText}</b> could not be found. Please enter a city in B.C.
                </small>
              }
            </Form.Group>
          )
        }}
        renderMenu={cities => (
          <Menu id="city-search-typeahead">
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
    </>
  )
}

export default CityNameSearch