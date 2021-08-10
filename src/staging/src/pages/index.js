import React from "react"
import { Divider } from "@material-ui/core"
import { withStyles } from "@material-ui/core/styles"
import Grid from "@material-ui/core/Grid"

export default function Home({ data }) {
  return (
    <div>
      <Divider />
      <Grid container spacing={24}>
        <Grid item xs={9}>
          <h1>Hello</h1>
        </Grid>
        <Grid item xs={3}>
          <h1>Hello</h1>
        </Grid>
      </Grid>
    </div>
  )
}
