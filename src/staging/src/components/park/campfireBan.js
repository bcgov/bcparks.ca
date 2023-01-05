import React from "react"
import { Grid, Card, CardHeader, Avatar } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import campfireBanIcon from "../../images/park/fire-ban.png"

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

export default function CampfireBan({ data }) {
  const classes = useStyles()
  const { hasCampfireBan, hasSmokingBan } = data

  let fireBans = []
  let title = null
  if (hasCampfireBan === "Y") fireBans.push("Campfire")
  if (hasSmokingBan === "Y") fireBans.push("Smoking")
  if (hasCampfireBan === "Y" || hasSmokingBan === "Y")
    title = `${fireBans.join(" and ")} ban in effect`

  if (!title) return null

  return (
    <>
      <Grid container item xs={12} sm={6} md={4} className={classes.topGrid}>
        <Card className={classes.card}>
          {title && (
            <CardHeader
              avatar={
                <Avatar
                  variant="square"
                  src={campfireBanIcon}
                  aria-label={title}
                  alt=""
                />
              }
              title={title}
            />
          )}
        </Card>
      </Grid>
    </>
  )
}
