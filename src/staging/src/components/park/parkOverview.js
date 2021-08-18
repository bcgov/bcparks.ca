import React, { useState } from "react"
import { Container, Collapse, Grid, Paper, IconButton } from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import clsx from "clsx"
import ParkPhoto from "./parkPhoto"
import Heading from "./heading"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

import ShowLessText from "./showLessText"
import ShowMoreText from "./showMoreText"

const useStyles = makeStyles(theme => ({
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
}))

export default function ParkOverview({ data }) {
  const classes = useStyles()
  const [expanded, setExpanded] = useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }

  return (
    <div id="park-overview-container" className="anchor-link">
      <Paper elevation={0}>
        <Grid container spacing={3}>
          <Grid
            item
            xs={12}
            sm={12}
            md={data.photos.nodes.length === 0 ? 12 : 4}
          >
            <Heading>Park Overview</Heading>
            <Container>
              <ShowLessText text={data.description} length={500} />
              <IconButton
                className={clsx(classes.expand, {
                  [classes.expandOpen]: expanded,
                })}
                onClick={handleExpandClick}
                aria-expanded={expanded}
                aria-label="show more"
              >
                <ExpandMoreIcon />
              </IconButton>
            </Container>
          </Grid>
          {data.photos.nodes.length !== 0 && (
            <Grid item xs={12} sm={12} md={8}>
              <ParkPhoto photos={data.photos} />
            </Grid>
          )}
        </Grid>
        <Grid item xs={12}>
          <Collapse in={expanded} timeout="auto" unmountOnExit>
            <Container>
              <ShowMoreText text={data.description} length={500} />
            </Container>
          </Collapse>
        </Grid>
      </Paper>
    </div>
  )
}
