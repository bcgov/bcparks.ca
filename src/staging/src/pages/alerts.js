import React, { useState, useEffect, useCallback } from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import axios from "axios"
import Header from "../components/header"
import Footer from "../components/footer"

import {
  Container,
  CircularProgress,
} from "@material-ui/core"


import { makeStyles } from "@material-ui/core/styles";


import AdvisoryFilter from "../components/advisories/advisoryFilter"
import AdvisoryList from "../components/advisories/advisoryList"
import AdvisoryPageNav from "../components/advisories/advisoryPageNav"

import "../styles/home.scss"

const useStyles = makeStyles(theme => ({
  advisoriesHeader: {
    marginBottom: "20px"
  },
  advisoryCountNotice: {
    paddingBottom: "20px",
    "& div": {
      display: "inline"
    }
  },
  advisoryCount: {
    fontWeight: "bold"
  }, 
  loadingArea: {
    display: "flex",
    justifyContent: "left"
  },
  loadingText: {
    padding:"8px"
  },
  filterResult: {
    paddingBottom: "20px"
  },
  legend: {
    display: "flex",
    justifyContent: "left",
    marginBottom: "20px"
  },
  legendItem: {
    display: "inline-flex",
    marginRight: "20px",
    lineHeight: "16px",
    fontWeight: "bold"
  },
  legendCircle: {
    width: "16px",
    height: "16px",
    borderRadius: "50%",
    background: "#656565",
    display: "inline-block",
    marginRight:"10px"
  },
  // these colors are in more than once place
  // TODO fix this
  blueAlert: {
    background: "#2464a4"
  },
  redAlert: {
    background: "#d8292f",
  },
  yellowAlert: {
    background: "#fcba19",
  },
}))



