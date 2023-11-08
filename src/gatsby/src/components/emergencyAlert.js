import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import HtmlContent from "./park/htmlContent"

const EmergencyAlert = () => {
  const data = useStaticQuery(graphql`
    query {
      allStrapiEmergencyAlert(
        filter: {isActive: {eq: true}}
      ) {
        nodes {
          colour
          description {
            data {
              description
            }
          }
          link {
            linkText
            url
          }
        }
      }
    }
  `)
  const alerts = data?.allStrapiEmergencyAlert?.nodes || []

  return (
    alerts.map((alert, index) => (
      <div key={index} className={`emergency-alert alert-bg-${alert.colour.toLowerCase()}`}>
        <div className="alert-container">
          <HtmlContent>{alert.description.data.description}</HtmlContent>
          {alert.link.map((l, index) => (
            <span key={index}>
              |<a href={l.url}>{l.linkText}</a>
            </span>
          ))}
        </div>
      </div>
    ))
  )
}

export default EmergencyAlert