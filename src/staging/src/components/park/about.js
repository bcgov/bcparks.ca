import React from "react"
import { Paper, Typography } from "@material-ui/core"
import Heading from "./heading"

export default function About({ data }) {
  return (
    <div id="park-about">
      <Paper elevation={0}>
        <Heading title="Learn more about this park" />
        <Typography>{data}</Typography>
      </Paper>
    </div>
  )
}
