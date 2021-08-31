import React, { useState } from "react"
import { Container, Box, Paper, Button } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import Heading from "./heading"
import HtmlContent from "./htmlContent"

const useStyles = makeStyles(theme => ({
  collapsed: {
    maxHeight: "200px",
    lineHeight: "2em",
    overflow: "hidden",
    display: "block",
    textOverflow: "ellipsis",
  },
  expanded: {
    maxHeight: "auto",
  },
}))

export default function ParkOverview({ data: parkOverview }) {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)

  return (
    <div id="park-overview-container" className="anchor-link">
      <Paper elevation={0}>
        <Box className={expanded ? classes.expanded : classes.collapsed}>
          <Heading>Park Overview</Heading>
          <Container>
            <HtmlContent>{parkOverview}</HtmlContent>
          </Container>
        </Box>
        <Box m={2}>
          <Button
            color="primary"
            href="#park-overview-container"
            onClick={() => {
              setExpanded(!expanded)
            }}
          >
            {expanded ? "Read less" : "Read more"}
          </Button>
        </Box>
      </Paper>
    </div>
  )
}
