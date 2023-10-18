import React, { useState, useEffect } from "react"
import axios from "axios"
import { graphql, useStaticQuery } from "gatsby"
import { AsyncTypeahead, ClearButton } from "react-bootstrap-typeahead"
import "react-bootstrap-typeahead/css/Typeahead.css"

const HighlightText = ({ park, input }) => {
  const words = park.split(" ")
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

const ParkNameSearch = ({ optionLimit, handleChange, handleInputChange, handleClick, handleKeyDown, searchText }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          apiURL
        }
      }
    }
  `)

  // useState and constants
  const [options, setOptions] = useState([])
  const [isSearchNameLoading, setIsSearchNameLoading] = useState(false)

  // event handlers
  const SEARCH_NAME_URI =
    `${data.site.siteMetadata.apiURL}/api/protected-areas/searchnames`
  const handleSearchName = async (query) => {
    setIsSearchNameLoading(true)
    try {
      const response = await axios.get(`
      ${SEARCH_NAME_URI}?queryText=${query}
    `)
      setOptions(response.data.data)
    } catch (error) {
      console.error('Error fetching search names:', error)
    } finally {
      setIsSearchNameLoading(false)
    }
  }

  // useEffects
  useEffect(() => {
    handleSearchName(searchText)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchText])

  return (
    <AsyncTypeahead
      id="park-search-typehead"
      // eslint-disable-next-line jsx-a11y/no-autofocus
      autoFocus
      minLength={1}
      filterBy={() => true}
      isLoading={isSearchNameLoading}
      labelKey={option => `${option.protectedAreaName}`}
      options={options.slice(0, optionLimit)}
      onSearch={handleSearchName}
      onChange={handleChange}
      onInputChange={handleInputChange}
      placeholder="By park name"
      className={`has-text--${searchText.length > 0 ? 'true' : 'false'
        } park-search-typeahead`}
      renderMenuItemChildren={(option) => (
        <HighlightText
          park={option.protectedAreaName}
          input={searchText}
        />
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
    </AsyncTypeahead>
  )
}

export default ParkNameSearch