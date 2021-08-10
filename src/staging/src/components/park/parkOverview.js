import React from "react"
import clsx from "clsx"
import {
  Button,
  Paper,
  Grid,
  Typography,
  Card,
  CardContent,
  CardActions,
  Collapse,
  IconButton,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import MoreVertIcon from "@material-ui/icons/MoreVert"
import { red } from "@material-ui/core/colors"
import Photo from "../park/photo"

import { makeStyles } from "@material-ui/core/styles"

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 345,
  },
  media: {
    height: 0,
    paddingTop: "56.25%", // 16:9
  },
  expand: {
    transform: "rotate(0deg)",
    marginLeft: "auto",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: "rotate(180deg)",
  },
  avatar: {
    backgroundColor: red[500],
  },
}))

export default function ParkOverview({ data }) {
  const classes = useStyles()
  const [expanded, setExpanded] = React.useState(false)

  const handleExpandClick = () => {
    setExpanded(!expanded)
  }
  return (
    <>
      <Paper>
        <h1>Park Overview</h1>
        <Grid container>
          <Grid item xs component={Card}>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Park ParkOverview
              </Typography>
              <Typography variant="h5" component="h2">
                {data.protectedAreaName}
              </Typography>

              <Typography component="p">{data.description}</Typography>
            </CardContent>
            <CardActions disableSpacing>
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
            </CardActions>
          </Grid>
        </Grid>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Typography>{data.description}</Typography>
          </Grid>
          <Grid item xs={8}>
            <Photo photos={data.photos} />
          </Grid>
        </Grid>
      </Paper>
    </>
  )
}
