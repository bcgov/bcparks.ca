import React from "react"
import "../../styles/advisories/advisoryPageNav.scss";

const AdvisoryPageNav = ({ pageIndex, pageCount, handleClick }) => {
  return (
    <div className="load-more-button-container">
      {pageIndex < pageCount && (
        <button
          aria-label="Load more results"
          onClick={handleClick}
          className="btn btn-secondary load-more-button"
        >
          Load more
        </button>
      )}
    </div>
  )
}

export default AdvisoryPageNav