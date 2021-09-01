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

export default function CampingDetails({ data }) {
  const campingFacilities = data.parkFacilities.filter(facility =>
    facility.facilityName.toLowerCase().includes("camping")
  )

  let expandedsInitial = []
  campingFacilities.forEach((camping, index) => {
    expandedsInitial[index] = false
  })

  const [allExpanded, setAllExpanded] = useState(false)
  const [expandeds, setExpandeds] = useState(expandedsInitial)

  if (campingFacilities.length === 0) return null

  const handleChange = id => (event, isExpanded) => {
    expandeds[id] = isExpanded
    setExpandeds([...expandeds])
  }

  const expandAll = isAllExpanded => {
    let expandeds = []
    campingFacilities.forEach((camping, index) => {
      expandeds[index] = isAllExpanded
    })
    setExpandeds(expandeds)
  }

  return (
    <Grid
      item
      xs={12}
      id="park-camping-details-container"
      className="anchor-link"
    >
      <Paper elevation={0}>
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
            <Box m={1}>
              <Button
                className="yellow-button"
                href="https://discovercamping.ca/"
              >
                Book a campsite
              </Button>
            </Box>
          </Grid>
        </Grid>
        {data.reservations && (
          <Accordion defaultExpanded className="park-details-shaded">
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="reservations"
              id="panel1a-header"
            >
              <h3 className="heading">Reservations</h3>
            </AccordionSummary>
            <AccordionDetails>
              <HtmlContent>{data.reservations}</HtmlContent>
            </AccordionDetails>
          </Accordion>
        )}
        {campingFacilities.length > 0 && (
          <div id="park-camping-list-container" className="anchor-link">
            <Grid
              container
              item
              xs={12}
              spacing={0}
              direction="row"
              alignItems="center"
              justifyContent="flex-end"
            >
              <Box m={2}>
                {campingFacilities.length > 1 && (
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
            <Grid container spacing={2}>
              {campingFacilities.map((facility, index) => (
                <Grid key={index} item xs={12}>
                  <Accordion
                    expanded={expandeds[index]}
                    onChange={handleChange(index)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={facility.facilityName}
                      id={index}
                    >
                      <Box mr={1}>
                        <img
                          src={facility.icon}
                          alt={facility.icon ? facility.facilityName : ""}
                          width="24"
                          height="24"
                        />
                      </Box>
                      <HtmlContent>{facility.facilityName}</HtmlContent>
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
