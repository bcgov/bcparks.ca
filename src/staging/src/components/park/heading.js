import React from "react"
import { Box } from "@material-ui/core"
import LineBar from "./lineBar"

export default function Heading(props) {
  return (
    <>
      <Box p={1}>
        <h2 className="heading">{props.children}</h2>
        <LineBar />
      </Box>
    </>
  )
}
