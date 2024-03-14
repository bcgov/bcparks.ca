import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import {
  Dialog,
  DialogContent,
  DialogActions,
} from "@mui/material"
import OpenInNewIcon from '@mui/icons-material/OpenInNew'

import "../../styles/search.scss"

const ParkLinksModal = ({ data: { openModal, setOpenModal } }) => {
  const handleCloseModal = () => {
    setOpenModal(false)
  }

  return (
    <Dialog
      open={openModal}
      onClose={handleCloseModal}
      aria-labelledby="park-links-modal"
      className="park-links-modal"
      scroll="paper"
    >
      <DialogContent className="container">
        <h3 className="subtitle">More ways to find a park</h3>
        <Link
          className="btn btn-secondary link-button"
          to="/find-a-park/a-z-list">
          A–Z park list
        </Link>
        <a
          className="btn btn-secondary link-button"
          href="https://governmentofbc.maps.arcgis.com/apps/webappviewer/index.html?id=077ef73a1eae4ca88f2bafbb831215af&query=British_Columbia_Parks_Ecological_Reserves_and_Protected_Areas_8747,ORCS_PRIMARY,0000"
        >
          Map
          <OpenInNewIcon />
        </a>
      </DialogContent>
      <DialogActions className="container">
        <button
          aria-label="Cancel"
          onClick={() => {
            handleCloseModal()
          }}
          className="btn btn-secondary w-100"
        >
          Cancel
        </button>
      </DialogActions>
    </Dialog>
  );
}

ParkLinksModal.propTypes = {
  data: PropTypes.shape({
    openModal: PropTypes.bool.isRequired,
    setOpenModal: PropTypes.func.isRequired,
  }),
}

export default ParkLinksModal
