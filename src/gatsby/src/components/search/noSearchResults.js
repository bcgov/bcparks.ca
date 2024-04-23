import React from "react"
import { Link } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faSearch, faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"

import "../../styles/search.scss"

const NoSearchResults = ({
  hasCity,
  hasPark,
  hasFilter,
  handleClickClearCity,
  handleKeyDownClearCity,
  handleClickClearPark,
  handleKeyDownClearPark,
  handleClickClearFilter,
  handleKeyDownClearFilter,
}) => {
  return (
    <div className="no-results-container">
      <div className="no-results-header">
        <FontAwesomeIcon icon={faSearch} className="search-icon" />
        <div className="no-results-header--right">
          <h2>Sorry...</h2>
          <p><b>no parks matched your search.</b></p>
        </div>
      </div>
      <p><b>You could:</b></p>
      <ul>
        {(hasCity || hasPark) && (
          <li>Change your search term</li>
        )}
        {hasCity && (
          <li>
            <button
              tabIndex={0}
              className="btn btn-link"
              aria-label="Remove city name"
              onClick={handleClickClearCity}
              onKeyDown={handleKeyDownClearCity}
            >
              Remove city
            </button>
          </li>
        )}
        {hasPark && (
          <li>
            <button
              tabIndex={0}
              className="btn btn-link"
              aria-label="Remove park name" 
              onClick={handleClickClearPark}
              onKeyDown={handleKeyDownClearPark}
            >
              Remove park name
            </button>
          </li>
        )}
        {hasFilter && (
          <li>
            <button
              tabIndex={0}
              className="btn btn-link"
              aria-label="Clear filters" 
              onClick={handleClickClearFilter}
              onKeyDown={handleKeyDownClearFilter}
            >
              Clear filters
            </button>
          </li>
        )}
      </ul>
      <p><b>Or search using the:</b></p>
      <ul>
        <li>
          <Link to="/find-a-park/a-z-list">
            A–Z park list
          </Link>
        </li>
        <li>
          <a
            className="map-link"
            href="https://governmentofbc.maps.arcgis.com/apps/webappviewer/index.html?id=077ef73a1eae4ca88f2bafbb831215af&query=British_Columbia_Parks_Ecological_Reserves_and_Protected_Areas_8747,ORCS_PRIMARY,0000"
          >
            Map of parks
            <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="link-icon" />
          </a>
        </li>
      </ul>
    </div>
  )
}

export default NoSearchResults;