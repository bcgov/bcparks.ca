import React, { useState, useRef, useCallback } from "react"
import axios from "axios"
import { graphql, useStaticQuery } from "gatsby"
import { AsyncTypeahead, ClearButton } from "react-bootstrap-typeahead"
import { Form } from "react-bootstrap"
import "react-bootstrap-typeahead/css/Typeahead.css"

const HighlightText = ({ park, input }) => {
  const parkWords = park.toLowerCase().split(" ")
  const inputWords = input.toLowerCase().split(" ")
  return (
    parkWords.map((word, index) => {
      const shouldHighlight = inputWords.includes(word)
      return (
        <span key={index}>
          {shouldHighlight ? word : <b>{word}</b>}
          {index !== parkWords.length - 1 ? " " : ""}
        </span>
      )
    })
  )
}

const ParkNameSearch = ({
  optionLimit, searchText, handleChange, handleInputChange, handleKeyDownSearch, handleClick, handleKeyDown
}) => {
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
  const typeaheadRef = useRef(null)

  // event handlers
  const SEARCH_NAME_URI =
    `${data.site.siteMetadata.apiURL}/api/protected-areas/searchnames`
  const handleSearchName = useCallback(async (query) => {
    if (query.length > 0) {
      setIsSearchNameLoading(true)
      try {
        const response = await axios.get(`
        ${SEARCH_NAME_URI}?queryText=${query}
      `)
        setOptions(response.data.data)
      } catch (error) {
        setOptions([])
        console.error('Error fetching search names:', error)
      } finally {
        setIsSearchNameLoading(false)
      }
    } else {
      // clear input field if there is no search text
      typeaheadRef.current.clear()
      setOptions([])
    }
  }, [SEARCH_NAME_URI])
    // this prevent selecting the first option with the tab key
    const handleKeyDownInput = () => { }

  return (
    <AsyncTypeahead
      ref={typeaheadRef}
      id="park-search-typehead"
      minLength={1}
      filterBy={() => true}
      isLoading={isSearchNameLoading}
      labelKey={option => `${option.protectedAreaName}`}
      options={options.slice(0, optionLimit)}
      onSearch={handleSearchName}
      onChange={handleChange}
      onInputChange={handleInputChange}
      onKeyDown={handleKeyDownSearch}
      placeholder=" "
      className={`has-text--${searchText.length > 0 ? 'true' : 'false'
        } park-search-typeahead`}
      renderInput={({ inputRef, referenceElementRef, ...inputProps }) => {
        return (
          <Form.Group controlId="park-search-typeahead">
            <Form.Control
              {...inputProps}
              value={searchText}
              ref={(node) => {
                inputRef(node)
                referenceElementRef(node)
              }}
              onKeyDown={handleKeyDownInput}
            />
            <label htmlFor="park-search-typeahead">
              By park name
            </label>
          </Form.Group>
        )
      }}
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
            />
          </div>
        )
      }
    </AsyncTypeahead>
  )
}

export default ParkNameSearch