import React from "react"
import { Divider, Paper } from "@material-ui/core"

export default function Reconciliation({ data }) {
  return (
    <>
      <Paper>
        <h1>Reconciliation with Indigenous peoples</h1>
        <p>{data}</p>
      </Paper>
    </>
  )
}
