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
    <Paper>
      <Grid container spacing={3}>
        <Grid item xs={4}>
          <Container>
            <Heading title="Park Overview" />
            <Typography>{data.description}</Typography>
          </Container>
        </Grid>
        <Grid item xs={8}>
          
          <ParkPhoto photos={data.photos} />
        </Grid>
      </Grid>
    </Paper>
  )
}
