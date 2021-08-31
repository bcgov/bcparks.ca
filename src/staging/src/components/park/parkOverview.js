import React, { useState } from "react"
import { Box, Paper, Link } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

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
  link: {
    textDecoration: "underline",
    fontWeight: "bold",
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
          <HtmlContent>{parkOverview}</HtmlContent>
        </Box>
        <Link
          component="button"
          href="#park-overview-container"
          className={classes.link}
          onClick={() => {
            setExpanded(!expanded)
          }}
        >
          {expanded ? "Read less" : "Read more"}
        </Link>
        <Spacer />
      </Paper>
    </div>
  )
}
