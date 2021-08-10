import React from "react"
import { Grid, Paper, Typography } from "@material-ui/core"

export default function ParkEvent({ data }) {
  if (!data) return null
  const parkEvents = data.nodes.filter(f => f.eventType != null)
  if (parkEvents.length === 0) return null
  return (
    <>
      <Grid item xs={12} sm={6} md={4}>
        <Paper>
          <Typography>
            {parkEvents.map((m, index) => (
              <p key={index}>{m.eventType.eventType}</p>
            ))}
          </Typography>
        </Paper>
      </Grid>
    </>
  )
}
