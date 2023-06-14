import React from "react"
import Box from "@mui/material/Box"

const defaultProps = {
  bgcolor: "background.paper",
  m: 0,
  style: { width: "5rem", height: "2rem" },
  borderColor: "#fd8a19",
}

export default function LineBar() {
  return <Box borderTop={3} {...defaultProps} />
}
