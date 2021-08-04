import React, { useState } from "react"
import PropTypes from "prop-types"
import SearchIcon from "@material-ui/icons/Search"
import {
  TextField,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  Button,
  Link,
  Checkbox,
  FormGroup,
  FormControlLabel,
  Divider,
  Chip,
} from "@material-ui/core"
import Select from "react-select"
import "../styles/search.scss"
import HighlightOffOutlinedIcon from "@material-ui/icons/HighlightOffOutlined"

const MainSearch = ({ data: { activities, facilities } }) => {
  const [openFilter, setOpenFilter] = useState(false)
  const [quickSearch, setQuickSearch] = useState({
    camping: false,
    dogFriendly: false,
    wheelchair: false,
    marine: false,
    ecoReserve: false,
    electricalHookup: false,
  })
  const [selectedActivities, setSelectedActivities] = useState([])
  const [selectedFacilities, setSelectedFacilities] = useState([])

  const {
    camping,
    dogFriendly,
    wheelchair,
    marine,
    ecoReserve,
    electricalHookup,
  } = quickSearch

  const activityItems = activities.map(a => ({
    label: a.activityName,
    value: a.activityNumber,
  }))

  const facilityItems = facilities.map(f => ({
    label: f.facilityName,
    value: f.facilityNumber,
  }))

  const handleClickOpenFilter = () => {
    setOpenFilter(true)
  }

  const handleCloseFilter = () => {
    setOpenFilter(false)
  }

  const handleQuickSearchChange = event => {
    setQuickSearch({
      ...quickSearch,
      [event.target.name]: event.target.checked,
    })
  }

  const handleActivityDelete = chipToDelete => () => {
    setSelectedActivities(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
  }

  const handleFacilityDelete = chipToDelete => () => {
    setSelectedFacilities(chips =>
      chips.filter(chip => chip.value !== chipToDelete.value)
    )
  }

  return (
    <div className="park-search-text-container">
      <div className="row">
        <div className="col-12">
          <TextField
            id="park-search-text"
            variant="outlined"
            placeholder="Search by park name, location, activity..."
            className="park-search-text-box"
          />
          <Fab className="search-icon-fab" aria-label="search">
            <SearchIcon fontSize="large" className="search-icon" />
          </Fab>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <Link
            component="button"
            className="park-search-filter"
            onClick={handleClickOpenFilter}
          >
            Filters
          </Link>
        </div>
      </div>
      <Dialog
        open={openFilter}
        onClose={handleCloseFilter}
        aria-labelledby="park-filter-dialog"
        className="park-filter-dialog"
      >
        <DialogContent className="park-filter-dialog-content">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <TextField
                  autoFocus
                  margin="dense"
                  id="park-filter-text"
                  className="park-filter-text"
                  placeholder="Search by park name, location"
                  fullWidth
                  variant="outlined"
                />
              </div>
            </div>
            <div className="row p20t">
              <div className="col-6">
                <FormGroup className="p30l">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={camping}
                        onChange={handleQuickSearchChange}
                        name="camping"
                      />
                    }
                    label="Camping"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={dogFriendly}
                        onChange={handleQuickSearchChange}
                        name="dogFriendly"
                      />
                    }
                    label="Dog friendly"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={wheelchair}
                        onChange={handleQuickSearchChange}
                        name="wheelchair"
                      />
                    }
                    label="Wheelchair accessible"
                  />
                </FormGroup>
              </div>
              <div className="col-6">
                <FormGroup className="p30l">
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={marine}
                        onChange={handleQuickSearchChange}
                        name="marine"
                      />
                    }
                    label="Marine park"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={ecoReserve}
                        onChange={handleQuickSearchChange}
                        name="ecoReserve"
                      />
                    }
                    label="Ecological reserve"
                  />
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={electricalHookup}
                        onChange={handleQuickSearchChange}
                        name="electricalHookup"
                      />
                    }
                    label="Electrical hookups"
                  />
                </FormGroup>
              </div>
            </div>
            <Divider className="m20t" />
            <div className="row p20t">
              <div className="col-12">
                <div className="p20l park-select-label">Activities</div>
                <Select
                  id="activities-select"
                  options={activityItems}
                  value={selectedActivities}
                  controlShouldRenderValue={false}
                  isClearable={false}
                  isMulti
                  onChange={e => {
                    setSelectedActivities(e)
                  }}
                  className="park-filter-select"
                  variant="outlined"
                  placeholder="Add an activity from this list"
                  styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={document.body}
                />
              </div>
            </div>
            <div className="row p20t">
              <div className="col-12">
                {selectedActivities.map(a => (
                  <Chip
                    key={a.value}
                    label={a.label}
                    onDelete={handleActivityDelete(a)}
                    variant="outlined"
                    className="park-filter-chip"
                    deleteIcon={<HighlightOffOutlinedIcon />}
                  />
                ))}
              </div>
            </div>
            <Divider className="m20t" />
            <div className="row p20t">
              <div className="col-12">
                <div className="p20l park-select-label">Facilities</div>
                <Select
                  id="facilities-select"
                  options={facilityItems}
                  value={selectedFacilities}
                  controlShouldRenderValue={false}
                  isClearable={false}
                  isMulti
                  onChange={e => {
                    setSelectedFacilities(e)
                  }}
                  className="park-filter-select"
                  variant="outlined"
                  placeholder="Add a facility from this list"
                  styles={{ menuPortal: base => ({ ...base, zIndex: 9999 }) }}
                  menuPortalTarget={document.body}
                />
              </div>
            </div>
            <div className="row p20t">
              <div className="col-12">
                {selectedFacilities.map(f => (
                  <Chip
                    key={f.value}
                    label={f.label}
                    onDelete={handleFacilityDelete(f)}
                    variant="outlined"
                    className="park-filter-chip"
                    deleteIcon={<HighlightOffOutlinedIcon />}
                  />
                ))}
              </div>
            </div>
            <Divider className="m20t" />
          </div>
        </DialogContent>
        <DialogActions>
          <div className="container">
            <div className="row">
              <div className="col-12 p30">
                <Button
                  variant="contained"
                  onClick={handleCloseFilter}
                  className="bcgov-button bcgov-normal-blue"
                >
                  Search
                </Button>
              </div>
            </div>
          </div>
        </DialogActions>
      </Dialog>
    </div>
  )
}

MainSearch.propTypes = {
  data: PropTypes.shape({
    activities: PropTypes.array.isRequired,
    facilities: PropTypes.array.isRequired,
  }),
}

export default MainSearch
