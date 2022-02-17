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
import StaticIcon from "./staticIcon"

export default function ParkActivity({ data }) {
  const activityData = data
  const [expanded, setExpanded] = useState(
    Array(activityData.length).fill(false)
  )

  if (activityData.length === 0) return null

  const handleChange = id => (event, isExpanded) => {
    expanded[id] = isExpanded
    setExpanded([...expanded])
  }

  return (
    <Grid item xs={12} id="park-activity-container" className="anchor-link">
      <Paper elevation={0}>
        <Grid container>
          <Grid item xs={12}>
            <Heading>Activities</Heading>
          </Grid>
        </Grid>
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
                    aria-controls={activity.activityType.activityName}
                    id={index}
                  >
                    <Box mr={1}>
                      <StaticIcon name={activity.activityType.icon} size={48} />
                    </Box>
                    <HtmlContent className="pl15 p10t">
                      {activity.activityType.activityName}
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
        <Spacer />
      </Paper>
    </Grid>
  )
}
