import React from "react"
import {
  Box,
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
  return (
    <div id="park-activity-container">
      <Paper elevation={0}>
        <Heading title="Activities" />
        {data && (
          <Container>
            <Grid container spacing={3}>
              {data.map((activity, index) => (
                <Grid key={index} item xs={12} sm={6} md={4}>
                  <Paper>
                    <Accordion>
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
