import React from "react"
import { Box } from "@material-ui/core"
import LineBar from "./lineBar"

export default function Heading({ title }) {
  return (
    <>
      <Box m={2}>
        <h2>{title}</h2>
        <br></br>
        <LineBar />
      </Box>
    </>
  )
}
