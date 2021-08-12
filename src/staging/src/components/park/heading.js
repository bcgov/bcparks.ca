import React from "react"
import { Box } from "@material-ui/core"
import LineBar from "./lineBar"

export default function Heading({ title }) {
  return (
    <>
      <Box p={1}>
        <h2 className="heading">{title}</h2>
        <LineBar />
      </Box>
    </>
  )
}
