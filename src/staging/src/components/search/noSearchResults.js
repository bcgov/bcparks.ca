import React from "react"

import "../../styles/search.scss"

const  NoSearchResults = () => {
    return (
        <div className="no-results-container m20t mb20 p10">
            <div className="row">
                <div className="col-12 font-weight-bold">
                    We’re unable to find any parks that match your criteria
                </div>
                <div className="col-12 p20t">
                    Your filtering options did not return any results.
                </div>
                <div className="col-12">
                Please try refining your inputs or parameters.
                </div>
            </div>
        </div>
    )
}

export default NoSearchResults;