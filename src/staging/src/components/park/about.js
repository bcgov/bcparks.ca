import React from "react"
import { Divider, Paper } from "@material-ui/core"

export default function ParkStatus({ data }) {
  return (
    <>
      <Paper>
        <h1>Learn more about this park</h1>
        <p>{data}</p>
      </Paper>
    </>
  )
}
