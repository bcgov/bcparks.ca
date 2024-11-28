import React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import PropTypes from "prop-types"

import "../../styles/search.scss"

const MapLink = () => {
  return (
    <a
      className="map-link"
      href="https://governmentofbc.maps.arcgis.com/apps/webappviewer/index.html?id=077ef73a1eae4ca88f2bafbb831215af&query=British_Columbia_Parks_Ecological_Reserves_and_Protected_Areas_8747,ORCS_PRIMARY,0000"
    >
      Map of parks
      <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="link-icon" />
    </a>
  )
}

const NoSearchResults = ({
  handleClickClearCity,
  handleClickClearPark,
  handleClickClearFilter,
  page,
}) => {
  const renderNoResultsMessage = () => {
    switch (page) {
      case "find-a-park":
        return "No parks match your search."
      case "park-operating-dates":
      case "a-z-list":
        return "No parks match your selection."
      case "approved":
        return "No documents match your selection."
      default:
        return ""
    }
  }
  // event handlers
  const handleClearAll = () => {
    handleClickClearCity()
    handleClickClearPark()
    handleClickClearFilter()
  }

  return (
    <div className="no-results-container">
      <div className="no-results-header">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <div className="no-results-header--right">
          <h2>Sorry...</h2>
          <p><b>{renderNoResultsMessage()}</b></p>
        </div>
      </div>
      {page === "find-a-park" && (
        <>
          <p><b>You could:</b></p>
          <ul>
            <li>Try a different search term</li>
            <li>
              <button
                tabIndex={0}
                className="btn btn-link"
                aria-label="Clear all"
                onClick={handleClearAll}
              >
                Go back to the full list
              </button>
            </li>
          </ul>
          <p><b>Or search using the:</b></p>
          <ul>
            <li>
              <Link to="/find-a-park/a-z-list">A–Z park list</Link>
            </li>
            <li>
              <MapLink />
            </li>
          </ul>
        </>
      )}
      {(page === "park-operating-dates" || page === "a-z-list") && (
        <>
          <p className="mb-4">
            <b>Select 'All' to go back to the full list.</b>
          </p>
          <p><b>Or search using the:</b></p>
          <ul>
            <li>
              <Link to="/find-a-park">Find a park page</Link>
            </li>
            <li>
              <MapLink />
            </li>
          </ul>
        </>
      )}
      {page === "approved" && (
        <>
          <p className="mb-4">
            <b>Select 'All' to go back to the full list.</b>
          </p>
          <p>
            If the document you're looking for is not listed, contact us at{" "}
            <a
              href="mailto:parkinfo@gov.bc.ca"
              aria-label="Send a mail to BC Parks"
            >
              parkinfo@gov.bc.ca
            </a>
            .
          </p>
        </>
      )}
    </div>
  )
}

export default NoSearchResults

NoSearchResults.propTypes = {
  handleClickClearCity: PropTypes.func,
  handleClickClearPark: PropTypes.func,
  handleClickClearFilter: PropTypes.func,
  page: PropTypes.string.isRequired,
}
