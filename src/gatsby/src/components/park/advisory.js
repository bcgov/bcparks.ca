import React from "react"
import PropTypes from "prop-types";
import { Link } from "gatsby"

import blueAlertIcon from "../../images/park/blue-alert-64.png"
import redAlertIcon from "../../images/park/red-alert-64.png"
import yellowAlertIcon from "../../images/park/yellow-alert-64.png"


export default function Advisory({ advisories }) {
  let textMap = []

  let alertIcon = blueAlertIcon
  if (advisories.length > 0) {
    const alertLevels = advisories.map(advisory => advisory.urgency.sequence)
    const maxAlertLevel = Math.max(...alertLevels)
    if (maxAlertLevel === 3) alertIcon = redAlertIcon
    if (maxAlertLevel === 2) alertIcon = yellowAlertIcon
    const highAlertGroup = advisories.filter(
      advisory => advisory.urgency.sequence === maxAlertLevel
    )
    // sort by precedence (lower number = higher importance)
    highAlertGroup.sort(
      (a, b) => (a.eventType?.precedence || 9999) - (b.eventType?.precedence || 9999)
    );
    const advisoryText = []
    const advisoryTextCounts = {}
    highAlertGroup.forEach(advisory => {
      if (advisory.eventType) {
        if (!advisoryText.includes(advisory.eventType.eventType)) {
          advisoryText.push(advisory.eventType.eventType)
          advisoryTextCounts[advisory.eventType.eventType] = 1
        } else {
          advisoryTextCounts[advisory.eventType.eventType] += 1
        }
      }
    })

    textMap = advisoryText.map(
      text => text + " (" + advisoryTextCounts[text] + ")"
    )
  }

  return (
    <>
      <div>
        <img src={alertIcon} alt="" className="mr-1" />
      </div>
      <div>
      {textMap.length === 0 && (
              <Link to="#park-advisory-details-container">
                There are no reported advisories for this park
              </Link>
            )}
            {textMap.length > 0 && (
              <>
                {textMap.map((text, index) => (
                  <div key={index}>
                    {index < 2 && (
                      <Link to="#park-advisory-details-container">{text}</Link>
                    )}
                  </div>
                ))}
              </>
            )}
      </div>
    </>
  );
}

Advisory.propTypes = {
  advisories: PropTypes.array.isRequired,
};
