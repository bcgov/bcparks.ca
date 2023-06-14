import React from "react"
import { Box } from "@mui/material"

import LineBar from "./lineBar"

export default function Heading(props) {
  return (
    <>
      <Box p={0} m={0}>
        <h2>{props.children}</h2>
        <LineBar />
      </Box>
    </>
  )
}
