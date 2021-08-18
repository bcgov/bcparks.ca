import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, Card, CardHeader, Avatar } from "@material-ui/core"
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

  return (
    <>
      <Grid container item xs={12} sm={6} md={4} className={classes.topGrid}>
        <Card className={classes.card}>
          {!title && <CardHeader title={title} />}
          {title && (
            <CardHeader
              avatar={
                <Avatar
                  variant="square"
                  src={campfireBanIcon}
                  aria-label={title}
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
