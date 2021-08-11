import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import { Grid, Card, CardHeader, CardContent, Avatar } from "@material-ui/core"
import mapIcon from "../../images/park/map.png"
import Heading from "./heading"

const useStyles = makeStyles({
  card: {
    border: "none",
    boxShadow: "none",
  },
})

export default function ParkMapHeader({ data }) {
  const classes = useStyles()

  return (
    <div id="park-map">
      <Grid container item xs={12} sm={6} md={4}>
        <Card className={classes.card}>
          <Heading title="Park and Activity Map" />
          <CardHeader
            avatar={
              <Avatar
                variant="square"
                src={mapIcon}
                aria-label="park and activity map"
              />
            }
            title="Park and Activity Map"
          />
          <CardContent>Coming Soon</CardContent>
        </Card>
      </Grid>
    </div>
  )
}
