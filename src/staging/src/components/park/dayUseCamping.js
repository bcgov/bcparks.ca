import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, Card, CardHeader, Avatar } from "@material-ui/core"
import dayUseIcon from "../../images/park/day-use.png"
import { Link } from "gatsby"

const useStyles = makeStyles({
  card: {
    border: "none",
    boxShadow: "none",
  },
})

export default function DayUseCamping({ data }) {
  const classes = useStyles()

  const hasCamping = data.parkFacilities.some(facility =>
    facility.facilityName.toLowerCase().includes("camping")
  )

  let title = []
  if (data.isDayUsePass) title.push("Day Use")
  if (hasCamping) title.push("Camping")

  return (
    <>
      {(hasCamping || data.isDayUsePass) && (
        <Grid container item xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Avatar
                  variant="square"
                  src={dayUseIcon}
                  aria-label="day use"
                />
              }
              title={
                <Link to="#park-facility-container">
                  {title.join(" and ")} offered at this park
                </Link>
              }
            />
          </Card>
        </Grid>
      )}
    </>
  )
}
