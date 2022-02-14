import React, { useState, useEffect, useCallback, useMemo } from "react"
import { graphql } from "gatsby"
import axios from "axios"
import Footer from "../components/footer"
import Header from "../components/header"
import "../styles/search.scss"
import {
  Checkbox,
  FormGroup,
  FormControlLabel,
  Chip,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Link,
  LinearProgress,
  Breadcrumbs,
  Button,
  Divider,
  Dialog,
  DialogContent,
  DialogActions,
} from "@material-ui/core"
import Pagination from "@material-ui/lab/Pagination"
import SearchIcon from "@material-ui/icons/Search"
import CancelIcon from "@material-ui/icons/Cancel"
import dayUseIcon from "../images/park/day-use.png"
import ExpandLess from "@material-ui/icons/ExpandLess"
import ExpandMore from "@material-ui/icons/ExpandMore"
// import blueAlertIcon from "../images/park/blue-alert-32.png"
// import yellowAlertIcon from "../images/park/yellow-alert-32.png"
import redAlertIcon from "../images/park/red-alert-32.png"
import parksLogo from "../images/Mask_Group_5.png"
import Carousel from "react-material-ui-carousel"
import SearchFilter from "../components/search/searchFilter"
import NoSearchResults from "../components/search/noSearchResults"

