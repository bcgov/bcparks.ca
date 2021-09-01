import React, { useState } from "react"
import {
  Box,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Grid,
} from "@material-ui/core"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

const _ = require("lodash")

export default function ParkFacility({ data }) {
  const facilityData = _.sortBy(data, ["facilityName"], ["asc"])
  let expandedsInitial = []
  facilityData.forEach((facility, index) => {
    expandedsInitial[index] = false
  })

  const [allExpanded, setAllExpanded] = useState(false)
  const [expandeds, setExpandeds] = useState(expandedsInitial)

  if (facilityData.length === 0) return null

  const handleChange = id => (event, isExpanded) => {
    expandeds[id] = isExpanded
    setExpandeds([...expandeds])
  }

  const expandAll = isAllExpanded => {
    let expandeds = []
    facilityData.forEach((facility, index) => {
      expandeds[index] = isAllExpanded
    })
    setExpandeds(expandeds)
  }

  return (
    <Grid item xs={12} id="park-facility-container" className="anchor-link">
      <Paper elevation={0}>
        <Grid container>
          <Grid item xs={6}>
            <Heading>Facilities</Heading>
          </Grid>
          <Grid
            item
            xs={6}
            container
            justifyContent="flex-end"
            alignItems="flex-start"
          >
            <Box m={2}>
              {facilityData.length > 1 && (
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
        {facilityData && (
          <Grid container spacing={1}>
            {facilityData.map((facility, index) => (
              <Grid key={index} item xs={12}>
                <Paper>
                  <Accordion
                    expanded={expandeds[index]}
                    onChange={handleChange(index)}
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls={facility.activityName}
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
