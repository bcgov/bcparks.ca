import React from "react"
import { Card, CardHeader, Avatar } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import campfireBanIcon from "../../images/park/campfire-ban-48.png"

const useStyles = makeStyles({
  card: {
    border: "none",
    boxShadow: "none",
  },
})

export default function CampfireBan() {
  const classes = useStyles()

  return (
    <Card className={classes.card}>
      <CardHeader
        className="access-icon"
        avatar={
          <Avatar
            variant="square"
            src={campfireBanIcon}
            aria-label="no campfire"
            className="park-overview-icon"
            alt=""
          />
        }
        title="No campfires"
      />
    </Card>
  )
}
