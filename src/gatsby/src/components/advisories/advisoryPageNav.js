import React from "react"
import "../../styles/advisories/advisoryPageNav.scss";

const AdvisoryPageNav = ({ pageIndex, pageCount, handleClick, handleKeyDownLoadMore }) => {
  return (
    <div className="load-more-button-container">
      {pageIndex < pageCount && (
        <button
          aria-label="Load more results"
          onClick={handleClick}
          onKeyDown={e => handleKeyDownLoadMore(e)}
          className="btn btn-secondary load-more-button"
        >
          Load more
        </button>
      )}
    </div>
  )
}

export default AdvisoryPageNav