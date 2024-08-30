import React, { useState, useEffect } from "react"
import { useStaticQuery, graphql } from "gatsby"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faCircleExclamation, faXmark } from "@fortawesome/free-solid-svg-icons"
import "../styles/alert.scss"

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
  let characterCount = 0
  // count how many characters are in alert 
  if (alert) {
    const descriptionCount = alert.description.length
    let linkTextCount = 0
    alert.links?.map(link =>
      linkTextCount += link.linkText.length
    )
    characterCount = descriptionCount + linkTextCount
  }
  const [show, setShow] = useState(false)

  const handleClick = () => {
    setShow(false)
    sessionStorage.setItem("alert", "false")
  }
  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      handleClick()
    }
  }

  useEffect(() => {
    if (typeof window !== "undefined" && window.sessionStorage) {
      const storedAlertValue = sessionStorage.getItem("alert")
      setShow(storedAlertValue !== "false")
    } else {
      setShow(true)
    }
  }, [])

  return (
    alerts.length > 0 && show && (
      <div
        className={`emergency-alert alert-bg-${alert.colour.toLowerCase()}`}
        role="alert"
        aria-live="assertive"
      >
        <div className={`alert-container has-more-characters--${characterCount > 110}`}>
          <FontAwesomeIcon icon={faCircleExclamation} className="warning-icon" aria-hidden="true"/>
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
            aria-label="Close urgent alert"
          >
            <FontAwesomeIcon icon={faXmark} className="close-icon" />
          </button>
        </div>
      </div>
    )
  )
}

export default EmergencyAlert