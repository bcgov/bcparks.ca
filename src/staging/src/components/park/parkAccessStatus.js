import React from "react"
import { graphql, useStaticQuery } from "gatsby"
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

  const data = useStaticQuery(
    graphql`
      {
        allStrapiAccessStatuses {
          edges {
            node {
              id
              strapiId
              color
              accessStatus
              precedence
            }
          }
        }
      }
    `
  )

  const accessStatusList = data?.allStrapiAccessStatuses.edges;

  const classes = useStyles()
  let parkStatusIcon = blueStatusIcon
  let parkStatusText = "Open to public access"

  // unfortunately, incoming advisories from parks details and explore pages are structured differently.
  // we need to differentiate between the two structures. 

  let accessStatuses = [];

  for (let advisory of advisories) {
    if (advisory.accessStatus) {
      if (advisory.accessStatus.precedence) {
        // advisory is coming from parks details page
        accessStatuses.push({
          precedence: advisory.accessStatus.precedence,
          color: advisory.accessStatus.color,
          text: advisory.accessStatus.accessStatus,
        });
      } else {
        // advisory is coming from explore page
        // get accessStatus based on precedence
        let thisStatus = accessStatusList.find(status => {
          return status.node.strapiId === advisory.accessStatus;
        })
        if (!thisStatus || thisStatus.length === 0) {
          break;
        } else {
          accessStatuses.push({
            precedence: thisStatus[0].node.precedence,
            color: thisStatus[0].node.color,
            text: thisStatus[0].node.accessStatus,
          })
        }
      }
    }
  }

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
