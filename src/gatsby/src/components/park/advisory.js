import React from "react"
import PropTypes from "prop-types";
import { Link } from "gatsby"
import { Avatar, Card, CardHeader } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import blueAlertIcon from "../../images/park/blue-alert-64.png"
import redAlertIcon from "../../images/park/red-alert-64.png"
import yellowAlertIcon from "../../images/park/yellow-alert-64.png"

const useStyles = makeStyles({
  card: {
    border: "none",
    boxShadow: "none",
  },
})

export default function Advisory({ advisories }) {
  const classes = useStyles()

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
    <Card className={classes.card}>
      <CardHeader
        avatar={
          <Avatar
            variant="square"
            src={alertIcon}
            aria-label="park access status"
            className="park-overview-icon"
            alt=""
          />
        }
        title={
          <>
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
          </>
        }
      />
    </Card>
  )
}

Advisory.propTypes = {
  advisories: PropTypes.array.isRequired,
};
