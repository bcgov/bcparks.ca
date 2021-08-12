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

export default function ParkFacility({ data }) {
  return (
    <div id="park-facility-container">
      <Paper elevation={0}>
        <Heading title="Facilities" />
        {data && (
          <Container>
            <Grid container spacing={3}>
              {data.map((facility, index) => (
                <Grid key={index} item xs={12} sm={6} md={4}>
                  <Paper>
                    <Accordion>
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={facility.activityName}
                        id={index}
                      >
                        <Box mr={1}>
                          <img
                            src={facility.icon}
                            alt={facility.activityName}
                            width="24"
                            height="24"
                          />
                        </Box>
                        <p>{facility.facilityName}</p>
                      </AccordionSummary>
                      <AccordionDetails>
                        <p>{facility.description}</p>
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
