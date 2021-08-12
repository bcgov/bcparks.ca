import React from "react"
import {
  Box,
  Button,
  Grid,
  Paper,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Heading from "./heading"

export default function CampingDetails({ data }) {
  const campingFacilites = data.parkFacilities.filter(facility =>
    facility.facilityName.toLowerCase().includes("camping")
  )

  return (
    <div id="camping-details-container">
      <Paper elevation={0}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Heading title="Camping " />
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
              <Button variant="contained" color="primary">
                Book a campsite
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Container>
          <Paper elevation={0} b={2} className="park-details-shaded">
            <Container p={2} className="park-details-shaded">
              <h3 className="heading">Reservations</h3>
              {data.reservations}
            </Container>
          </Paper>
        </Container>
        <br></br>
      </Paper>

      <Paper elevation={0}>
        {campingFacilites.length > 0 && (
          <Container>
            <Grid container spacing={3}>
              {campingFacilites.map((facility, index) => (
                <Grid key={index} item xs={12}>
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
