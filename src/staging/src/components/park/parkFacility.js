import React from "react"
import {
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Container,
  Grid,
  Typography,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Heading from "./heading"

export default function ParkFacility({ data }) {
  return (
    <div id="park-facility">
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
                        <Typography>
                          <img
                            src={facility.icon}
                            alt={facility.activityName}
                            width="24"
                            height="24"
                          ></img>{" "}
                          {facility.facilityName}
                        </Typography>
                      </AccordionSummary>
                      <AccordionDetails>
                        <Typography>{facility.description}</Typography>
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
