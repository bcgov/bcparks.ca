import React from "react"
import { makeStyles } from "@material-ui/core/styles"
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Avatar,
  Paper,
  Container,
} from "@material-ui/core"
import mapIcon from "../../images/park/map.png"
import Heading from "./heading"

const useStyles = makeStyles({
  card: {
    border: "none",
    boxShadow: "none",
  },
})

export default function ParkMapDetails({ data }) {
  const classes = useStyles()

  return (
    <div id="park-map-details-container">
      <Paper elevation={0}>
        <Heading title="Park and Activity Map" />
        <Container>
          <Card className={classes.card}>
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
        </Container>
      </Paper>
    </div>
  )
}
