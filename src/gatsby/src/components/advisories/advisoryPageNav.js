import React from "react"
import "../../styles/advisories/advisoryPageNav.scss";

const AdvisoryPageNav = ({ pageIndex, pageCount, setPage }) => {
  let pageArray = [];
  let pageStart = 0;
  let pageEnd = 0;
  const pageNavLen = 2; // nubmers on either side of selected (double + 1 in total)

  const updatePageNav = (p) => {
    // set range for page nav
    pageStart = Math.max(1, p - pageNavLen);
    pageEnd = p + pageNavLen;
    if (pageNavLen - p > -1) { // true if nav is close to "left" end
      pageEnd = Math.min(pageCount, (pageNavLen * 2) + 1); // ensure enough nums showing
    }
  }

  const pageNav = (p) => {
    if (p !== pageIndex) { // Page has changed
      setPage(p); // Set page in parent
      updatePageNav(p);

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: "smooth"
      });
    }
  }

  const pageNext = (pageDir) => { // next 1 or prev -1
    pageNav(pageIndex + pageDir);
  }

  const initialize = () => {
    // create array of all page numbers
    pageArray = Array(pageCount).fill().map((_, idx) => 1 + idx);
    // update display based on current page
    updatePageNav(pageIndex);
  }

  initialize();

  return (
    <div className="page-nav">
      {pageIndex > 1 &&
        <div className="page-nav-item--prev"
          tabIndex={0}
          role="button"
          onKeyDown={() => pageNext(-1)}
          onClick={() => pageNext(-1)}>&lt; Back</div>
      }
      {(pageStart > 1) && (<>
        <div className="page-nav-item--number"
          role="button"
          tabIndex={0}
          onKeyDown={() => pageNav(1)}
          onClick={() => pageNav(1)}>
          <div>
            1
          </div>
        </div>
        <div className="page-nav-item--dot">...</div>
      </>)}
      {pageArray.slice(pageStart - 1, pageEnd).map((page, index) => (
        <div key={page.toString()}
          className="page-nav-item--number"
          tabIndex={0}
          role="button"
          onKeyDown={() => pageNav(page)}
          onClick={() => pageNav(page)}>
          <div className={page === pageIndex ? "selected" : ""}>
            {page}
          </div>
        </div>
      ))}
      {(pageEnd < pageCount) && (<>
        <div className="page-nav-item--dot">...</div>
        <div className="page-nav-item--number"
          tabIndex={0}
          role="button"
          onKeyDown={() => pageNav(pageCount)}
          onClick={() => pageNav(pageCount)}>
          <div>
            {pageCount}
          </div>
        </div>
      </>)}
      {pageIndex < pageCount &&
        <div className="page-nav-item--next"
          tabIndex={0}
          role="button"
          onKeyDown={() => pageNext(1)}
          onClick={() => pageNext(1)}>Next &gt;</div>
      }
    </div>
  );
}

export default AdvisoryPageNav