import React from "react"
import Toast from "react-bootstrap/Toast"

const PermissionToast = ({ isToastOpen, setIsToastOpen, permissionDeniedCount }) => {
  const toggleShow = () => {
    setIsToastOpen(false)
  }

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
    >
      <Toast show={isToastOpen} onClose={toggleShow}>
        <Toast.Header>
          <strong className="me-auto">
            Location permission blocked
          </strong>
        </Toast.Header>
        <Toast.Body>
          B.C. parks does not have permission to show your location.
        </Toast.Body>
        {permissionDeniedCount > 1 &&
          <Toast.Body>
            Please update your location permission and try again.
          </Toast.Body>
        }
      </Toast>
    </div>
  )
}

export default PermissionToast