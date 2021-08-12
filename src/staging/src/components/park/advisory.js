import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, Avatar, Card, CardHeader } from "@material-ui/core"
import redAlertIcon from "../../images/park/red-alert-64.png"
import blueAlertIcon from "../../images/park/blue-alert-64.png"
import yellowAlertIcon from "../../images/park/yellow-alert-64.png"
import { Link } from "gatsby"

const useStyles = makeStyles({
  card: {
    border: "none",
    boxShadow: "none",
    backgroundColor: "#e1ecf4",
  },
  topGrid: {
    backgroundColor: "#e1ecf4",
  },
})

export default function Advisory({ data }) {
  const classes = useStyles()

  if (!data || data.nodes.length === 0) return null
  const alertLevels = data.nodes.map(s => s.urgency.sequence)
  const maxAlertLevel = Math.max(...alertLevels)
  let alertIcon = blueAlertIcon
  if (maxAlertLevel === 3) alertIcon = redAlertIcon
  if (maxAlertLevel === 2) alertIcon = yellowAlertIcon
  return (
    <>
      <Grid item xs={12} sm={6} md={4} className={classes.topGrid}>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar
                variant="square"
                src={alertIcon}
                aria-label="park access status"
              />
            }
            title={
              <Link to="#park-advisory-details-container">
                {`Alerts currently in effect (${data.nodes.length})`}
              </Link>
            }
          />
        </Card>
      </Grid>
    </>
  )
}
