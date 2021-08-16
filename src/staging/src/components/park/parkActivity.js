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
            <Grid container spacing={3}>
              {data.map((activity, index) => (
                <Grid key={index} item xs={12} sm={6} md={4}>
                  <Paper>
                    <Accordion
                      expanded={expandeds[index]}
                      onChange={handleChange(index)}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={activity.activityName}
                        id={index}
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
                </Grid>
              ))}
            </Grid>
          </Container>
        )}
      </Paper>
    </div>
  )
}
