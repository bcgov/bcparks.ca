import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, Card, CardHeader, Avatar } from "@material-ui/core"
import { Link } from "gatsby"
import accessibilityIcon from "../../images/park/accessibility.png"

const useStyles = makeStyles({
  card: {
    border: "none",
    boxShadow: "none",
  },
})

export default function Accessibility({ parkFacilities }) {
  const classes = useStyles()

  const isAccessibility = parkFacilities.some(facility =>
    facility.facilityName.toLowerCase().includes("accessibility")
  )

  return (
    <>
      {isAccessibility && (
        <Grid container item xs={12} sm={6} md={4}>
          <Card className={classes.card}>
            <CardHeader
              avatar={
                <Avatar
                  variant="square"
                  src={accessibilityIcon}
                  aria-label="accessibility information"
                />
              }
              title={<Link to="#park-facility-container">Accessibility</Link>}
            />
          </Card>
        </Grid>
      )}
    </>
  )
}
