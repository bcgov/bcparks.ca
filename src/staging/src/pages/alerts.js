import React, { useState, useEffect, useCallback } from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import axios from "axios"
import { Container, CircularProgress } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import Footer from "../components/footer"
import Header from "../components/header"
import AdvisoryFilter from "../components/advisories/advisoryFilter"
import AdvisoryList from "../components/advisories/advisoryList"
import AdvisoryPageNav from "../components/advisories/advisoryPageNav"
import AdvisoryLegend from "../components/advisories/advisoryLegend"
import { capitalizeFirstLetter } from "../utils/helpers"
import { getAdvisoryTypeFromUrl } from "../utils/advisoryHelper"

import "../styles/home.scss"

const useStyles = makeStyles(theme => ({
  advisoriesHeader: {
    marginBottom: "2px",
  },
  advisoryCountNotice: {
    paddingBottom: "20px",
    "& div": {
      display: "inline",
    },
  },
  loadingArea: {
    display: "flex",
    justifyContent: "left",
  },
  loadingText: {
    padding: "8px",
  },
  filterResult: {
    paddingBottom: "20px",
  },
}))

const PublicAdvisoryPage = ({ data }) => {
  const classes = useStyles()

  const [advisories, setAdvisories] = useState([]) // array of advisories
  const [advisoryCount, setAdvisoryCount] = useState(0) // total of of selected type

  const [isNewFilter, setIsNewFilter] = useState(true) // true when any part of filter changes
  const [isDataOld, setIsDataOld] = useState(true) // true when new adivsories needed

  const [pageTitle, setPageTitle] = useState("Public Advisories")

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

  const apiUrl = data.site.siteMetadata.apiURL // api root

  const [isSearchError, setIsSearchError] = useState(false) // true when api error - show msg

  const [pageIndex, setPageIndex] = useState(1) // current page of results, 1-based
  const pageLen = 10 // num items per page
  const [pageCount, setPageCount] = useState(1) // num pages in current search

  /* Advisory Event Types */
  const defaultAdvisoryEventType = { label: 'All', value: 'all' }
  const [eventTypes, setEventTypes] = useState([])
  const [advisoryType, setAdvisoryType] = useState(defaultAdvisoryEventType.value)

  useEffect(async () => {
    const eventTypesPromise = axios.get(`${apiUrl}/event-types/`)
    const eventTypesResponse = await Promise.all([eventTypesPromise])

    const formattedEventTypes = eventTypesResponse[0].data.map((obj) => ({ label: obj.eventType, value: obj.eventType.toLowerCase() }))
    formattedEventTypes.splice(0, 0, defaultAdvisoryEventType)
    setEventTypes(formattedEventTypes)

    let eventType = getAdvisoryTypeFromUrl()
    setAdvisoryType(eventType)
  }, [])

  // Get advisory type from url params ---------------
  const updatePageTitle = (aType) => {
    if (aType !== 'all') {
      setPageTitle(`Public Advisories | ${capitalizeFirstLetter(aType)}`)
    } else {
      setPageTitle("Public Advisories")
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
    let q =
      "/public-advisories/count?protectedAreas.published_at_null=false&protectedAreas.isDisplayed=true"

    if (advisoryType !== "all") {
      q += `&eventType.eventType_contains=${advisoryType}`
    }

    const newApiCountCall = apiUrl + q
    if (newApiCountCall !== apiCountCall) {
      setApiCountCall(newApiCountCall)

      axios.get(newApiCountCall).then(function (data) {
        setAdvisoryCount(data.data)
      })
    }
  }, [advisoryType, apiUrl, apiCountCall])

  const getApiQuery = useCallback(
    advisoryTypeFilter => {
      // Order by date and exclude unpublished parks
      let q =
        "?_sort=advisoryDate:DESC&protectedAreas.published_at_null=false&protectedAreas.isDisplayed=true"

      if (advisoryTypeFilter !== "all") {
        q += `&eventType.eventType_contains=${advisoryTypeFilter}`
      }

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
          q += `&_q=${searchText}`
          q += `&_searchType=${searchType}`
        }
      }

      return q
    },
    [isKeywordFilter, isParksFilter, searchText]
  )

  const getAdvisories = useCallback(
    q => {
      // q = api query

      let newApiCall = apiUrl + `/public-advisories` + q

      newApiCall += "&_limit=" + pageLen // use -1 for unlimited
      newApiCall += "&_start=" + pageLen * (pageIndex - 1)

      if (apiCall !== newApiCall) {
        // Don't repeat the same call

        setApiCall(newApiCall) // Store this as the latest call

        axios
          .get(newApiCall)
          .then(function (data) {
            let results = data.data

            setAdvisories(results) // This will pass advisories to the AdvisoryList
            setIsDataOld(false) // Flag that advisories are updated
            setIsNewFilter(false)
            setIsSearchError(false)

            // Get count
            let apiCount = apiUrl + "/public-advisories/count" + q
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

  const protectedArea = data.allStrapiProtectedArea?.nodes

  const advisoriesWithParkNames = advisories.map(item => {
    const parkNamesList = item.protectedAreas.map(park => {
      const findParkNames = protectedArea.find(
        i => i.orcs === park.orcs
      )
      return findParkNames.parkNames
    })
    return {
      ...item,
      parkNames: parkNamesList[0],
    }
  })

  // Page setter exposed to AdvisortyPageNav
  const setPage = p => {
    setPageIndex(p)
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
        <div className={classes.advisoriesHeader}>
          <div className={classes.advisoryCountNotice}>
            {advisoryCount} Active Alerts in BC Parks
          </div>
          <AdvisoryFilter
            defaultEventType={defaultAdvisoryEventType}
            eventTypes={eventTypes}
            filterFunctions={filterFunctions}></AdvisoryFilter>
        </div>

        <div className={isDataOld ? classes.loadingArea : "hidden"}>
          <div className={classes.loadingSpinner}>
            <CircularProgress></CircularProgress>
          </div>
          <div className={classes.loadingText}>Loading...</div>
        </div>

        <div className={isDataOld ? "hidden" : undefined}>
          <div className={isAnySearch ? classes.filterResult : "hidden"}>
            {!isSearchError && (
              <>Advisories that match your search: {filterCount}</>
            )}
            {isSearchError &&
              "There was an error in your search. Tip: avoid using punctuation"}
          </div>

          <AdvisoryLegend />
          <AdvisoryList
            advisories={advisoriesWithParkNames}
            pageIndex={pageIndex}
            pageLen={pageLen}
          ></AdvisoryList>

          <AdvisoryPageNav
            pageIndex={pageIndex}
            pageCount={pageCount}
            setPage={setPage}
          ></AdvisoryPageNav>
        </div>
      </Container>
      <br />
      <br />
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
      sort: { fields: order, order: ASC }
      filter: { show: { eq: true } }
    ) {
      nodes {
        strapiId
        title
        url
        order
        id
        imgUrl
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
    allStrapiProtectedArea(sort: { fields: parent___internal___type }) {
      nodes {
        protectedAreaName
        orcs
        parkNames {
          id
          parkName
          parkNameType
        }
      }
    }
  }
`
