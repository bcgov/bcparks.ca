import React from "react"
import PropTypes from "prop-types"
import { graphql, useStaticQuery } from "gatsby"
import { Card, CardHeader, Avatar } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import blueStatusIcon from "../../images/park/blue-status-64.png"
import redStatusIcon from "../../images/park/red-status-64.png"
import yellowStatusIcon from "../../images/park/yellow-status-64.png"

const useStyles = makeStyles({
  card: {
    border: "none",
    boxShadow: "none",
    color: "#00008a",
  },
})

const ICONS = {
  blue: blueStatusIcon,
  yellow: yellowStatusIcon,
  red: redStatusIcon,
}

function ParkAccessFromAdvisories(advisories) {
  const data = useStaticQuery(
    graphql`
      {
        allStrapiAccessStatus {
          nodes {
            id
            strapi_id
            color
            accessStatus
            precedence
          }
        }
      }
    `
  )

  let accessStatuses = []
  const accessStatusList = data?.allStrapiAccessStatus.nodes

  let parkStatusIcon = blueStatusIcon
  let parkStatusText = "Open to public access"
  let parkStatusColor = "blue"

  for (let advisory of advisories) {
    if (advisory.accessStatus) {
      if (advisory.accessStatus.precedence) {
        // advisory is coming from parks details page
        accessStatuses.push({
          precedence: advisory.accessStatus.precedence,
          color: advisory.accessStatus.color,
          text: advisory.accessStatus.accessStatus,
        })
      } else {
        // advisory is coming from explore page
        // get accessStatus based on precedence
        let thisStatus = accessStatusList.find(status => {
          return status.strapi_id === advisory.accessStatus
        })
        if (!thisStatus) {
          break
        } else {
          accessStatuses.push({
            precedence: thisStatus.precedence,
            color: thisStatus.color,
            text: thisStatus.accessStatus,
          })
        }
      }
    }
  }

  accessStatuses.sort((a, b) => {
    return a.precedence - b.precedence
  })

  if (
    accessStatuses.length > 0 &&
    typeof ICONS[accessStatuses[0].color] !== "undefined"
  ) {
    parkStatusIcon = ICONS[accessStatuses[0].color]
    parkStatusText = accessStatuses[0].text
    parkStatusColor = accessStatuses[0].color
  }

  return {
    parkStatusIcon: parkStatusIcon,
    parkStatusText: parkStatusText,
    parkStatusColor: parkStatusColor,
  }
}
export { ParkAccessFromAdvisories }

export default function ParkAccessStatus({ advisories }) {
  const classes = useStyles()
  const {
    parkStatusIcon,
    parkStatusText,
  } = ParkAccessFromAdvisories(advisories)

  // unfortunately, incoming advisories from parks details and explore pages are structured differently.
  // we need to differentiate between the two structures.

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
              alt=""
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
}
