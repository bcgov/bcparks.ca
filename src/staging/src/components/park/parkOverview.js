import React from "react"
import { Box, Container, Grid, Paper } from "@material-ui/core"
import ParkPhoto from "./parkPhoto"
import Heading from "./heading"

export default function ParkOverview({ data }) {
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  return (
    <div id="park-overview-container">
      <Paper elevation={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={12} md={4}>
            <Heading title="Park Overview" />
            <Container>
              <p>{data.description.substr(1, 300)}....</p>
            </Container>
          </Grid>
          <Grid item xs={12} sm={12} md={8}>
            <ParkPhoto photos={data.photos} />
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
