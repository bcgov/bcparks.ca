import React from "react"
import { Grid, Paper, Typography } from "@material-ui/core"

export default function PetsOnLeash({ data }) {
  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
        <Paper>
          <Typography>Day Use</Typography>
        </Paper>
      </Grid>
    </>
  )
}