const PublicAdvisoryPage = ({ data }) => {

  const classes = useStyles()

  const [advisoryType, setAdvisoryType] = useState(""); // flood, wildfires or all/public (default)  
  const [advisories, setAdvisories] = useState([]); // array of advisories
  const [advisoryCount, setAdvisoryCount] = useState(0); // total of of selected type
  
  const [isNewFilter, setIsNewFilter] = useState(true); // true when any part of filter changes
  const [isDataOld, setIsDataOld] = useState(true); // true when new adivsories needed 

  const [pageTitle, setPageTitle] =  useState('Public Advisories');

  // state of filter checkboxes:
  const [isTypesFilter, setIsTypesFilter] = useState(false);
  const [isParksFilter, setIsParksFilter] = useState(false);
  const [isKeywordFilter, setIsKeywordFilter] = useState(false);

  const [searchText, setSearchText] = useState(""); // search box text
  const [isAnySearch, setIsAnySearch] = useState(false); // true if text in search box

  const [filterCount, setFilterCount] = useState(0); // count of filtered results

  // latest call
  // using state to catch when call has not changed, to avoid duplicate calls
  const [apiCall, setApiCall] = useState(""); // latest advisory fetch call
  const [apiCountCall, setApiCountCall] = useState(""); // latest advisory count call

  const apiUrl = data.site.siteMetadata.apiURL; // api root

  const [isSearchError, setIsSearchError] = useState(false); // true when api error - show msg

  const [pageIndex, setPageIndex] = useState(1); // current page of results, 1-based
  const pageLen = 10; // num items per page
  const [pageCount, setPageCount] = useState(1); // num pages in current search

  // Filter getters and setters --------------------

  const getSearchText = () => {
    return searchText
  }

  const getAdvisoryType = () => {
    return advisoryType
  }

  const getAdvistoryFilter = (filterType => {
    var isFiltered = false;

    switch (filterType) {
      case "parks":
        isFiltered = isParksFilter;
        break;
      case "types":
        isFiltered = isTypesFilter;
        break;
      case "keyword":
        isFiltered = isKeywordFilter;
        break;
      default:
        isFiltered = false; // won't be hit
        break;
    }

    return(isFiltered)
  })

  const setAdvisoryFilter = (filterType, isActive) => { // called from AdvisoryFilter

    switch (filterType) {
      case "parks":
        setIsParksFilter(isActive);
        break;
      case "types":
        setIsTypesFilter(isActive);
        break;
      case "keywords":
        setIsKeywordFilter(isActive);
        break;
      default:
        // won't be hit
        break;
    }

  }

  // functions to pass to AdvisoryFilter
  const filterFunctions = {
    getSearchText:getSearchText,
    setSearchText:setSearchText,
    setFilter:setAdvisoryFilter,
    getFilter:getAdvistoryFilter,
    setType:setAdvisoryType,
    getType:getAdvisoryType
  }

  // Get advisory type from url params ---------------

  const checkAdvisoryType = () => {

    let aType = "public";
    let thisUrl = "";
    let params;

    if (typeof window !== "undefined" && window.document) {
      thisUrl = new URLSearchParams(window.location.search);
      params = Object.fromEntries(thisUrl.entries());
    }

    if (params && params.type) {
      switch (params.type) {
        case 'wildfires':
          aType = "wildfire";
          setPageTitle('Public Advisories | Wildfires');
          break;
        case 'floods':
          aType = "flood";
          setPageTitle('Public Advisories | Flooding');
          break;
        default:
          setPageTitle('Public Advisories');  
      }
    }

    return (aType);

  }
 
  // API calls to get advisories and total count
  const getAdvisoryTotalCount = useCallback(() => {
    // Only runs once per page load
    // This needs to be a separate call, because we need the 
    // unfiltered count for the header

    // exclude unpublished parks
    let q = "/public-advisories/count?protectedAreas.published_at_null=false";

    if (advisoryType === "wildfire") {
      q += "&eventType.eventType_contains=wildfire";
    } else if (advisoryType === "flood") {
      q += "&eventType.eventType_contains=flood";
    }

    const newApiCountCall = apiUrl + q;

    if (newApiCountCall !== apiCountCall) {

      setApiCountCall(newApiCountCall)

      axios
        .get(newApiCountCall)
        .then(function (data) {
          setAdvisoryCount(data.data);
        })

    }

  }, [advisoryType, apiUrl, apiCountCall]);

  const getApiQuery = useCallback((advisoryTypeFilter) => {

    // Order by date and exclude unpublished parks
    let q = "?protectedAreas.published_at_null=false&_sort=advisoryDate:DESC";

    if (advisoryTypeFilter === "wildfire") {
      q += "&eventType.eventType_contains=wildfire";
    } else if (advisoryTypeFilter === "flood") {
      q += "&eventType.eventType_contains=flood";
    }

    let useParksFilter = isParksFilter;
    let useTypesFilter = isTypesFilter;
    let useKeywordFilter = isKeywordFilter;

    // check if any checkbox filter is set
    let anyFilter = isParksFilter || isTypesFilter || isKeywordFilter;
     
    if (!anyFilter) {
      // use all filters if none are selected
      useParksFilter = true;
      useTypesFilter = true;
      useKeywordFilter = true;
    }

    if (advisoryTypeFilter !== 'public') {
      // filter is already applied
      // ignore types checkbox
      useTypesFilter = false;
    }

    // check if there is anything in the search textbox
    let anySearch = (searchText && (searchText !== ""));

    if (anySearch) { // only apply filter if there is a keyword

      let n = 0;

      if (useParksFilter) {
        q += "&_where[_or][" + n + "]"
        q += "[protectedAreas.protectedAreaName_contains]=" + searchText;
        n++;
      }
      if (useTypesFilter) {
        q += "&_where[_or][" + n + "]"
        q += "[eventType.eventType_contains]=" + searchText;
        n++;
      }
      if (useKeywordFilter) {
        q += "&_where[_or][" + n + "]"
        q += "[description_contains]=" + searchText;
        n++;
        q += "&_where[_or][" + n + "]"
        q += "[title_contains]=" + searchText;
      }
    }

    return (q);
  }, [isKeywordFilter, isParksFilter, isTypesFilter, searchText]);

  const getAdvisories = useCallback((q) => { // q = api query

    let newApiCall = apiUrl + `/public-advisories` + q;

    newApiCall += "&_limit=" + pageLen; // use -1 for unlimited
    newApiCall += "&_start=" + (pageLen * (pageIndex - 1));

    if (apiCall !== newApiCall) { // Don't repeat the same call

      setApiCall(newApiCall); // Store this as the latest call

      axios
        .get(newApiCall)
        .then(function (data) {
          let results = data.data;

          setAdvisories(results); // This will pass advisories to the AdvisoryList
          setIsDataOld(false); // Flag that advisories are updated
          setIsNewFilter(false);
          setIsSearchError(false);

          // Get count
          let apiCount = apiUrl + '/public-advisories/count' + q;
          axios
            .get(apiCount)
            .then(function (data) {
              let count = data.data;

              // Num advisories for display
              setFilterCount(count);

              // Set to page one and calc num pages
              let numPages = Math.ceil(count / pageLen);
              setPageCount(numPages);
            })
            .catch(function (error) {
              console.log(error)
            });
        })
        .catch(function (error) {
          setIsDataOld(false); // Use existing data as updated
          setIsSearchError(true); // Show error msg
        });
    } else {
      // api call hasn't changed - don't make same call again
      setIsDataOld(false); // Data is still updated
    }

  }, [pageIndex, apiCall, apiUrl]);

  // Page setter exposed to AdvisortyPageNav
  const setPage = (p) => {
    setPageIndex(p)
  }

  // If the filter changes, set data as old and get new data
  useEffect(() => {
       
    if (isNewFilter) {
      let aType = checkAdvisoryType();
      setAdvisoryType(aType);
      setIsDataOld(true);

      setPageIndex(1); // reset page back to 1 

      let q = getApiQuery(aType);
      getAdvisories(q);
    }

  }, [isNewFilter, getApiQuery, getAdvisories]);

  useEffect(() => {

    // check if there is anything in the search textbox
    let anySearch = (searchText && (searchText !== ""));
    setIsAnySearch(anySearch);

    setIsNewFilter(true);

  }, [isParksFilter, isTypesFilter, isKeywordFilter, searchText])

  useEffect(() => {

    if(!isNewFilter){
      let q = getApiQuery(advisoryType);
      setIsDataOld(true);
      getAdvisories(q);
    }
  }, [pageIndex, advisoryType, isNewFilter, getApiQuery, getAdvisories]);

  // Get total advisory count of this type
  // only has to happen once, when type changes, page reloads
  getAdvisoryTotalCount();

  const menuContent = data?.allStrapiMenus?.nodes || []

  return (
    <>
      <Helmet>
        <title>BC Parks | Public Advisories</title>
      </Helmet>
      <Header mode="internal" content={menuContent} />
      <Container>

        <br />
        <h1>{pageTitle}</h1>
        {advisoryCount > 0 &&
        <div className={classes.advisoriesHeader}>
          <div className={classes.advisoryCountNotice}>
            <div className={classes.advisoryCount}>
              {advisoryCount} {advisoryType} advisories in effect &nbsp;
            </div>
            <div>
                Updated Monday to Friday from 8:30 am to 4:30 pm, excluding statutory
                holidays.
            </div>
          </div>
          <AdvisoryFilter filterFunctions={filterFunctions}></AdvisoryFilter>
        </div>
        }

        <div className="mb-3">
          <i className="fa fa-info-circle"></i> <em>Not all advisories are available in beta</em>
        </div>

        <div className={ isDataOld ? classes.loadingArea : "hidden" }>
          <div className={classes.loadingSpinner}><CircularProgress></CircularProgress></div>
          <div className={classes.loadingText}>Loading...</div>
        </div>
        
        <div className={isDataOld ? "hidden" : undefined}>
          
          <div className={isAnySearch ? classes.filterResult : "hidden"}>
            {!isSearchError && <>Advisories that match your search: {filterCount}</>}
            {isSearchError && "There was an error in your search. Tip: avoid using punctuation"}
          </div>
          
          <div className={classes.legend}>
            <div className={classes.legendItem}>
              <div className={classes.redAlert + ' ' + classes.legendCircle}>&nbsp;</div>
              <div className={classes.legendLevel}>High</div>
            </div>
            <div className={classes.legendItem}>
              <div className={classes.yellowAlert + ' ' + classes.legendCircle}>&nbsp;</div>
              <div className={classes.legendLevel}>Moderate</div>
            </div>
            <div className={classes.legendItem}>
              <div className={classes.blueAlert + ' ' + classes.legendCircle}>&nbsp;</div>
              <div className={classes.legendLevel}>Low</div>
            </div>
          </div>

          <AdvisoryList advisories={advisories} pageIndex={pageIndex} pageLen={pageLen}></AdvisoryList>
          
          <AdvisoryPageNav pageIndex={pageIndex} pageCount={pageCount} setPage={setPage}></AdvisoryPageNav>
          
        </div>

      </Container>
      <br /><br />
      <Footer>{data.strapiWebsites.Footer}</Footer>
    </>
  )
}

export default PublicAdvisoryPage

export const query = graphql`
  {
    strapiWebsites(Name: { eq: "BCParks.ca" }) {
      Footer
      Header
      Name
      Navigation
      id
      homepage {
        id
        Template
        Content {
          id
          strapi_component
        }
      }
    }
    site {
      siteMetadata {
        apiURL
      }
    }
    allStrapiMenus(
      sort: {fields: order, order: ASC}
      filter: {show: {eq: true}}
    ) {
      nodes {
        strapiId
        title
        url
        order
        id
        strapiChildren {
          id
          title
          url
          order
          parent
        }
        strapiParent {
          id
          title
        }
      }
    }
  }
`

