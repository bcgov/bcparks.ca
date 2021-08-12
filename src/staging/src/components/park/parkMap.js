import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, Card, CardHeader, Avatar } from "@material-ui/core"
import mapIcon from "../../images/park/map.png"
import { Link } from "gatsby"

const useStyles = makeStyles({
  card: {
    border: "none",
    boxShadow: "none",
  },
})

export default function ParkMap() {
  const classes = useStyles()

  return (
    <>
      <Grid container item xs={12} sm={6} md={4}>
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar
                variant="square"
                src={mapIcon}
                aria-label="park and activity map"
              />
            }
            title={
              <Link to="#park-map-details-container">
                Park and Activity Map
              </Link>
            }
          />
        </Card>
      </Grid>
    </>
  )
}
