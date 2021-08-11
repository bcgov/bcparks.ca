import React from "react"
import { Box, Typography } from "@material-ui/core"
import LineBar from "./lineBar"

export default function Heading({ title }) {
  return (
    <>
      <Box m={1}>
        <Typography variant="h5">{title}</Typography>
        <br></br>
        <LineBar />
      </Box>
    </>
  )
}
