import React, { useState } from "react"
import PropTypes from "prop-types"
import SearchIcon from "@material-ui/icons/Search"
import {
  TextField,
  Fab,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  Link,
} from "@material-ui/core"

const MainSearch = () => {
  const [open, setOpen] = useState(false)

  const handleClickOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
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
          <Fab className="search-icon-fab" size="large" aria-label="search">
            <SearchIcon fontSize="large" className="search-icon" />
          </Fab>
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <Link
            component="button"
            className="park-search-filter"
            onClick={handleClickOpen}
          >
            Filters
          </Link>
        </div>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="park-filter-dialog"
      >
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="park-filter-text"
            placeholder="Search by park name, location"
            fullWidth
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Search
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

MainSearch.propTypes = {}

MainSearch.defaultProps = {}

export default MainSearch
