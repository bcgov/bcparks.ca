import { navigate } from "gatsby"
import React, { useState, useEffect } from "react"
import Form from "react-bootstrap/Form"
import { Typeahead, ClearButton, Menu, MenuItem } from "react-bootstrap-typeahead"

import { getAdvisoryTypeFromUrl } from "../../utils/advisoryHelper";
import "../../styles/advisories/advisoryFilter.scss"

const HighlightText = ({ event, input }) => {
  const regex = new RegExp(input, 'gi')
  const highlightedText = event.replace(regex, match => `<b>${match}</b>`)
  return <span dangerouslySetInnerHTML={{ __html: highlightedText }} />
}

const AdvisoryFilter = ({
  eventTypes = [],
  defaultEventType = { label: getAdvisoryTypeFromUrl() },
  filterFunctions
}) => {
  // Get parent's filter functions
  const { getSearchText, setSearchText, setFilter, getFilter, setType } = filterFunctions
  // useState
  const [filterText, setFilterText] = useState(getSearchText())
  const [isParksFilter, setIsParksFilter] = useState(getFilter("parks"))
  const [isKeywordFilter, setIsKeywordsFilter] = useState(getFilter("keyword"))
  const [eventText, setEventText] = useState("")
  const [selectedEventType, setSelectedEventType] = useState([defaultEventType])

  // functions
  const updateAdvisoriesSearchText = str => {
    setSearchText(str)
  }
  const resetResults = () => {
    setSelectedEventType([])
    setType("all")
    navigate(`/active-advisories`)
  }
  const filterBy = (option, props) => {
    const input = props.text.toLowerCase()
    if (input === "all") {
      return true
    } else {
      return option.label.toLowerCase().includes(input)
    }
  }
  // even handlers
  const handleSearch = () => {
    setSearchText(filterText)
  }
  const handleTypeaheadChange = selected => {
    if (selected.length > 0) {
      setSelectedEventType(selected)
      setType(selected[0].value)
      navigate(`/active-advisories/?type=${selected[0].value}`)
    } else {
      resetResults()
    }
  }
  const handleParksFilterChange = () => {
    setIsParksFilter(!isParksFilter)
    setFilter("parks", !isParksFilter)
  }
  const handleKeywordsFilterChange = () => {
    setIsKeywordsFilter(!isKeywordFilter)
    setFilter("keywords", !isKeywordFilter)
  }
  const handleInputChange = text => {
    setEventText(text)
    if (text === "") {
      resetResults()
    }
  }
  const handleClearType = () => {
    setEventText("")
    resetResults()
  }
  const handleClearKeyword = () => {
    setFilterText("")
    updateAdvisoriesSearchText("")
  }

  // useEffect
  useEffect(() => {
    const advisoryTypeFromUrl = getAdvisoryTypeFromUrl()
    if (advisoryTypeFromUrl) {
      const eventType = eventTypes.find((o) => o.value === advisoryTypeFromUrl) || defaultEventType
      setSelectedEventType([eventType])
      setType(advisoryTypeFromUrl)
    }
  }, [eventTypes, defaultEventType, setType])
  useEffect(() => {
    if (selectedEventType.length > 0 && eventText !== selectedEventType[0].value) {
      setEventText(selectedEventType[0].value)
    }
  }, [selectedEventType, eventText])

  return (
    <div className="advisory-filter-container">
      <div className="row">
        <div className="col-12 col-md-6">
          <Form.Label><b>Search</b></Form.Label>
          <div
            className={`advisory-search has-text--${filterText.length > 0 ? 'true' : 'false'}`}
          >
            <Form.Group controlId="advisory-search">
              <Form.Control
                placeholder=" "
                value={filterText}
                onChange={e =>
                  setFilterText(e.target.value)
                }
                onKeyDown={e => {
                  if (e.key === "Enter") {
                    updateAdvisoriesSearchText(filterText)
                    e.preventDefault()
                  }
                }}
              />
              {filterText.length > 0 &&
                <div className="rbt-aux">
                  <button 
                    area-label="Clear" 
                    className="close btn-close rbt-close" 
                    onClick={handleClearKeyword}
                  >
                    ×
                  </button>
                </div>
              }
              <label htmlFor="advisory-search">
                Search
              </label>
            </Form.Group>
          </div>
        </div>
        <div className="col-12 col-sm-7 col-md-4 mt-4 mt-md-0">
          <Form.Label><b>Advisory type</b></Form.Label>
          <Typeahead
            id="event-search-typeahead"
            minLength={0}
            labelKey="label"
            filterBy={filterBy}
            options={eventTypes}
            selected={selectedEventType}
            onChange={(selected) => handleTypeaheadChange(selected)}
            onInputChange={e => handleInputChange(e)}
            placeholder=" "
            className={`has-text--${(selectedEventType.length > 0 || eventText.length > 0) ? 'true' : 'false'
              } event-search-typeahead`
            }
            renderInput={({ inputRef, referenceElementRef, ...props }) => (
              <Form.Group controlId="event-search-typeahead">
                <Form.Control
                  {...props}
                  value={selectedEventType.length > 0 ?
                    (selectedEventType[0].label === "All" ? "" : selectedEventType[0].label)
                    : eventText}
                  ref={(node) => {
                    inputRef(node)
                    referenceElementRef(node)
                  }}
                  enterKeyHint="search"
                />
                <label htmlFor="event-search-typeahead">
                  Select a type
                </label>
              </Form.Group>
            )}
            renderMenu={results => (
              <Menu id="event-search-typeahead">
                {(!results.length && eventText) &&
                  <MenuItem
                    tabIndex={-1}
                    key={0}
                    className="no-suggestion-text"
                  >
                    No match. Please check your spelling or select from the list.
                  </MenuItem>
                }
                {results.map((event, index) => 
                  <MenuItem option={event} position={index} key={index}>
                    <HighlightText
                      event={event.label}
                      input={eventText}
                    />
                  </MenuItem>
                )}
              </Menu>
            )}
          >
            {({ onClear }) =>
              (eventText.length > 0 && eventText !== "all") && (
                <div className="rbt-aux">
                  <ClearButton
                    onClick={() => {
                      onClear()
                      handleClearType()
                    }}
                  />
                </div>
              )
            }
          </Typeahead>
        </div>
        <div className="col-12 col-sm-5 col-md-2 d-flex align-self-end mt-4 mt-md-0">
          <button
            aria-label="Search"
            onClick={handleSearch}
            className="btn btn-primary w-100"
          >
            Search
          </button>
        </div>
      </div>
      <div className="row mt-4">
        <div className="col-12 col-sm-auto">
          <b>Filters</b>
        </div>
        <div className="col-auto">
          <Form.Check
            type="checkbox"
            label="Keywords"
            checked={isKeywordFilter}
            onChange={handleKeywordsFilterChange}
          />
        </div>
        <div className="col-auto">
          <Form.Check
            type="checkbox"
            label="Park names"
            checked={isParksFilter}
            onChange={handleParksFilterChange}
          />
        </div>
      </div>
    </div>
  );
}

export default AdvisoryFilter
