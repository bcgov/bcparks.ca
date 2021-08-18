import React, { useState } from "react"
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
import HtmlContent from "./htmlContent"

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
    <div id="park-camping-details-container" className="anchor-link">
      <Paper elevation={0}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Heading>Camping</Heading>
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
          <Box m={2} p={2} className="park-details-shaded">
            <h3 className="heading">Reservations</h3>
            <HtmlContent>{data.reservations}</HtmlContent>
          </Box>
        </Container>
        {campingFacilities.length > 0 && (
          <div id="park-camping-list-container" className="anchor-link">
            <Container>
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
                    <Paper>
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
                              alt={facility.facilityName}
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
          </div>
        )}
      </Paper>
    </div>
  )
}
