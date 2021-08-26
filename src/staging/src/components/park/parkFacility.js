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

export default function ParkFacility({ data }) {
  let expandedsInitial = []
  data.forEach((facility, index) => {
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
    data.forEach((facility, index) => {
      expandeds[index] = isAllExpanded
    })
    setExpandeds(expandeds)
  }

  let numberOfColumns = 3
  let rowsPerColumn = Math.ceil(data.length / numberOfColumns)
  let itemsCount = 0
  let index = 0
  let facilities = []
  let facilityItems = []

  for (const facility of data) {
    facility.id = ++index
    facilityItems.push(facility)
    if (facilityItems.length >= rowsPerColumn || data.length === index) {
      itemsCount += facilityItems.length
      facilities.push(facilityItems)
      facilityItems = []
      if (--numberOfColumns < 0) numberOfColumns = 1
      rowsPerColumn = Math.ceil((data.length - itemsCount) / numberOfColumns)
    }
  }

  return (
    <div id="park-facility-container" className="anchor-link">
      <Paper elevation={0}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Heading>Facilities</Heading>
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
            <Grid container spacing={0}>
              {facilities.map((facilityItems, index) => (
                <Grid key={index} item xs={12} md={4}>
                  {facilityItems.map(facility => (
                    <Box p={1} key={facility.id}>
                      <Paper>
                        <Accordion
                          expanded={expandeds[facility.id]}
                          onChange={handleChange(facility.id)}
                          id={facility.id}
                        >
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls={facility.facilityName}
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
                    </Box>
                  ))}
                </Grid>
              ))}
            </Grid>
          </Container>
        )}
      </Paper>
    </div>
  )
}
