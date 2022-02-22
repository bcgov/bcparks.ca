import React, { useState } from "react"
import {
  Box,
  Button,
  Grid,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"
import StaticIcon from "./staticIcon"

export default function CampingDetails({ data }) {
  const campingFacilities = data.parkFacilities.filter(facility =>
    facility.facilityType.facilityName.toLowerCase().includes("camping")
  ) 
  const [reservationsExpanded, setReservationsExpanded] = useState(false)
  const [expanded, setExpanded] = useState(Array(campingFacilities.length).fill(false))

  if (campingFacilities.length === 0) return null

  const toggleExpand = index => (event, isExpanded) => {
    expanded[index] = isExpanded
    setExpanded([...expanded])
  }

  return (
    <Grid
      item
      xs={12}
      id="park-camping-details-container"
      className="anchor-link"
    >
      <Paper elevation={0}>
        <div className="d-block d-sm-block d-xs-block d-md-block d-lg-none d-xl-none">
          <Grid item xs={12} container>
            {data.hasReservations && (
              <Button
                className="yellow-button full-width"
                href="https://camping.bcparks.ca/"
              >
                Book a campsite
              </Button>
            )}
          </Grid>
          <br />
        </div>
        <Grid container>
          <Grid item xs={6}>
            <Heading>Camping</Heading>
          </Grid>

          <Grid
            item
            xs={6}
            container
            justifyContent="flex-end"
            alignItems="flex-start"
          >
            <div className="d-none d-xl-block d-lg-block d-md-none d-sm-none d-xs-none">
              {data.hasReservations && (
                <Button
                  className="yellow-button"
                  href="https://camping.bcparks.ca/"
                >
                  Book a campsite
                </Button>
              )}
            </div>
          </Grid>
        </Grid>
        {campingFacilities.length > 0 && (
          <div id="park-camping-list-container" className="anchor-link">
            <Grid container spacing={2}>
              {data.reservations && (
                <Grid key="reservation" item xs={12}>
                  <Accordion
                    expanded={reservationsExpanded}
                    onChange={() => setReservationsExpanded(!reservationsExpanded)}
                    className="park-details-shaded"
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="reservations"
                      id="panel1a-header"
                    >
                      <HtmlContent>Reservations</HtmlContent>
                    </AccordionSummary>
                    <AccordionDetails>
                      <HtmlContent>{data.reservations}</HtmlContent>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              )}
              {campingFacilities.map((facility, index) => (
                <Grid key={index} item xs={12}>
                  <Accordion
                    expanded={expanded[index]}
                    onChange={toggleExpand(index)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={facility.facilityType.facilityName}
                      id={index}
                    >
                      <Box mr={1}>
                        <StaticIcon name={facility.facilityType.icon} size={48} />
                      </Box>
                      <HtmlContent className="pl15 p10t">
                        {facility.facilityType.facilityName}
                      </HtmlContent>
                    </AccordionSummary>
                    <AccordionDetails>
                      <HtmlContent>{facility.description}</HtmlContent>
                    </AccordionDetails>
                  </Accordion>
                </Grid>
              ))}
            </Grid>
          </div>
        )}
        <Spacer />
      </Paper>
    </Grid>
  )
}
