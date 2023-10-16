import React from "react"
import { Link } from "gatsby"
import SearchIcon from '@mui/icons-material/Search'
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import "../../styles/search.scss"

const NoSearchResults = ({
  hasCity, hasPark, hasFilter, handleClickClearCity, handleClickClearPark, handleClickClearFilter
}) => {
  return (
    <div className="no-results-container">
      <div className="no-results-header">
        <SearchIcon />
        <div className="no-results-header--right">
          <h2>Sorry...</h2>
          <p><b>no parks matched your search.</b></p>
        </div>
      </div>
      <p><b>You could:</b></p>
      <ul>
        {hasCity && (
          <li>
            <button className="btn btn-link" onClick={handleClickClearCity}>
              Remove city
            </button>
          </li>
        )}
        {hasPark && (
          <li>
            <button className="btn btn-link" onClick={handleClickClearPark}>
              Remove park name
            </button>
          </li>
        )}
        {hasFilter && (
          <li>
            <button className="btn btn-link" onClick={handleClickClearFilter}>
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
            target="_blank"
            rel="noopener noreferrer"
            className="map-link"
            href="https://governmentofbc.maps.arcgis.com/apps/webappviewer/index.html?id=077ef73a1eae4ca88f2bafbb831215af&query=British_Columbia_Parks_Ecological_Reserves_and_Protected_Areas_8747,ORCS_PRIMARY,0000"
          >
            Map of parks
            <OpenInNewIcon />
          </a>
        </li>
      </ul>
    </div>
  )
}

export default NoSearchResults;