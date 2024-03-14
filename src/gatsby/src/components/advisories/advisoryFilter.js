import React, { useState } from "react"
import { styled } from '@mui/material/styles';
import {
  Box,
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel,
} from "@mui/material"
import Autocomplete from '@mui/material/Autocomplete'
import SearchIcon from "@mui/icons-material/Search"

import { getAdvisoryTypeFromUrl } from "../../utils/advisoryHelper";
import "../../styles/advisories/advisoryFilter.scss"

const PREFIX = 'AdvisoryFilter';

const classes = {
  searchBox: `${PREFIX}-searchBox`,
  selectEndAdornment: `${PREFIX}-selectEndAdornment`,
  filterElement: `${PREFIX}-filterElement`,
  filterSearch: `${PREFIX}-filterSearch`,
  filterType: `${PREFIX}-filterType`,
  filterLabel: `${PREFIX}-filterLabel`,
  filterBy: `${PREFIX}-filterBy`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.searchBox}`]: {
    marginRight: "10px",
    width: "100%",
  },
  [`& .${classes.selectEndAdornment}`]: {
    top: 0
  },
  [`& .${classes.filterElement}`]: {
    [theme.breakpoints.up("sm")]: {
      marginRight: "4%",
    },
    [theme.breakpoints.down("sm")]: {
      marginBottom: "15px",
      marginLeft: "10px",
      "& .MuiCheckbox-root": {
        marginRight: "0px",
        paddingRight: "5px",
      },
    },
  },
  [`& .${classes.filterSearch}`]: {
    [theme.breakpoints.down("sm")]: {
      width: "99%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "25%",
    },
  },
  [`& .${classes.filterType}`]: {
    [theme.breakpoints.down("sm")]: {
      width: "60%",
    },
    [theme.breakpoints.up("sm")]: {
      width: "15%",
    },
  },
  [`& .${classes.filterLabel}`]: {
    fontWeight: "bold",
    fontSize: "1rem",
    lineHeight: "1.75rem",
    color: "#1a1a1a",
    fontFamily: "unset",
    marginBottom: "0px",
  },
  [`& .${classes.filterBy}`]: {
    [theme.breakpoints.up("sm")]: {
      display: "inline-flex",
      marginRight: "15px",
      verticalAlign: "middle",
      marginBottom: "10px",
    },
  }
}));

const AdvisoryFilter = ({
  eventTypes = [],
  defaultEventType = { label: getAdvisoryTypeFromUrl() },
  filterFunctions
}) => {

  // Get parent's filter functions
  const getSearchText = filterFunctions.getSearchText
  const setSearchText = filterFunctions.setSearchText
  const setFilter = filterFunctions.setFilter
  const getFilter = filterFunctions.getFilter
  const getType = filterFunctions.getType
  const setType = filterFunctions.setType

  const [filterText, setFilterText] = useState(getSearchText())
  const [isParksFilter, setIsParksFilter] = useState(getFilter("parks"))
  const [isKeywordFilter, setIsKeywordsFilter] = useState(getFilter("keyword"))

  // Local handlers, calls to parent methods
  // will trigger useEffect functions in parent
  const updateAdvisoriesSearchText = str => {
    setSearchText(str)
  }
  const handleSearch = () => {
    setSearchText(filterText)
  }

  const handleTypeFilterChange = advisoryType => {
    // This changes the URL query str and causes the page to
    // rerender with the type changed
    setType(advisoryType)
    // navigate(`/active-advisories/?type=${advisoryType}`)
  }

  // Checkboxes
  const handleParksFilterChange = () => {
    setIsParksFilter(!isParksFilter)
    setFilter("parks", !isParksFilter)
  }
  const handleKeywordsFilterChange = () => {
    setIsKeywordsFilter(!isKeywordFilter)
    setFilter("keywords", !isKeywordFilter)
  }

  const getEventType = () => {
    return eventTypes.find((o) => o.value === getType()) || defaultEventType
  }


  return (
    <Root className="advisory-filter-container">
      <div className="row">
        <div className="col-12 col-md-6">
          <label htmlFor="advisory-search-text" className={classes.filterLabel}>
            Search
          </label>
          <TextField
            id="advisory-search-text"
            variant="outlined"
            placeholder="Search"
            className={classes.searchBox + " h50p"}
            value={filterText}
            onChange={event => {
              setFilterText(event.target.value)
            }}
            onKeyPress={ev => {
              if (ev.key === "Enter") {
                updateAdvisoriesSearchText(filterText)
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
        <div className="col-7 col-md-4">
          <label htmlFor="advisory-type" className={classes.filterLabel}>
            Event
          </label>
          <Autocomplete
            id="advisory-type"
            aria-label="advisory-type"
            defaultValue={defaultEventType}
            value={getEventType()}
            classes={{
              endAdornment: classes.selectEndAdornment,
            }}
            className={"h50p"}
            options={eventTypes}
            getOptionLabel={(option) => option.label}
            onChange={(event, obj) => {
                handleTypeFilterChange(obj ? obj.value : defaultEventType.value)
              }
            }
            renderInput={(params) =>
              <TextField
                {...params}
                variant="outlined"
                placeholder={defaultEventType.label}
              />
            }
          />
        </div>
        <div className="col-5 col-md-2">
          <label htmlFor="search-button" className={classes.filterLabel}>
            <span className="sr-only">Search</span> &nbsp;
          </label>
          <button
            id="search-button"
            onClick={() => {
              handleSearch()
            }}
            className="btn btn-primary h50p w-100"
          >
            Search
          </button>
        </div>
      </div>

      <Box sx={{ marginTop: "10px" }}>
        <Box className={classes.filterBy}>
          <b>Filters</b>
        </Box>
        <FormControlLabel
          className={
            classes.filterElement +
            " " +
            (isKeywordFilter ? "text-light-blue no-wrap" : "no-wrap")
          }
          control={
            <Checkbox
              checked={isKeywordFilter}
              style={{ color: "#38598a" }}
              onChange={event => {
                handleKeywordsFilterChange()
              }}
              name="keywords"
            />
          }
          label="Keywords"
        />
        <FormControlLabel
          className={
            classes.filterElement +
            " " +
            (isParksFilter ? "text-light-blue no-wrap" : "no-wrap")
          }
          control={
            <Checkbox
              checked={isParksFilter}
              style={{ color: "#38598a" }}
              onChange={event => {
                handleParksFilterChange()
              }}
              name="parks"
            />
          }
          label="Park names"
        />
      </Box>
    </Root>
  );
}

export default AdvisoryFilter
