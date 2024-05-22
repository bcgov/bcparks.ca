import React, { useState } from "react"
import Form from "react-bootstrap/Form"
import { Typeahead } from "react-bootstrap-typeahead"

import { getAdvisoryTypeFromUrl } from "../../utils/advisoryHelper";
import "../../styles/advisories/advisoryFilter.scss"

const AdvisoryFilter = ({
  eventTypes = [],
  defaultEventType = { label: getAdvisoryTypeFromUrl() },
  filterFunctions
}) => {

  // Get parent's filter functions
  const getSearchText = filterFunctions.getSearchText
  const setSearchText = filterFunctions.setSearchText
  const setFilter = filterFunctions.setFilter
  const getFilter = filterFunctions.getFilter
  const getType = filterFunctions.getType
  const setType = filterFunctions.setType

  const [filterText, setFilterText] = useState(getSearchText())
  const [isParksFilter, setIsParksFilter] = useState(getFilter("parks"))
  const [isKeywordFilter, setIsKeywordsFilter] = useState(getFilter("keyword"))
  const [eventText, setEventText] = useState("")

  // Local handlers, calls to parent methods
  // will trigger useEffect functions in parent
  const updateAdvisoriesSearchText = str => {
    setSearchText(str)
  }
  const handleSearch = () => {
    setSearchText(filterText)
  }

  const handleTypeFilterChange = advisoryType => {
    // This changes the URL query str and causes the page to
    // rerender with the type changed
    setType(advisoryType)
    // navigate(`/active-advisories/?type=${advisoryType}`)
  }

  // Checkboxes
  const handleParksFilterChange = () => {
    setIsParksFilter(!isParksFilter)
    setFilter("parks", !isParksFilter)
  }
  const handleKeywordsFilterChange = () => {
    setIsKeywordsFilter(!isKeywordFilter)
    setFilter("keywords", !isKeywordFilter)
  }
  const handleInputChange = (text) => {
    setEventText(text)
  }

  const getEventType = () => {
    return eventTypes.find((o) => o.value === getType()) || defaultEventType
  }

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
                id="advisory-search"
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
              <label htmlFor="advisory-search">
                Search
              </label>
            </Form.Group>
          </div>
        </div>
        <div className="col-7 col-md-4">
          <Form.Label><b>Event</b></Form.Label>
          <Typeahead
            id="event-search-typeahead"
            minLength={0}
            labelKey="label"
            placeholder=" "
            className={`event-search-typeahead has-text--${eventText.length > 0 ? 'true' : 'false'}`}
            clearButton
            options={eventTypes}
            value={getEventType()}
            defaultValue={defaultEventType}
            onChange={e => handleTypeFilterChange(
              e.length ? e[0].value : defaultEventType.value
            )}
            onInputChange={e => handleInputChange(e)}
            renderInput={({ ref, ...props }) => (
              <Form.Group controlId="event-search-typeahead">
                <Form.Control ref={ref} {...props} />
                <label htmlFor="event-search-typeahead">
                  Select an event
                </label>
              </Form.Group>
            )}
          />
        </div>
        <div className="col-5 col-md-2">
          <Form.Label>&nbsp;</Form.Label>
          <button
            aria-label="Search"
            onClick={handleSearch}
            className="btn btn-primary w-100"
          >
            Search
          </button>
        </div>
      </div>
      <div className="row mt-3">
        <div className="col-auto">
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
