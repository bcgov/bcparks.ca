import React from "react"
import { Link } from "gatsby"
import TravelExploreIcon from '@mui/icons-material/TravelExplore';

import "../../styles/search.scss"

const NoSearchResults = () => {
    return (
        <div className="no-results-container">
            <div className="no-results-container--left">
                <TravelExploreIcon />
            </div>
            <div className="no-results-container--right">
                <h2>Sorry...</h2>
                <p className="mb-3"><b>We didn’t find any parks that match your search.</b></p>
                <p><b>You could try:</b></p>
                <ul>
                    <li>Changing your search term</li>
                    <li>Clearing filters</li>
                </ul>
                <p><b>Or search using the:</b></p>
                <ul>
                    <li>
                        <Link to="/parks">
                            A–Z park list
                        </Link>
                    </li>
                    <li>
                        <a
                            target="_blank"
                            rel="noopener noreferrer"
                            href="https://governmentofbc.maps.arcgis.com/apps/webappviewer/index.html?id=077ef73a1eae4ca88f2bafbb831215af&query=British_Columbia_Parks_Ecological_Reserves_and_Protected_Areas_8747,ORCS_PRIMARY,0000"
                        >
                            Map of parks
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    )
}

export default NoSearchResults;