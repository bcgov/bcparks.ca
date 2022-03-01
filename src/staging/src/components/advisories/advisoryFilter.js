import React, { useState } from "react"
import { makeStyles } from "@material-ui/core/styles"

import {
  Box,
  Grid,
  Button,
  TextField,
  InputAdornment,
  Checkbox,
  FormControlLabel,
  NativeSelect
} from "@material-ui/core"

import SearchIcon from "@material-ui/icons/Search"


const useStyles = makeStyles(theme => ({
  searchBox: {
    marginRight: "10px",
    width: "100%"
  },
  typeSelect: {
    width: "100%",
    borderRadius: "4px",
    paddingLeft: "8px",
    border: "solid 1px #aaa",
    '&::before': {
      borderBottom:0
    }
  },
  filterElement: {
    [theme.breakpoints.up('sm')]: {
      marginRight: "4%",
    },
    [theme.breakpoints.down('sm')]: {
      marginBottom: "15px",
      marginRight: "10px",
      "& .MuiCheckbox-root": {
        marginRight: "0px",
        paddingRight: "5px"
      }      
    },
  },
  filterSearch: {
    [theme.breakpoints.down('sm')]: {
      width: "99%"
    },
    [theme.breakpoints.up('sm')]: {
      width: "25%"
    }
  },
  filterType: {
    [theme.breakpoints.down('sm')]: {
      width: "60%"
    },
    [theme.breakpoints.up('sm')]: {
      width: "15%"
    }
  },
  filterLabel: {
    fontWeight: "bold",
    fontSize: "1rem",
    lineHeight: "1.75rem",
    color:"#000",
    fontFamily: "unset",
    marginBottom: "0px",
  },
  filterBy: {
    [theme.breakpoints.up('sm')]: {
    display: 'inline-flex',
    marginRight: '15px',
    verticalAlign: 'middle',
    marginBottom: '10px',
    },
  }
}))

const AdvisoryFilter = ({ filterFunctions }) => { 

  const classes = useStyles()

  // Get parent's filter functions 
  const getSearchText = filterFunctions.getSearchText;
  const setSearchText = filterFunctions.setSearchText;
  const setFilter = filterFunctions.setFilter;
  const getFilter = filterFunctions.getFilter;
  const getType = filterFunctions.getType;
  const setType = filterFunctions.setType; 

  const [filterText, setFilterText] = useState(
    getSearchText() 
  )
  const [isParksFilter, setIsParksFilter] = useState(
    getFilter("parks")
  )
  const [isTypesFilter, setIsTypesFilter] = useState(
    getFilter("types")
  )
  const [isKeywordFilter, setIsKeywordsFilter] = useState(
    getFilter("keyword")
  )
  const [advisoryType, setAdvisoryType] = useState(
    getType()
  )


  // Local handlers, calls to parent methods
  // will trigger useEffect functions in parent
  const updateAdvisoriesSearchText = (str) => {
   setSearchText(str) 
  }
  const handleSearch = () => {
    setSearchText(filterText)
  }

  const handleTypeFilterChange = (str) => {
    // This changes the URL query str and causes the page to
    // rerender with the type changed
    let newLoc = "/alerts/?type=" + str;
    if (str !== "public") {
      newLoc += "s"; // add "s" to wildfire and flood
    }
    window.location = newLoc; // this will trigger a reload

    // NB - these lines are irrelevant as the above line
    // has triggered a reload - these are kept in order to 
    // remove react warnings
    setAdvisoryType(str);
    setType(str);
  }

  // Checkboxes
  const handleParksFilterChange = () => {
    setIsParksFilter(!isParksFilter)
    setFilter("parks", !isParksFilter)
  }
  const handleTypesFilterChange = () => {
    setIsTypesFilter(!isTypesFilter)
    setFilter("types", !isTypesFilter)
  }
  const handleKeywordsFilterChange = () => {
    setIsKeywordsFilter(!isKeywordFilter)
    setFilter("keywords", !isKeywordFilter)
  }


  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12} sm={5}>
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
            
        </Grid>
        <Grid item xs={7} sm={2}>
          <label htmlFor="advisory-type" className={classes.filterLabel}>
            Event type
          </label>
          <NativeSelect
            value={advisoryType}
            id="advisory-type"
            
            className={classes.typeSelect + " h50p"}
            variant="outlined"
            onChange={event => {
              handleTypeFilterChange(event.target.value)
            }}
            placeholder="Event type">
            <option value="public">All</option>
            <option value="wildfire">Wildfires</option>
            <option value="flood">Floods</option>
          </NativeSelect>
        </Grid>
        <Grid item xs={5} sm={1}>
          <label htmlFor="search-button" className={classes.filterLabel}>&nbsp;</label>
            <Button
              id="search-button"
              variant="contained"
              fullWidth
              onClick={() => {
                handleSearch()
              }}
              className="bcgov-normal-blue mobile-search-element-height h50p">
            Search
            </Button>
        </Grid>
      </Grid>

      <Box sx={{ marginTop: '10px' }}>
        <Box className={classes.filterBy}>
          Filter by:
        </Box>
        <FormControlLabel
          className={classes.filterElement + " " + (isKeywordFilter ? "text-light-blue no-wrap" : "no-wrap") }
            control={
              <Checkbox
                checked={isKeywordFilter}
                style={{ color: '#38598a'}}
                onChange={event => { handleKeywordsFilterChange() }}
                name="keywords"
              />
            }
            label="Keywords"
          />
        <FormControlLabel
          className={classes.filterElement + " " + (isParksFilter ? "text-light-blue no-wrap" : "no-wrap") }
            control={
              <Checkbox
                checked={isParksFilter}
                style={{ color: '#38598a'}}
                onChange={event => { handleParksFilterChange() }}
                name="parks"
              />
            }
            label="Park Names"
          />
          {advisoryType === 'public' && (
        <FormControlLabel
          className={classes.filterElement + " " + (isTypesFilter ? "text-light-blue no-wrap" : "no-wrap") }
              control={
                <Checkbox
                  checked={isTypesFilter}
                  style={{ color: '#38598a'}}
                  onChange={event => { handleTypesFilterChange() }}
                  name="types"
                />
              }
              label="Events"
            />
          )}

      </Box>

    </>
  )
}

export default AdvisoryFilter