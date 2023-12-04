import React, { useState, useEffect, useRef, useCallback } from "react"
import axios from "axios"
import { graphql, useStaticQuery } from "gatsby"
import { AsyncTypeahead, ClearButton } from "react-bootstrap-typeahead"
import { Form } from "react-bootstrap"
import "react-bootstrap-typeahead/css/Typeahead.css"

const HighlightText = ({ park, input }) => {
  const parkWords = park.toLowerCase().split(" ")
  const inputWords = input.toLowerCase().split(" ")
  const camelCase = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1)
  }
  return (
    parkWords.map((word, index) => {
      const shouldHighlight = inputWords.includes(word)
      return (
        <span key={index}>
          {shouldHighlight ? camelCase(word) : <b>{camelCase(word)}</b>}
          {index !== parkWords.length - 1 ? " " : ""}
        </span>
      )
    })
  )
}

const ParkNameSearch = ({
  optionLimit,
  searchText,
  handleChange,
  handleInputChange,
  handleKeyDownSearch,
  handleClick
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
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const typeaheadRef = useRef(null)

  // event handlers
  const handleFocusInput = () => {
    setIsDropdownOpen(true)
  }
  const SEARCH_NAME_URI =
    `${data.site.siteMetadata.apiURL}/api/protected-areas/searchnames`
  const handleSearchName = useCallback(async (query) => {
    if (query.length > 0) {
      setIsSearchNameLoading(true)
      setIsDropdownOpen(true)
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
  // select an option with arrow keys and search parks with enter key 
  const handleKeyDownInput = (e) => {
    const optionsLength = options.slice(0, optionLimit).length
    let activeIndex = typeaheadRef.current.state.activeIndex
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
      e.preventDefault()
      if (e.key === 'ArrowUp') {
        activeIndex = (activeIndex - 1 + optionsLength) % optionsLength
      } else if (e.key === 'ArrowDown') {
        activeIndex = (activeIndex + 1) % optionsLength
      }
      typeaheadRef.current.setState({ activeIndex })
    } else if (e.key === 'Enter') {
      e.preventDefault()
      const activeOption = options[activeIndex]
      if (activeOption !== undefined) {
        handleChange([activeOption])
      } else {
        handleKeyDownSearch(e)
      }
      setIsDropdownOpen(false)
    } else if (e.key === 'Tab') {
      setIsDropdownOpen(false)
    }
  }

  // useEffect
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (typeaheadRef.current
        && !typeaheadRef.current.inputNode.contains(event.target)
        && !event.target.closest('#park-search-typeahead')
      ) {
        setIsDropdownOpen(false)
      }
    }
    document.body.addEventListener("click", handleClickOutside)
    return () => {
      document.body.removeEventListener("click", handleClickOutside)
    }
  }, [])
  useEffect(() => {
    if (searchText === "") {
      setIsDropdownOpen(false)
    }
  },[searchText])

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
      onFocus={handleFocusInput}
      open={isDropdownOpen}
      onToggle={(isOpen) => setIsDropdownOpen(isOpen)}
      placeholder=" "
      className={`has-text--${searchText.length > 0 ? 'true' : 'false'
        } is-dropdown-open--${isDropdownOpen ? 'true' : 'false'
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
              enterkeyhint="search"
            />
            <label htmlFor="park-search-typeahead">
              By park name
            </label>
          </Form.Group>
        )
      }}
      renderMenuItemChildren={option => (
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
                setOptions([])
                setIsDropdownOpen(false)
              }}
            />
          </div>
        )
      }
    </AsyncTypeahead>
  )
}

export default ParkNameSearch