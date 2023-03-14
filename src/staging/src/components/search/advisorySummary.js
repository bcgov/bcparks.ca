import React from "react"
import PropTypes from "prop-types"
import { graphql, useStaticQuery } from "gatsby"

import blueAlertIcon from "../../images/park/blue-alert-32.png"
import redAlertIcon from "../../images/park/red-alert-32.png"
import yellowAlertIcon from "../../images/park/yellow-alert-32.png"

const AdvisorySummary = ({ advisories }) => {
  const { urgencies } = useStaticQuery(
    graphql`
      query urgencies {
        urgencies: allStrapiUrgency(sort: { fields: sequence, order: DESC }) {
          nodes {
            strapi_id
            color
            code
            sequence
          }
        }
      }
    `
  )
  if (!advisories || advisories.length === 0) {
    return null
  }

  const advisoryUrgencies = advisories
    .map(advisory => {
      return urgencies.nodes.find(
        urgency => urgency.strapi_id === advisory.urgency
      )
    })
    .filter(urgency => urgency !== null)
  // Sort by urgency sequence descending (highest first)
  advisoryUrgencies.sort((a, b) => b.sequence - a.sequence)

  const maxUrgency = advisoryUrgencies.length > 0 && advisoryUrgencies[0]
  let icon = null

  if (maxUrgency) {
    switch (maxUrgency.color) {
      case "blue":
        icon = blueAlertIcon
        break
      case "red":
        icon = redAlertIcon
        break
      case "yellow":
        icon = yellowAlertIcon
        break
      default:
        throw new Error(`Unknown urgency color: ${maxUrgency.color}`)
    }
  }

  return (
    <div className="flex-display">
      {icon && <img alt="" className="search-result-icon" src={icon} />}
      <div className="pl-2 pb-3 text-blue">
        Alerts currently in effect ({advisories.length})
      </div>
    </div>
  )
}

AdvisorySummary.propTypes = {
  advisories: PropTypes.arrayOf(
    PropTypes.shape({
      urgency: PropTypes.number,
    })
  ),
}

export default AdvisorySummary
