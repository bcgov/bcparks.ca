import React from "react"
import { Box } from "@material-ui/core"

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
