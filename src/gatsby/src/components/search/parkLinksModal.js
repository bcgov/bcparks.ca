import React from "react"
import { Link } from "gatsby"
import PropTypes from "prop-types"
import { Modal } from "react-bootstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faArrowUpRightFromSquare } from "@fortawesome/free-solid-svg-icons"
import { mapUrl } from "../../utils/constants"

import "../../styles/search.scss"

const ParkLinksModal = ({ data: { openModal, setOpenModal } }) => {
  const handleCloseModal = () => {
    setOpenModal(false)
  }

  return (
    <Modal
      show={openModal}
      onHide={handleCloseModal}
      aria-labelledby="park-links-modal"
      className="park-links-modal d-block d-lg-none"
      scrollable
    >
      <Modal.Body className="park-links-modal-content">
        <h2>More ways to find a park</h2>
        <Link
          className="btn btn-secondary link-button"
          to="/find-a-park/a-z-list">
          A–Z park list
        </Link>
        <a
          className="btn btn-secondary link-button"
          href={mapUrl}
        >
          Map
          <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="link-icon" />
        </a>
      </Modal.Body>
      <Modal.Footer>
        <button
          aria-label="Cancel"
          onClick={() => {
            handleCloseModal()
          }}
          className="btn btn-secondary w-100"
        >
          Cancel
        </button>
      </Modal.Footer>
    </Modal>
  );
}

ParkLinksModal.propTypes = {
  data: PropTypes.shape({
    openModal: PropTypes.bool.isRequired,
    setOpenModal: PropTypes.func.isRequired,
  }),
}

export default ParkLinksModal
