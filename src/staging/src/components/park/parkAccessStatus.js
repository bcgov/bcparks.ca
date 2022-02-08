import React from "react"
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles"
import { Card, CardHeader, Avatar } from "@material-ui/core"

import blueStatusIcon from "../../images/park/blue-status-64.png"
import yellowStatusIcon from "../../images/park/yellow-status-64.png"
import redStatusIcon from "../../images/park/red-status-64.png"

const useStyles = makeStyles({
  card: {
    border: "none",
    boxShadow: "none",
    color: "#00008a",
  },
})

const ICONS = {
  "blue": blueStatusIcon,
  "yellow": yellowStatusIcon,
  "red": redStatusIcon,
}
export default function ParkAccessStatus({ advisories }) {
  const classes = useStyles()
  let parkStatusIcon = blueStatusIcon
  let parkStatusText = "Open to public access"

  const accessStatuses = advisories.filter(advisory => advisory.accessStatus).map(advisory => {
    return {
      precedence: advisory.accessStatus.precedence,
      color: advisory.accessStatus.color,
      text: advisory.accessStatus.accessStatus,
    }
  })
  accessStatuses.sort((a, b) => {
    return a.precedence - b.precedence
  })

  if (accessStatuses.length > 0 && typeof ICONS[accessStatuses[0].color] !== "undefined") {
    parkStatusIcon = ICONS[accessStatuses[0].color]
    parkStatusText = accessStatuses[0].text
  }

  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          className="access-icon"
          avatar={
            <Avatar
              variant="square"
              src={parkStatusIcon}
              aria-label="park access status"
              className="park-overview-icon"
            />
          }
          title={parkStatusText}
        />
      </Card>
    </>
  )
}

ParkAccessStatus.propTypes = {
  advisories: PropTypes.array,
};
