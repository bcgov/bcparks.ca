import React from "react"
import {
  Box,
  Container,
  Grid,
  Typography,
  Paper,
  TextareaAutosize,
} from "@material-ui/core"
import ParkPhoto from "./parkPhoto"
import Heading from "./heading"

export default function ParkOverview({ data }) {
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  return (
    <div id="park-overview">
      <Paper elevation={0}>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Heading title="Park Overview" />
            <Container>
              <Typography>{data.description.substr(1, 500)}....</Typography>
            </Container>
          </Grid>
          <Grid item xs={8}>
            <ParkPhoto photos={data.photos} />
          </Grid>
        </Grid>
      </Paper>
    </div>
  )
}
