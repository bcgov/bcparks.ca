import React from "react"
import { Typography } from "@material-ui/core"
import LineBar from "./lineBar"

export default function Heading({ title }) {
  return (
    <>
      <Typography variant="h4">{title}</Typography>
      <br></br>
      <LineBar />
    </>
  )
}
