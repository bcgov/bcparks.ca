import React, { useState } from "react"
import {
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
  Box,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

const _ = require("lodash")

export default function ParkActivity({ data }) {
  const activityData = _.sortBy(data, ["activityName"], ["asc"])
  let expandedInitial = []
  activityData.forEach((activity, index) => {
    expandedInitial[index] = false
  })

  // const [allExpanded, setAllExpanded] = useState(false)
  const [expanded, setExpanded] = useState(expandedInitial)

  if (activityData.length === 0) return null

  const handleChange = id => (event, isExpanded) => {
    expanded[id] = isExpanded
    setExpanded([...expanded])
  }

  // const expandAll = isAllExpanded => {
  //   let expanded = []
  //   activityData.forEach((activity, index) => {
  //     expanded[index] = isAllExpanded
  //   })
  //   setExpanded(expanded)
  // }

  return (
    <Grid item xs={12} id="park-activity-container" className="anchor-link">
      <Paper elevation={0}>
        <Grid container>
          <Grid item xs={12}>
            <Heading>Activities</Heading>
          </Grid>
          {/* <Grid
            item
            xs={6}
            container
            justifyContent="flex-end"
            alignItems="flex-start"
          >
            <Box m={2}>
              {activityData.length > 1 && (
                <Button
                  color="primary"
                  onClick={() => {
                    expandAll(!allExpanded)
                    setAllExpanded(!allExpanded)
                  }}
                >
                  {allExpanded ? "[collapse all]" : "[expand all]"}
                </Button>
              )}
            </Box>
          </Grid> */}
        </Grid>
        {activityData && (
          <Grid container spacing={1}>
            {activityData.map((activity, index) => (
              <Grid key={index} item xs={12}>
                <Paper>
                  <Accordion
                    expanded={expanded[index]}
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
                          alt={activity.icon ? activity.activityName : ""}
                          width="48"
                          height="48"
                        />
                      </Box>
                      <HtmlContent className="pl15 p10t">
                        {activity.activityName}
                      </HtmlContent>
                    </AccordionSummary>
                    <AccordionDetails>
                      <HtmlContent>{activity.description}</HtmlContent>
                    </AccordionDetails>
                  </Accordion>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
        <Spacer />
      </Paper>
    </Grid>
  )
}
