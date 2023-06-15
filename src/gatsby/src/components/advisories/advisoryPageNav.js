import React from "react"
import { styled } from '@mui/material/styles';
const PREFIX = 'AdvisoryPageNav';

const classes = {
  pageNav: `${PREFIX}-pageNav`,
  pageNextNav: `${PREFIX}-pageNextNav`,
  pageNumNav: `${PREFIX}-pageNumNav`,
  pageNum: `${PREFIX}-pageNum`,
  selectedPageNum: `${PREFIX}-selectedPageNum`,
  navDots: `${PREFIX}-navDots`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.pageNav}`]: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    color: "#036",
    margin: "25px 0px"
  },
  [`& .${classes.pageNextNav}`]: {
    cursor: "pointer",
    margin: "0 5px"
  },
  [`& .${classes.pageNumNav}`]: {
    margin: "0 4px",
    width: "25px",
    height: "25px",
    lineHeight: "25px",
    textAlign: "center"
  },
  [`& .${classes.pageNum}`]: {
    padding: "0 2px",
    cursor: "pointer",
  },
  [`& .${classes.selectedPageNum}`]: {
    padding: "0 2px",
    background: "#036",
    color: "#fff",
    borderRadius: "5px"
  },
  [`& .${classes.navDots}`]: {
    fontSize: "1rem",
    lineHeight: "1rem"
  }
}));

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
    <Root>
      <div className={classes.pageNav}>
        {pageIndex > 1 &&
          <div className={classes.pageNextNav}
            tabIndex={0}
            role="button"
            onKeyDown={() => pageNext(-1)}
            onClick={() => pageNext(-1)}>&lt; Back</div>
        }
            {(pageStart > 1) && (<>
            <div className={classes.pageNumNav}
            role="button"
            tabIndex={0}
            onKeyDown={() => pageNav(1)}
            onClick={() => pageNav(1)}>
            <div className={classes.pageNum}>
                1
                </div>
            </div>
            <div className={classes.navDots}>...</div>
            
        </>)}
        {pageArray.slice(pageStart -1, pageEnd).map((page, index) => (
            <div key={page.toString()}
            className={classes.pageNumNav}
            tabIndex={0}
            role="button"
            onKeyDown={() => pageNav(page)}
            onClick={() => pageNav(page)}>
            <div className={page === pageIndex ? classes.selectedPageNum : classes.pageNum}>
                {page}
                </div>
            </div>
        ))}
        {(pageEnd < pageCount) && (<>
            <div className={classes.navDots}>...</div>
          <div className={classes.pageNumNav}
            tabIndex={0}
            role="button"
            onKeyDown={() => pageNav(pageCount)}
            onClick={() => pageNav(pageCount)}>
            <div className={classes.pageNum}>
                {pageCount}
                </div>
            </div>
        </>)}
        {pageIndex < pageCount &&
          <div className={classes.pageNextNav}
          tabIndex={0}
          role="button"
          onKeyDown={() => pageNext(1)}
          onClick={() => pageNext(1)}>Next &gt;</div>
        }
        </div>
    </Root>
  );
}

export default AdvisoryPageNav