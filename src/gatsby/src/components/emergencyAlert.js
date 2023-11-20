import React, { useState } from "react"
import { useStaticQuery, graphql } from "gatsby"
import ErrorIcon from '@mui/icons-material/Error'
import CloseIcon from '@mui/icons-material/Close'

const EmergencyAlert = () => {
  const data = useStaticQuery(graphql`
    query {
      allStrapiEmergencyAlert(
        filter: {isActive: {eq: true}}
      ) {
        nodes {
          colour
          description
          links {
            linkText
            url
          }
        }
      }
    }
  `)
  const alerts = data?.allStrapiEmergencyAlert?.nodes || []
  // display only one alert even if there are multiple active alerts
  const alert = alerts[0]
  const [show, setShow] = useState(true)

  const handleClick = () => {
    setShow(false)
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick()
    }
  }

  return (
    show && (
      <div className={`emergency-alert alert-bg-${alert.colour.toLowerCase()}`}>
        <div className="alert-container">
          <ErrorIcon className="warning-icon" />
          <p>
            {alert.description}
            {alert.links.map((l, index) => (
              <span key={index}>
                <span className="partition">|</span>
                <a href={l.url}>{l.linkText}</a>
              </span>
            ))}
          </p>
          <button
            tabIndex={0}
            onClick={handleClick}
            onKeyDown={handleKeyDown}
            className="btn btn-link"
          >
            <CloseIcon className="close-icon" />
          </button>
        </div>
      </div>
    )
  )
}

export default EmergencyAlert