import React, { useState, useEffect, useCallback, useMemo } from "react"
import { graphql, Link } from "gatsby"
import axios from "axios"
import { ProgressBar } from "react-bootstrap"

import Breadcrumbs from "../components/breadcrumbs"
import Footer from "../components/footer"
import Header from "../components/header"
import Seo from "../components/seo"
import AdvisoryFilter from "../components/advisories/advisoryFilter"
import AdvisoryList from "../components/advisories/advisoryList"
import AdvisoryPageNav from "../components/advisories/advisoryPageNav"
import AdvisoryLegend from "../components/advisories/advisoryLegend"
import ScrollToTop from "../components/scrollToTop"
import { capitalizeFirstLetter } from "../utils/helpers"
import { getAdvisoryTypeFromUrl } from "../utils/advisoryHelper"

import "../styles/home.scss"

const PublicActiveAdvisoriesPage = ({ data }) => {
  const [advisories, setAdvisories] = useState([]) // array of advisories

  const [isNewFilter, setIsNewFilter] = useState(true) // true when any part of filter changes
  const [isDataOld, setIsDataOld] = useState(true) // true when new adivsories needed

  const [pageTitle, setPageTitle] = useState("Active advisories")

  // state of filter checkboxes:
  const [isParksFilter, setIsParksFilter] = useState(false)
  const [isKeywordFilter, setIsKeywordFilter] = useState(false)

  const [searchText, setSearchText] = useState("") // search box text
  const [isAnySearch, setIsAnySearch] = useState(false) // true if text in search box

  const [filterCount, setFilterCount] = useState(0) // count of filtered results

  // latest call
  // using state to catch when call has not changed, to avoid duplicate calls
  const [apiCall, setApiCall] = useState("") // latest advisory fetch call
  const [apiCountCall, setApiCountCall] = useState("") // latest advisory count call

  const apiUrl = `${data.site.siteMetadata.apiURL}/api` // api root

  const [isSearchError, setIsSearchError] = useState(false) // true when api error - show msg

  const [pageIndex, setPageIndex] = useState(1) // current page of results, 1-based
  const pageLen = 10 // num items per page
  const [pageCount, setPageCount] = useState(1) // num pages in current search

  /* Advisory Event Types */
  const defaultAdvisoryEventType = useMemo(() => ({ label: 'All', value: 'all' }), [])
  const [eventTypes, setEventTypes] = useState([])
  const [advisoryType, setAdvisoryType] = useState(defaultAdvisoryEventType.value)

  useEffect(() => {
    const fetchEvenType = async () => {
      try {
        const response = await axios.get(`${apiUrl}/event-types`);
  
        const formattedEventTypes = response.data.data.map((obj) => ({
          label: obj.eventType,
          value: obj.eventType,
        }));
  
        formattedEventTypes.splice(0, 0, defaultAdvisoryEventType);
        const localeSortEvent = formattedEventTypes?.sort((a, b) =>
          a.value.localeCompare(b.value, "en", { sensitivity: "base" })
        );
  
        setEventTypes(localeSortEvent);
      } catch (err) {
        console.error("Fetch Even Type error:", err);
      }
    };
  
    fetchEvenType();
  
    let eventType = getAdvisoryTypeFromUrl();
    setAdvisoryType(eventType);
  }, [defaultAdvisoryEventType, apiUrl]);
  
  // Get advisory type from url params ---------------
  const updatePageTitle = (aType) => {
    if (aType !== 'all') {
      setPageTitle(`Active advisories | ${capitalizeFirstLetter(aType)}`)
    } else {
      setPageTitle("Active advisories")
    }
  }

  // Filter getters and setters --------------------
  const getSearchText = () => {
    return searchText
  }

  const getAdvisoryType = () => {
    return advisoryType
  }

  const getAdvistoryFilter = filterType => {
    var isFiltered = false

    switch (filterType) {
      case "parks":
        isFiltered = isParksFilter
        break
      case "keyword":
        isFiltered = isKeywordFilter
        break
      default:
        isFiltered = false // won't be hit
        break
    }

    return isFiltered
  }

  const setAdvisoryFilter = (filterType, isActive) => {
    // called from AdvisoryFilter

    switch (filterType) {
      case "parks":
        setIsParksFilter(isActive)
        break
      case "keywords":
        setIsKeywordFilter(isActive)
        break
      default:
        // won't be hit
        break
    }
  }

  // functions to pass to AdvisoryFilter
  const filterFunctions = {
    getSearchText: getSearchText,
    setSearchText: setSearchText,
    setFilter: setAdvisoryFilter,
    getFilter: getAdvistoryFilter,
    setType: setAdvisoryType,
    getType: getAdvisoryType,
  }

  // API calls to get advisories and total count
  const getAdvisoryTotalCount = useCallback(() => {
    // Only runs once per page load
    // This needs to be a separate call, because we need the
    // unfiltered count for the header

    // exclude unpublished parks
    // this filter has been removed as a temporary workaround for a Strapi bug.
    // see https://github.com/bcgov/bcparks.ca/pull/505/files#r1067160153

    // let q = "/public-advisories/count?protectedAreas.published_at_null=false&protectedAreas.isDisplayed=true"
    let q =
      "/public-advisories/count"

    if (advisoryType !== "all") {
      q += `?queryText&_eventType=${advisoryType}`
    }

    const newApiCountCall = apiUrl + q
    if (newApiCountCall !== apiCountCall) {
      setApiCountCall(newApiCountCall)
    }
  }, [advisoryType, apiUrl, apiCountCall])

  const getApiQuery = useCallback(
    advisoryTypeFilter => {
      // Order by date and exclude unpublished parks
      let q = "?queryText"

      let useParksFilter = isParksFilter
      let useKeywordFilter = isKeywordFilter

      // check if any checkbox filter is set
      let anyFilter = isParksFilter || isKeywordFilter

      if (!anyFilter) {
        // use all filters if none are selected
        useParksFilter = true
        useKeywordFilter = true
      }

      // check if there is anything in the search textbox
      let anySearch = searchText && searchText !== ""

      if (anySearch) {
        // only apply filter if there is a keyword

        if (useParksFilter || useKeywordFilter) {
          let searchType
          if (useParksFilter && !useKeywordFilter) {
            searchType = "park"
          } else if (useKeywordFilter && !useParksFilter) {
            searchType = "keyword"
          } else {
            searchType = "all"
          }
          q += `=${searchText}`
          q += `&_searchType=${searchType}`
        }
      }

      if (advisoryTypeFilter !== "all") {
        q += `&_eventType=${advisoryTypeFilter}`
      }

      return q
    },
    [isKeywordFilter, isParksFilter, searchText]
  )

  const getAdvisories = useCallback(
    q => {
      // q = api query

      let newApiCall = apiUrl + `/public-advisories` + q

      newApiCall += "&limit=" + pageLen // use -1 for unlimited
      newApiCall += "&start=" + pageLen * (pageIndex - 1)

      if (apiCall !== newApiCall) {
        // Don't repeat the same call

        setApiCall(newApiCall) // Store this as the latest call

        axios
          .get(newApiCall)
          .then(function (data) {
            let results = data.data.data

            setAdvisories(results) // This will pass advisories to the AdvisoryList
            setIsDataOld(false) // Flag that advisories are updated
            setIsNewFilter(false)
            setIsSearchError(false)

            // Get count
            let apiCount = apiUrl + "/public-advisories/count" + q
            if (q === "?queryText") {
             apiCount = apiUrl + "/public-advisories/count"
            }
            
            axios
              .get(apiCount)
              .then(function (data) {
                let count = data.data

                // Num advisories for display
                setFilterCount(count)

                // Set to page one and calc num pages
                let numPages = Math.ceil(count / pageLen)
                setPageCount(numPages)
              })
              .catch(function (error) {
                console.log(error)
              })
          })
          .catch(function (error) {
            setIsDataOld(false) // Use existing data as updated
            setIsSearchError(true) // Show error msg
          })
      } else {
        // api call hasn't changed - don't make same call again
        setIsDataOld(false) // Data is still updated
      }
    },
    [pageIndex, apiCall, apiUrl]
  )

  // Page setter exposed to AdvisortyPageNav
  const setPage = p => {
    setPageIndex(p)
  }

  // This hashset is used by the advisoryCard.js component to quiclky 
  // determine if the advisoriy is associated with any parks in addition 
  // to the specified  Fire Centres, Fire Zones, Regions, or Sections.
  // Management Areas are not currently used for anything but are included
  // for completeness. The data comes from GraphQL.
  const buildParkInfoHash = () => {
    const hash = {};
    for (const x of (data?.allStrapiProtectedArea.nodes || [])) {
      hash[x?.strapi_id.toString()] = {
        managementAreas: x.managementAreas.map(m => { return m.strapi_id }),
        sections: x.managementAreas.map(m => { return m.section?.id }),
        regions: x.managementAreas.map(m => { return m.region?.id }),
        fireZones: x.fireZones.map(m => { return m.strapi_id }),
        naturalResourceDistricts: (x.naturalResourceDistricts || []).map(m => m.strapi_id),
        fireCentres: x.fireZones.map(m => { return m.fireCentre?.id })
      };
    }
    return hash;
  }

  // If the filter changes, set data as old and get new data
  useEffect(() => {
    if (isNewFilter) {
      const aType = getAdvisoryTypeFromUrl()
      updatePageTitle(aType)
      setAdvisoryType(aType)
      setIsDataOld(true)

      setPageIndex(1) // reset page back to 1

      let q = getApiQuery(aType)
      getAdvisories(q)
    }
  }, [isNewFilter, getApiQuery, getAdvisories])

  useEffect(() => {
    // check if there is anything in the search textbox
    let anySearch = searchText && searchText !== ""
    setIsAnySearch(anySearch)

    setIsNewFilter(true)
  }, [isParksFilter, isKeywordFilter, searchText])

  useEffect(() => {
    if (!isNewFilter) {
      let q = getApiQuery(advisoryType)
      updatePageTitle(advisoryType)
      setIsDataOld(true)
      getAdvisories(q)
    }
  }, [pageIndex, advisoryType, isNewFilter, getApiQuery, getAdvisories])

  // Get total advisory count of this type
  // only has to happen once, when type changes, page reloads
  useEffect(() => {
    getAdvisoryTotalCount()
  }, [getAdvisoryTotalCount])

  const menuContent = data?.allStrapiMenu?.nodes || []
  const parkInfoHash = buildParkInfoHash();

  const breadcrumbs = [
    <Link key="1" to="/">
      Home
    </Link>,
    <div key="2" className="breadcrumb-text">
      Active advisories
    </div>
  ]

  return (
    <div>
      <Header mode="internal" content={menuContent} />
      <div id="main-content" className="static-content--header unique-page--header page-breadcrumbs">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
      </div>
      <div className="static-content-container">
        <h1>{pageTitle}</h1>
        <div className="mb-2">
          <div className="mb-2">
            {filterCount} active advisories in BC Parks
          </div>
          <AdvisoryFilter
            defaultEventType={defaultAdvisoryEventType}
            eventTypes={eventTypes}
            filterFunctions={filterFunctions}></AdvisoryFilter>
        </div>

        <div className={isDataOld ? "my-2" : "hidden"}>
            <ProgressBar animated now={100} />
        </div>

        <div className={isDataOld ? "hidden" : undefined}>
          <div className={isAnySearch ? "my-2" : "hidden"}>
            {!isSearchError && (
              <>Advisories that match your search: {filterCount}</>
            )}
            {isSearchError &&
              "There was an error in your search. Tip: avoid using punctuation"}
          </div>

          <AdvisoryLegend />
          <AdvisoryList
            advisories={advisories}
            parkInfoHash={parkInfoHash}
          ></AdvisoryList>

          <AdvisoryPageNav
            pageIndex={pageIndex}
            pageCount={pageCount}
            setPage={setPage}
          ></AdvisoryPageNav>
        </div>
      </div>
      <ScrollToTop />
      <Footer />
    </div>
  )
}

export default PublicActiveAdvisoriesPage

export const Head = () => (
  <Seo title="Active advisories" description="Up-to-date information to help you plan your visit to a park in British Columbia. Get updates on access, closures, hazards, and trail conditions in BC Parks." />
)

export const query = graphql`
  {
    site {
      siteMetadata {
        apiURL
      }
    }
    allStrapiMenu(
      sort: {order: ASC},
      filter: {show: {eq: true}}
    ) {
      nodes {
        strapi_id
        title
        url
        order
        id
        strapi_children {
          id
          title
          url
          order
        }
        strapi_parent {
          id
          title
        }
      }
    }
    allStrapiProtectedArea {
      nodes {
        strapi_id
        managementAreas {
          strapi_id
          region {
            id
          }
          section {
            id
          }
        }
        fireZones {
          strapi_id
          fireCentre {
            id
          }
        }
        naturalResourceDistricts {
          strapi_id
        }
      }
    }
  }
`