export const query = graphql`
  query {
    site {
      siteMetadata {
        apiURL
      }
    }
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
    allStrapiActivityTypes(sort: { fields: activityName }) {
      totalCount
      nodes {
        strapiId
        activityName
      }
    }
    allStrapiFacilityTypes(sort: { fields: facilityName }) {
      totalCount
      nodes {
        strapiId
        facilityName
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

export default function Explore({ location, data }) {
  const menuContent = data?.allStrapiMenus?.nodes || []

  const activityItems = data.allStrapiActivityTypes.nodes.map(activity => {
    return {
      label: activity.activityName,
      value: activity.strapiId,
    }
  });
  const activityItemsLabels = {};
  activityItems.forEach(item => {
    activityItemsLabels[item.value] = item.label;
  });

  const truncatedFilterLength = 5;

  const [filteredActivities, setFilteredActivities] = useState(
    activityItems.slice(0, truncatedFilterLength)
  )

  const [showActivities, setActivityVisibility] = useState(true)

  const [showMoreActivities, setMoreActivites] = useState(true)

  const facilityItems = data.allStrapiFacilityTypes.nodes.map(facility => {
    return {
      label: facility.facilityName,
      value: facility.strapiId,
    }
  })
  const facilityItemsLabels = {};
  facilityItems.forEach(item => {
    facilityItemsLabels[item.value] = item.label;
  });

  const [filteredFacilities, setFilteredFacilities] = useState(
    facilityItems.slice(0, truncatedFilterLength)
  )

  const [showFacilities, setFacilityVisibility] = useState(true)

  const [showMoreFacilities, setMoreFacilities] = useState(true)

  const [quickSearch, setQuickSearch] = useState({
    camping: false,
    petFriendly: false,
    wheelchair: false,
    marine: false,
    ecoReserve: false,
    electricalHookup: false,
  })

  const quickSearchFilters = [
    { label: 'Camping', type: 'camping' },
    { label: 'Dog friendly', type: 'petFriendly' },
    { label: 'Wheelchair accessible', type: 'wheelchair' },
    { label: 'Marine park', type: 'marine' },
    { label: 'Ecological reserve', type: 'ecoReserve' },
    { label: 'Electrical hookups', type: 'electricalHookup' }
  ]

  const [selectedActivities, setSelectedActivities] = useState(
    location.state && location.state.selectedActivities
      ? [...location.state.selectedActivities]
      : []
  )
  const [selectedFacilities, setSelectedFacilities] = useState(
    location.state && location.state.selectedFacilities
      ? [...location.state.selectedFacilities]
      : []
  )
  const [inputText, setInputText] = useState(
    location.state && location.state.searchText ? location.state.searchText : ""
  )
  const [searchText, setSearchText] = useState(
    location.state && location.state.searchText ? location.state.searchText : ""
  )

  const [filterSelections, setFilterSelections] = useState([])
  const [searchResults, setSearchResults] = useState([])
  const [numberOfPages, setNumberOfPages] = useState(0)
  const [totalResults, setTotalResults] = useState(0)

  const itemsPerPage = 6
  const [currentPage, setCurrentPage] = useState(1)
  const [isLoading, setIsLoading] = useState(true)

  const [openFilter, setOpenFilter] = useState(false)

  const [openQuickView, setOpenQuickView] = useState(false)

  const breadcrumbs = [
    <Link key="1" href="/">
      Home
    </Link>,
    <div key="2" className="breadcrumb-text">
      Find a Park
    </div>,
  ]

  const {
    camping,
    petFriendly,
    wheelchair,
    marine,
    ecoReserve,
    electricalHookup,
  } = quickSearch

  const handleQuickSearchChange = event => {
    setQuickSearch({
      ...quickSearch,
      [event.target.name]: event.target.checked,
    })
    setCurrentPage(1)
  }

  const handleActivitiesLengthChange = () => {
    setMoreActivites(!showMoreActivities);
    if (showMoreActivities) {
      setFilteredActivities(activityItems);
    } else {
      setFilteredActivities(activityItems.slice(0, truncatedFilterLength));
    }
  }

  const handleActivityCheck = (activity, event) => {
    if (event.target.checked) {
      setSelectedActivities([...selectedActivities, activity])
    } else {
      setSelectedActivities([
        ...selectedActivities.filter(a => a.value !== activity.value),
      ])
    }
  }

  const handleFacilitiesLengthChange = () => {
    setMoreFacilities(!showMoreFacilities);
    if (showMoreFacilities) {
      setFilteredFacilities(facilityItems);
    } else {
      setFilteredFacilities(facilityItems.slice(0, truncatedFilterLength));
    }
  }

  const handleFacilityCheck = (facility, event) => {
    if (event.target.checked) {
      setSelectedFacilities([...selectedActivities, facility])
    } else {
      setSelectedFacilities([
        ...selectedFacilities.filter(a => a.value !== facility.value),
      ])
    }
  }

  const handleActivityDelete = chipToDelete => {
    setSelectedActivities(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
    setCurrentPage(1)
  }

  const handleFacilityDelete = chipToDelete => {
    setSelectedFacilities(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
    setCurrentPage(1)
  }

  const handleFilterDelete = chipToDelete => () => {
    if (chipToDelete.type === "activity") {
      handleActivityDelete(chipToDelete)
    } else if (chipToDelete.type === "facility") {
      handleFacilityDelete(chipToDelete)
    } else {
      setQuickSearch({
        ...quickSearch,
        [chipToDelete.type]: false,
      })
      setCurrentPage(1)
    }
  }

  const handlePageChange = (event, value) => {
    setCurrentPage(value)
  }

  const handleClickOpenFilter = () => {
    setOpenFilter(true)
  }

  const handleOpenQuickView = () => {
    setOpenQuickView(true)
  }

  const handleCloseQuickView = () => {
    setOpenQuickView(false)
  }

  const handleSearch = () => {
    setSearchText(inputText)
  }

  const setFilters = useCallback(() => {
    const filters = []
    selectedActivities.forEach(a => {
      filters.push({ ...a, type: "activity" })
    })
    selectedFacilities.forEach(f => {
      filters.push({ ...f, type: "facility" })
    })
    if (camping) {
      filters.push({ label: "Camping", type: "camping" })
    }
    if (petFriendly) {
      filters.push({ label: "Dog Friendly", type: "petFriendly" })
    }
    if (wheelchair) {
      filters.push({ label: "Wheelchair Accessible", type: "wheelchair" })
    }
    if (marine) {
      filters.push({ label: "Marine Park", type: "marine" })
    }
    if (ecoReserve) {
      filters.push({ label: "Ecological reserve", type: "ecoReserve" })
    }
    if (electricalHookup) {
      filters.push({ label: "Electrical Hookup", type: "electricalHookup" })
    }
    setFilterSelections([...filters])
  }, [
    camping,
    ecoReserve,
    electricalHookup,
    marine,
    petFriendly,
    selectedActivities,
    selectedFacilities,
    wheelchair,
  ])

  const params = useMemo(() => {
    // TODO: using names is a bit fragile here, all data should have 'codes' and then
    // we can use those instead
    const wheelchairFacility = data.allStrapiFacilityTypes.nodes.find(facility => {
      return facility.facilityName.toLowerCase() === "accessibility information";
    });
    const wheelchairFacilityId = wheelchairFacility.strapiId;
    const electricalFacility = data.allStrapiFacilityTypes.nodes.find(facility => {
      return facility.facilityName.toLowerCase() === "electrical hookups";
    });
    const electricalFacilityId = electricalFacility.strapiId;
    const petsActivity = data.allStrapiActivityTypes.nodes.find(activity => {
      return activity.activityName.toLowerCase() === "pets on leash";
    });
    const petsActivityId = petsActivity.strapiId;

    const params = {
      _q: searchText,
    };

    if (selectedActivities.length > 0) {
      params.activities = selectedActivities.map(activity => activity.value);
    }
    if (selectedFacilities.length > 0) {
      params.facilities = selectedFacilities.map(facility => facility.value);
    }
    if (quickSearch.camping) {
      params.camping = "Y";
    }
    if (quickSearch.petFriendly) {
      if (typeof params.activities === "undefined") {
        params.activities = [];
      }
      params.activities.push(petsActivityId);
    }
    if (quickSearch.wheelchair) {
      if (typeof params.facilities === "undefined") {
        params.facilities = [];
      }
      params.facilities.push(wheelchairFacilityId);
    }
    if (quickSearch.marine) {
      params.marineProtectedArea = "Y";
    }
    if (quickSearch.ecoReserve) {
      params.typeCode = "ER";
    }
    if (quickSearch.electricalHookup) {
      if (typeof params.facilities === "undefined") {
        params.facilities = [];
      }
      params.facilities.push(electricalFacilityId);
    }

    return params;
  }, [
    data.allStrapiActivityTypes.nodes,
    data.allStrapiFacilityTypes.nodes,
    searchText,
    selectedActivities,
    selectedFacilities,
    quickSearch,
  ]);

  const isActiveSearch = (
    params._q ||
    params.activity ||
    params.facility ||
    params.camping ||
    params.marine ||
    params.ecoReserve
  );

  useEffect(() => {
    setIsLoading(true)
    setFilters()

    const apiUrl = data.site.siteMetadata.apiURL;

    const pageStart = (currentPage - 1) * itemsPerPage;
    const pageLimit = itemsPerPage;

    const countPromise = axios.get(`${apiUrl}/protected-areas/count`, { params });
    const resultPromise = axios
      .get(
        `${apiUrl}/protected-areas/`,
        { params: { ...params, _start: pageStart, _limit: pageLimit } }
      );
    Promise.all([countPromise, resultPromise]).then(([countResponse, resultResponse]) => {
      if (countResponse.status === 200 && resultResponse.status === 200) {
        const total = parseInt(countResponse.data, 10);
        const pages = Math.ceil(total / itemsPerPage);
        setSearchResults([...resultResponse.data]);
        setTotalResults(total);
        setNumberOfPages(pages);
      } else {
        setSearchResults([]);
        setTotalResults(0);
        setNumberOfPages(0);
      }
    }).finally(() => {
      setIsLoading(false);
    });
  }, [
    params,
    currentPage,
    data.site.siteMetadata.apiURL,
    setFilters,
    setNumberOfPages,
    setSearchResults,
    setTotalResults,
  ])

  return (
    <>
      <Header content={menuContent} />
      <div className="search-body">
        <div className="search-results-main container">
          <div className="search-results-container">
            <Breadcrumbs
              separator="›"
              aria-label="breadcrumb"
              className="p10t sm-p10"
            >
              {breadcrumbs}
            </Breadcrumbs>
            <div className="row no-gutters">
              <div className="col-12">
                <h1 className="headline-text p40t sm-p10">
                  {!isActiveSearch && (
                    <>Find a park</>
                  )}
                  {isLoading && isActiveSearch && (
                    <>Searching...</>
                  )}
                  {!isLoading && isActiveSearch && (
                    <>
                      {totalResults}{" "}
                      {totalResults === 1
                        ? " result found"
                        : " results found"}
                    </>
                  )}
                </h1>
              </div>
            </div>
            <div className="row no-gutters">
            <div className="col-lg-3 col-md-12 col-sm-12">
                <div className="search-results-quick-filter m15t d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                  <div className="row no-gutters">
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-12 col-sm-12">
                <div className="search-results-list container">
                  {filterSelections.length > 0 && (
                    <>
                      <div className="row p20t d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                        <div className="col-12">
                          {filterSelections.map((f, index) => (
                            <Chip
                              key={index}
                              label={f.label}
                              onDelete={handleFilterDelete(f)}
                              variant="outlined"
                              className="park-filter-chip font-weight-bold"
                              deleteIcon={<CancelIcon className="close-icon" />}
                            />
                          ))}
                        </div>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-lg-9 col-md-12 col-sm-12">
                <div className="search-results-quick-filter d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
                  <div className="row no-gutters">
                    <div className="col-12">
                      <TextField
                        id="park-search-text"
                        variant="outlined"
                        placeholder="e.g Alice Park"
                        className="park-search-text-box h50p"
                        value={inputText}
                        onChange={event => {
                          setInputText(event.target.value)
                        }}
                        onKeyPress={ev => {
                          if (ev.key === "Enter") {
                            setSearchText(inputText)
                            ev.preventDefault()
                          }
                        }}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <SearchIcon className="search-icon" />
                            </InputAdornment>
                          ),
                        }}
                      />
                    </div>
                  </div>
                </div>
                <div className="search-results-list container">
                  <div className="row">
                    <div className="col-lg-8 col-md-6 col-sm-12 col-xs-12 p10t">
                      <div className="d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
                        <Button
                          fullWidth
                          className="bcgov-normal-blue mobile-search-element-height h50p"
                          onClick={() => {
                            handleSearch()
                          }}>
                          Search
                        </Button>
                      </div>
                    </div>
                    <div className="col-lg-8 col-md-6 col-sm-12 col-xs-12 p10t">
                      <div className="d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
                        <Button
                          variant="outlined"
                          onClick={handleClickOpenFilter}
                          className="bcgov-button bcgov-normal-white h50p font-weight-bold"
                        >
                          Filter
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="row no-gutters">
              <div className="col-lg-3 col-md-12 col-sm-12">
                <div className="search-results-quick-filter">
                  <div className="row no-gutters d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                    <div className="col-12">
                      <div className="search-results-quick-filter">
                        <div className="row no-gutters pb20">
                          <div className="col-12 park-search-text-box-container d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                            <TextField
                              id="park-search-text"
                              variant="outlined"
                              placeholder="e.g Alice Park"
                              className="park-search-text-box h50p"
                              value={inputText}
                              onChange={event => {
                                setInputText(event.target.value)
                              }}
                              onKeyPress={ev => {
                                if (ev.key === "Enter") {
                                  setSearchText(inputText)
                                  ev.preventDefault()
                                }
                              }}
                              InputProps={{
                                startAdornment: (
                                  <InputAdornment position="start">
                                    <SearchIcon className="search-icon" />
                                  </InputAdornment>
                                ),
                              }}
                            />
                          </div>
                          <div className="m15t col-12 park-search-text-box-container d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                            <Button
                              fullWidth
                              className="bcgov-normal-blue mobile-search-element-height h50p"
                              onClick={handleSearch}>
                              Search
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-12 pr-3">
                      <div className="">
                        <h4 className="filter-heading p10t">Popular</h4>
                        <FormGroup className="p10l filter-options-container">
                          {quickSearchFilters.map((item) => {
                            return (
                              <FormControlLabel
                                key={item.label}
                                control={
                                  <Checkbox
                                    checked={quickSearch[item.type]}
                                    onChange={handleQuickSearchChange}
                                    name={item.type}
                                  />
                                }
                                label={item.label}
                                className={
                                  quickSearch[item.type] ? "text-light-blue no-wrap" : "no-wrap"
                                }
                              />
                            )
                          })}
                        </FormGroup>
                        <hr></hr>
                        <div
                          tabIndex={0}
                          role="button"
                          className="row pointer mr-3"
                          onClick={() => { setActivityVisibility(!showActivities) }}
                          onKeyDown={() => { setActivityVisibility(!showActivities) }}>
                          <div className="col-md-4">
                            <h4 className="filter-heading p10t">Activities</h4>
                          </div>
                          <div className="col-md-2 ml-auto">
                            {
                              showActivities ?
                                <ExpandLess fontSize="large" className="mt-auto" />
                                :
                                <ExpandMore fontSize="large" className="mt-auto" />
                            }
                          </div>
                        </div>
                        <div>
                          {
                            showActivities ?
                              <div>
                                <FormGroup className="p10l filter-options-container">
                                  {filteredActivities.map((a) => {
                                    return (
                                      <FormControlLabel
                                        key={a.label}
                                        control={
                                          <Checkbox
                                            checked={
                                              selectedActivities.filter(
                                                act => act.value === a.value
                                              ).length === 1
                                                ? true
                                                : false
                                            }
                                            onChange={event => {
                                              handleActivityCheck(a, event)
                                            }}
                                            name={a.label}
                                          />
                                        }
                                        label={a.label}
                                        className={
                                          selectedActivities.filter(
                                            act => act.value === a.value
                                          ).length === 1
                                            ? "text-light-blue no-wrap"
                                            : "no-wrap"
                                        }
                                      />
                                    )
                                  })}
                                </FormGroup>
                                <Link
                                  className="ml-auto pointer p20"
                                  onClick={() => {
                                    handleActivitiesLengthChange([])
                                  }}
                                  tabIndex="0"
                                >
                                  {
                                    showMoreActivities ?
                                      <div style={{ color: `#2464A4` }}>
                                        Show all {activityItems.length}
                                        <ExpandMore fontSize="small" />
                                      </div>
                                      :
                                      <div style={{ color: `#2464A4` }}>
                                        Show less
                                        <ExpandLess fontSize="small" />
                                      </div>
                                  }
                                </Link>
                              </div>
                              :
                              <div></div>
                          }
                        </div>
                        <hr></hr>
                        <div
                          tabIndex={0}
                          role="button"
                          className="row pointer mr-3"
                          onClick={() => { setFacilityVisibility(!showFacilities) }}
                          onKeyDown={() => { setFacilityVisibility(!showFacilities) }}>
                          <div className="col-md-4">
                            <h4 className="filter-heading p10t">Facilities</h4>
                          </div>
                          <div className="col-md-2 ml-auto">
                            {
                              showFacilities ?
                                <ExpandLess fontSize="large" className="mt-auto" />
                                :
                                <ExpandMore fontSize="large" className="mt-auto" />
                            }
                          </div>
                        </div>
                        <div>
                          {
                            showFacilities ?
                              <div>
                                <FormGroup className="p10l filter-options-container">
                                  {filteredFacilities.map((f) => {
                                    return (
                                      <FormControlLabel
                                        key={f.label}
                                        control={
                                          <Checkbox
                                            checked={
                                              selectedFacilities.filter(
                                                fac => fac.value === f.value
                                              ).length === 1
                                                ? true
                                                : false
                                            }
                                            onChange={event => {
                                              handleFacilityCheck(f, event)
                                            }}
                                            name={f.label}
                                          />
                                        }
                                        label={f.label}
                                        className={
                                          selectedFacilities.filter(
                                            fac => fac.value === f.value
                                          ).length === 1
                                            ? "text-light-blue no-wrap"
                                            : "no-wrap"
                                        }
                                      />
                                    )
                                  })}
                                </FormGroup>
                                <Link
                                  className="ml-auto pointer p20"
                                  onClick={() => {
                                    handleFacilitiesLengthChange([])
                                  }}
                                  tabIndex="0"
                                >
                                  {
                                    showMoreFacilities ?
                                      <div style={{ color: `#2464A4` }}>
                                        Show all {facilityItems.length}
                                        <ExpandMore fontSize="small" />
                                      </div>
                                      :
                                      <div style={{ color: `#2464A4` }}>
                                        Show less
                                        <ExpandLess fontSize="small" />
                                      </div>
                                  }
                                </Link>
                              </div>
                              :
                              <div></div>
                          }
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="col-lg-9 col-md-12 col-sm-12">
                <div className="search-results-list container">
                  <div className="m10t text-center">
                    <i className="fa fa-info-circle"></i> <em>Park search is limited during beta</em>
                  </div>
                  {isLoading && (
                    <div className="container mt-5">
                      <LinearProgress />
                    </div>
                  )}
                  {!isLoading && (
                    <>
                      {!searchResults ||
                        (searchResults.length === 0 && (<NoSearchResults></NoSearchResults>) )}
                      {searchResults && searchResults.length > 0 && (
                        <>
                          {searchResults
                            .map((r, index) => (
                              <div key={index} className="m20t">
                                <Card className="d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
                                  <CardContent className="park-card park-card-desktop">
                                    <div className="row search-result-card no-gutters">
                                      <div className="col-12">
                                        <div className="row">
                                          {r.parkPhotos &&
                                            r.parkPhotos.length === 0 && (
                                              <div className="col-lg-5 close-margin park-image-div park-image-logo-div">
                                                <img
                                                  alt="logo"
                                                  key={index}
                                                  className="search-result-logo-image"
                                                  src={parksLogo}
                                                />
                                              </div>
                                            )}
                                          {r.parkPhotos &&
                                            r.parkPhotos.length === 1 && (
                                              <div className="col-lg-5 close-margin park-image-div">
                                                <img
                                                  alt="park"
                                                  key={index}
                                                  className="search-result-image"
                                                  src={r.parkPhotos[0]}
                                                />
                                              </div>
                                            )}
                                          {r.parkPhotos &&
                                            r.parkPhotos.length > 1 && (
                                              <div className="col-lg-5 close-margin park-image-div">
                                                <Carousel
                                                  className="park-carousel"
                                                  autoPlay={false}
                                                  indicators={false}
                                                  navButtonsAlwaysVisible={true}
                                                  animation="fade"
                                                  timeout={200}
                                                >
                                                  {r.parkPhotos.map(
                                                    (item, index) => {
                                                      return (
                                                        <img
                                                          alt="park carousel"
                                                          key={index}
                                                          className="search-result-image"
                                                          src={`${item}`}
                                                        />
                                                      )
                                                    }
                                                  )}
                                                </Carousel>
                                              </div>
                                            )}

                                          <div className="col-lg-7 p20t park-content p20l">
                                            <div className="row">
                                              <div className="col-12 park-overview-content text-blue small-font">
                                                {r.isOpenToPublic && (
                                                  <div className="text-green font-weight-bold">
                                                    Open to public access
                                                  </div>
                                                )}
                                                {!r.isOpenToPublic && (
                                                  <div className="text-red font-weight-bold">
                                                    Closed to public access
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            <Link
                                              href={`/${r.slug}`}
                                              className="p10t"
                                            >
                                              <h3 className="park-heading-text">
                                                {r.protectedAreaName}
                                              </h3>
                                            </Link>
                                            <div className="row p10t mr5">
                                              <div className="col-6">
                                                {r.advisories && r.advisories.length > 0 && r.advisories.map(
                                                  (a, index1) => (
                                                    // TODO Display all advisories when Event types are
                                                    // available in elastic search results based on severity
                                                    <div
                                                      key={index1}
                                                      className="flex-display"
                                                    >
                                                      {index1 === 0 && (
                                                        <>
                                                          <img
                                                            alt=""
                                                            className="search-result-icon"
                                                            src={redAlertIcon}
                                                          />
                                                          <div className="pl15 text-blue pb20">
                                                            {a} (1)
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                              <div className="col-6">
                                                {r.hasDayUsePass &&
                                                  r.hasReservations && (
                                                    <div className="flex-display">
                                                      <img
                                                        alt=""
                                                        className="search-result-icon"
                                                        src={dayUseIcon}
                                                      />
                                                      <div className="pl15 mtm7 text-blue">
                                                        Day use and camping{" "}
                                                        <br />
                                                        offered at this park
                                                      </div>
                                                    </div>
                                                  )}
                                              </div>
                                            </div>
                                            <div className="row p10t mr5">
                                              <div className="col-6">
                                                {r.parkActivities &&
                                                  r.parkActivities.length >
                                                  0 && (
                                                    <>
                                                      <div className="park-af-list pr3">
                                                        <b>Activities:</b>
                                                      </div>
                                                      {r.parkActivities.map(
                                                        (parkActivity, index2) => (
                                                          <div
                                                            key={index2}
                                                            className="park-af-list pr3 text-black"
                                                          >
                                                            {index2 < 11 && (
                                                              <>
                                                                {activityItemsLabels[parkActivity.activityType]}
                                                                {index2 === 10
                                                                  ? " ..."
                                                                  : index2 ===
                                                                    r
                                                                      .parkActivities
                                                                      .length -
                                                                    1
                                                                    ? ""
                                                                    : ", "}
                                                              </>
                                                            )}
                                                          </div>
                                                        )
                                                      )}
                                                      <br />
                                                    </>
                                                  )}
                                              </div>
                                              <div className="col-6">
                                                {r.parkFacilities &&
                                                  r.parkFacilities.length >
                                                  0 && (
                                                    <>
                                                      <div className="park-af-list pr3">
                                                        <b>Facilities:</b>
                                                      </div>

                                                      {r.parkFacilities.map(
                                                        (parkFacility, index3) => (
                                                          <div
                                                            key={parkFacility.id}
                                                            className="park-af-list pr3 text-black"
                                                          >
                                                            {index3 < 6 && (
                                                              <>
                                                                {facilityItemsLabels[parkFacility.facilityType]}
                                                                {index3 === 5
                                                                  ? " ..."
                                                                  : index3 ===
                                                                    r
                                                                      .parkFacilities
                                                                      .length -
                                                                    1
                                                                    ? ""
                                                                    : ", "}
                                                              </>
                                                            )}
                                                          </div>
                                                        )
                                                      )}
                                                      <br />
                                                    </>
                                                  )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                                <Card className="d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
                                  <CardContent className="park-card">
                                    <div className="row search-result-card no-gutters">
                                      <div className="col-12">
                                        <div className="row">
                                          {r.parkPhotos &&
                                            r.parkPhotos.length === 0 && (
                                              <div className="col-12 close-margin park-image-div-mobile park-image-logo-div">
                                                <img
                                                  alt="logo"
                                                  key={index}
                                                  className="search-result-logo-image"
                                                  src={parksLogo}
                                                />
                                              </div>
                                            )}
                                          {r.parkPhotos &&
                                            r.parkPhotos.length === 1 && (
                                              <div className="col-12 close-margin park-image-div-mobile">
                                                <img
                                                  alt="park"
                                                  key={index}
                                                  className="search-result-image"
                                                  src={r.parkPhotos[0]}
                                                />
                                              </div>
                                            )}
                                          {r.parkPhotos &&
                                            r.parkPhotos.length > 1 && (
                                              <div className="col-12 close-margin park-image-div-mobile">
                                                <Carousel
                                                  className="park-carousel-mobile"
                                                  autoPlay={false}
                                                  indicators={false}
                                                  navButtonsAlwaysVisible={true}
                                                  animation="fade"
                                                  timeout={200}
                                                >
                                                  {r.parkPhotos.map(
                                                    (item, index) => {
                                                      return (
                                                        <img
                                                          alt="park carousel"
                                                          key={index}
                                                          className="search-result-image"
                                                          src={`${item}`}
                                                        />
                                                      )
                                                    }
                                                  )}
                                                </Carousel>
                                              </div>
                                            )}

                                          <div className="col-12 p20t park-content-mobile">
                                            <div className="row">
                                              <div className="col-12 park-overview-content text-blue small-font">
                                                {r.isOpenToPublic && (
                                                  <div className="text-green font-weight-bold">
                                                    Open to public access
                                                  </div>
                                                )}
                                                {!r.isOpenToPublic && (
                                                  <div className="text-red font-weight-bold">
                                                    Closed public access
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            <Link
                                              href={`/${r.slug}`}
                                              className="p10t"
                                            >
                                              <h3 className="park-heading-text">
                                                {r.protectedAreaName}
                                              </h3>
                                            </Link>
                                          </div>
                                        </div>
                                        <div className="row pb20 p20l pr20">
                                          <div className="col-12 p0 align-center flex-display full-width">
                                            <div className="full-width">
                                              <Link
                                                href={`/${r.slug}`}
                                                className="park-quick-link link"
                                              >
                                                Visit Park Page
                                              </Link>
                                            </div>
                                            <div className="divider-div align-center">
                                              <Divider
                                                orientation="vertical"
                                                className="vertical-divider align-center"
                                              />
                                            </div>
                                            <div className="full-width">
                                              <Link
                                                onClick={handleOpenQuickView}
                                                className="park-quick-link link"
                                              >
                                                Quick View
                                              </Link>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </CardContent>
                                </Card>
                                <Dialog
                                  open={openQuickView}
                                  onClose={handleCloseQuickView}
                                  aria-labelledby="park-quick-view-dialog"
                                  className="park-quick-view-dialog"
                                  fullScreen
                                  fullWidth
                                  scroll="paper"
                                >
                                  <DialogContent className="park-quick-view-dialog-content">
                                    <div className="row search-result-card no-gutters">
                                      <div className="col-12">
                                        <div className="row">
                                          {r.parkPhotos &&
                                            r.parkPhotos.length === 0 && (
                                              <div className="col-12 close-margin park-image-div-mobile park-image-logo-div">
                                                <img
                                                  alt="logo"
                                                  key={index}
                                                  className="search-result-logo-image"
                                                  src={parksLogo}
                                                />
                                              </div>
                                            )}
                                          {r.parkPhotos &&
                                            r.parkPhotos.length === 1 && (
                                              <div className="col-12 close-margin park-image-div-mobile">
                                                <img
                                                  alt="park"
                                                  key={index}
                                                  className="search-result-image"
                                                  src={r.parkPhotos[0]}
                                                />
                                              </div>
                                            )}
                                          {r.parkPhotos &&
                                            r.parkPhotos.length > 1 && (
                                              <div className="col-12 close-margin park-image-div-mobile">
                                                <Carousel
                                                  className="park-carousel-mobile"
                                                  autoPlay={false}
                                                  indicators={false}
                                                  navButtonsAlwaysVisible={true}
                                                  animation="fade"
                                                  timeout={200}
                                                >
                                                  {r.parkPhotos.map(
                                                    (item, index) => {
                                                      return (
                                                        <img
                                                          alt="park carousel"
                                                          key={index}
                                                          className="search-result-image"
                                                          src={`${item}`}
                                                        />
                                                      )
                                                    }
                                                  )}
                                                </Carousel>
                                              </div>
                                            )}

                                          <div className="col-12 park-content-mobile p2030 container">
                                            <div className="row">
                                              <div className="col-12 park-overview-content text-blue small-font">
                                                {r.isOpenToPublic && (
                                                  <div className="text-green font-weight-bold">
                                                    Open to public access
                                                  </div>
                                                )}
                                                {!r.isOpenToPublic && (
                                                  <div className="text-red font-weight-bold">
                                                    Closed public access
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                            <Link
                                              href={`/${r.slug}`}
                                              className="p10t"
                                            >
                                              <h3 className="park-heading-text">
                                                {r.protectedAreaName}
                                              </h3>
                                            </Link>

                                            <div className="row p20t mr5">
                                              <div className="col-12">
                                                {r.advisories && r.advisories.length > 0 && r.advisories.map(
                                                  (a, index1) => (
                                                    // TODO Display all advisories when Event types are
                                                    // available in elastic search results based on severity
                                                    <div
                                                      key={index1}
                                                      className="flex-display"
                                                    >
                                                      {index1 === 0 && (
                                                        <>
                                                          <img
                                                            alt=""
                                                            className="search-result-icon"
                                                            src={redAlertIcon}
                                                          />
                                                          <div className="pl15 text-blue">
                                                            {a} (1)
                                                          </div>
                                                        </>
                                                      )}
                                                    </div>
                                                  )
                                                )}
                                              </div>
                                              <div className="col-12 p20t">
                                                {r.hasDayUsePass &&
                                                  r.hasReservations && (
                                                    <div className="flex-display">
                                                      <img
                                                        alt=""
                                                        className="search-result-icon"
                                                        src={dayUseIcon}
                                                      />
                                                      <div className="pl15 mtm7 text-blue">
                                                        Day use and camping{" "}
                                                        <br />
                                                        offered at this park
                                                      </div>
                                                    </div>
                                                  )}
                                              </div>
                                            </div>
                                            <div className="row p20t mr5">
                                              <div className="col-12">
                                                {r.parkActivities &&
                                                  r.parkActivities.length >
                                                  0 && (
                                                    <>
                                                      <div className="park-af-list pr3">
                                                        <b>Activities:</b>
                                                      </div>
                                                      {r.parkActivities.map(
                                                        (a, index2) => (
                                                          <div
                                                            key={index2}
                                                            className="park-af-list pr3 text-black"
                                                          >
                                                            {index2 < 11 && (
                                                              <>
                                                                {a}
                                                                {index2 === 10
                                                                  ? " ..."
                                                                  : index2 ===
                                                                    r
                                                                      .parkActivities
                                                                      .length -
                                                                    1
                                                                    ? ""
                                                                    : ", "}
                                                              </>
                                                            )}
                                                          </div>
                                                        )
                                                      )}
                                                      <br />
                                                    </>
                                                  )}
                                              </div>
                                              <div className="col-12 p20t">
                                                {r.parkFacilities &&
                                                  r.parkFacilities.length >
                                                  0 && (
                                                    <>
                                                      <div className="park-af-list pr3">
                                                        <b>Facilities:</b>
                                                      </div>
                                                      {r.parkFacilities.map(
                                                        (f, index3) => (
                                                          <div
                                                            key={index3}
                                                            className="park-af-list pr3 text-black"
                                                          >
                                                            {index3 < 6 && (
                                                              <>
                                                                {f}
                                                                {index3 === 5
                                                                  ? " ..."
                                                                  : index3 ===
                                                                    r
                                                                      .parkFacilities
                                                                      .length -
                                                                    1
                                                                    ? ""
                                                                    : ", "}
                                                              </>
                                                            )}
                                                          </div>
                                                        )
                                                      )}
                                                      <br />
                                                    </>
                                                  )}
                                              </div>
                                            </div>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                  </DialogContent>
                                  <DialogActions className="d-block p20 background-blue">
                                    <div className="row">
                                      <div className="col-12 p0 align-center flex-display full-width">
                                        <div className="full-width">
                                          <Link
                                            href={`/${r.slug}`}
                                            className="park-quick-link link-white"
                                          >
                                            Visit Park Page
                                          </Link>
                                        </div>
                                        <div className="divider-div align-center">
                                          <Divider
                                            orientation="vertical"
                                            className="vertical-divider align-center"
                                          />
                                        </div>
                                        <div className="full-width">
                                          <Link
                                            onClick={handleCloseQuickView}
                                            className="park-quick-link link-white"
                                          >
                                            Close Quick View
                                          </Link>
                                        </div>
                                      </div>
                                    </div>
                                  </DialogActions>
                                </Dialog>
                              </div>
                            ))}
                          <div className="small-flex-display p20t">
                            <div className="small-m-auto">
                              {searchResults.length > 0 && (
                                <>
                                  Showing{" "}
                                  {currentPage * itemsPerPage -
                                    itemsPerPage +
                                    1}{" "}
                                  -{" "}
                                  {currentPage * itemsPerPage > totalResults
                                    ? totalResults
                                    : currentPage * itemsPerPage}{" "}
                                  of {totalResults}
                                </>
                              )}
                              {searchResults.length === 0 && (
                                <>No parks found</>
                              )}
                            </div>
                          </div>
                          <div className="small-flex-display p20t">
                            <div className="p20t small-m-auto">
                              <Pagination
                                count={numberOfPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                size="large"
                                className="large-pagination"
                              />
                              <Pagination
                                count={numberOfPages}
                                page={currentPage}
                                onChange={handlePageChange}
                                size="small"
                                className="small-pagination"
                              />
                            </div>
                          </div>
                          <br />
                          <br />
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <SearchFilter
        data={{
          activityItems,
          facilityItems,
          quickSearchFilters,
          openFilter,
          setOpenFilter,
          quickSearch,
          selectedActivities,
          setSelectedActivities,
          selectedFacilities,
          setSelectedFacilities,
          setQuickSearch,
          searchText,
          setSearchText,
        }}
      />
      <Footer>{data.strapiWebsites.Footer}</Footer>
    </>
  )
}
