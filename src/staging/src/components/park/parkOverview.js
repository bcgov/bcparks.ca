import React, { useState } from "react"
import { Container, Box, Paper, Button } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"

import Heading from "./heading"
import HtmlContent from "./HtmlContent"

const useStyles = makeStyles(theme => ({
  collapsed: {
    padding: theme.spacing(1),
    maxHeight: "200px",
    overflow: "hidden",
  },
  expanded: {
    padding: theme.spacing(1),
    maxHeight: "auto",
  },
  photo: {
    float: "right",
    marginLeft: "10px",
    width: "67%",
    [theme.breakpoints.down("sm")]: {
      width: "100%",
    },
  },
}))

export default function ParkOverview({ data }) {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)

  return (
    <div id="park-overview-container" className="anchor-link">
      <Paper elevation={0}>
        <Box className={expanded ? classes.expanded : classes.collapsed}>
          <Heading>Park Overview</Heading>
          <Container>
            <HtmlContent>{data.description}</HtmlContent>
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
