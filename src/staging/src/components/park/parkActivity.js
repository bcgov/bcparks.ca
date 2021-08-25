import React, { useState } from "react"
import {
  Box,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Grid,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Heading from "./heading"

export default function ParkActivity({ data }) {
  let expandedsInitial = []
  data.forEach((activity, index) => {
    expandedsInitial[index] = false
  })

  const [allExpanded, setAllExpanded] = useState(false)
  const [expandeds, setExpandeds] = useState(expandedsInitial)

  if (data.length === 0) return null

  const handleChange = id => (event, isExpanded) => {
    expandeds[id] = isExpanded
    setExpandeds([...expandeds])
  }

  const expandAll = isAllExpanded => {
    let expandeds = []
    data.forEach((activity, index) => {
      expandeds[index] = isAllExpanded
    })
    setExpandeds(expandeds)
  }

  let numberOfColumns = 3
  let rowsPerColumn = Math.ceil(data.length / numberOfColumns)
  let itemsCount = 0
  let index = 0
  let activities = []
  let activityItems = []

  for (const activity of data) {
    activity.id = ++index
    activityItems.push(activity)
    if (activityItems.length >= rowsPerColumn || data.length === index) {
      itemsCount += activityItems.length
      activities.push(activityItems)
      activityItems = []
      if (--numberOfColumns < 0) numberOfColumns = 1
      rowsPerColumn = Math.ceil((data.length - itemsCount) / numberOfColumns)
    }
  }

  return (
    <div id="park-activity-container" className="anchor-link">
      <Paper elevation={0}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Heading>Activities</Heading>
          </Grid>
          <Grid
            item
            xs={12}
            sm={6}
            container
            direction="row"
            alignItems="center"
            justifyContent="flex-end"
          >
            <Box m={2}>
              {data.length > 1 && (
                <Button
                  color="primary"
                  onClick={() => {
                    expandAll(!allExpanded)
                    setAllExpanded(!allExpanded)
                  }}
                >
                  {allExpanded ? "Collapse all" : "Expand All"}
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
        {data && (
          <Container>
            <Grid container spacing={0}>
              {activities.map((activityItems, index) => (
                <Grid key={index} item xs={12} md={4}>
                  {activityItems.map(activity => (
                    <Box p={1} key={activity.id}>
                      <Paper>
                        <Accordion
                          expanded={expandeds[activity.id]}
                          onChange={handleChange(activity.id)}
                          id={activity.id}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={activity.activityName}
                          >
                            <Box mr={1}>
                              <img
                                src={activity.icon}
                                alt={activity.activityName}
                                width="24"
                                height="24"
                              />
                            </Box>
                            <p>{activity.activityName}</p>
                          </AccordionSummary>
                          <AccordionDetails>
                            <p>{activity.description}</p>
                          </AccordionDetails>
                        </Accordion>
                      </Paper>
                    </Box>
                  ))}
                </Grid>
              ))}
            </Grid>
          </Container>
        )}
      </Paper>
    </div>
  )
}
