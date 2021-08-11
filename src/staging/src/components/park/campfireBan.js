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

  let title = []
  if (hasCampfireBan === "Y") title.push("Campfire")
  if (hasSmokingBan === "Y") title.push("Smoking")

  return (
    <>
      {(hasCampfireBan === "Y" || hasSmokingBan === "Y") && (
        <Grid container item xs={12} sm={6} md={4} className={classes.topGrid}>
          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Avatar
                  variant="square"
                  src={campfireBanIcon}
                  aria-label="camp fire ban"
                />
              }
              title={<div>{title.join(" and ")} ban in effect</div>}
            />
          </Card>
        </Grid>
      )}
    </>
  )
}
