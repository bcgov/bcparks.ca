import React from "react"
import "../../styles/advisories/advisoryPageNav.scss";

const AdvisoryPageNav = ({ pageIndex, pageCount, setPage }) => {
  const handleLoadMore = () => {
    setPage(pageIndex + 1)
  }
  const handleKeyDownLoadMore = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault()
      handleLoadMore()
    }
  }

  return (
    <div className="load-more-button-container">
      {pageIndex < pageCount && (
        <button
          aria-label="Load more results"
          onClick={handleLoadMore}
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