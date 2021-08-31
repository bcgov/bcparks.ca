import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Card, CardHeader, Avatar } from "@material-ui/core"

import blueStatusIcon from "../../images/park/blue-status-64.png"
import yellowStatusIcon from "../../images/park/yellow-status-64.png"
import redStatusIcon from "../../images/park/red-status-64.png"

const useStyles = makeStyles({
  card: {
    border: "none",
    boxShadow: "none",
  },
})

export default function ParkAccessStatus({ data }) {
  const classes = useStyles()
  let parkStatusIcon = yellowStatusIcon
  if (data.toLowerCase().includes("clos")) parkStatusIcon = redStatusIcon
  if (data.toLowerCase().includes("open")) parkStatusIcon = blueStatusIcon

  return (
    <>
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar
              variant="square"
              src={parkStatusIcon}
              aria-label="park access status"
            />
          }
          title={data}
        />
      </Card>
    </>
  )
}
