import React from "react"
import { Paper, Typography } from "@material-ui/core"
import Heading from "./heading"

export default function Reconciliation({ data }) {
  return (
    <>
      <Paper>
        <Heading title="Reconciliation with Indigenous peoples" />
        <Typography>{data}</Typography>
      </Paper>
    </>
  )
}
