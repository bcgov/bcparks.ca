import React, { useState } from "react"
import Toast from "react-bootstrap/Toast"

const PermissionToast = () => {
  const [isShow, setIsShow] = useState(true)
  const toggleShow = () => setIsShow(false)

  return (
    <div
      aria-live="polite"
      aria-atomic="true"
    >
      <Toast show={isShow} onClose={toggleShow}>
        <Toast.Header>
          <strong className="mr-auto">
            Location permission blocked
          </strong>
        </Toast.Header>
        <Toast.Body>
          B.C. parks does not have permission to show your location
        </Toast.Body>
      </Toast>
    </div>
  )
}

export default PermissionToast