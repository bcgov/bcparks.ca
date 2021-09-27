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

const _ = require("lodash")

export default function ParkFacility({ data }) {
  const facilityData = _.sortBy(data, ["facilityName"], ["asc"])
  let expandedInitial = []
  facilityData.forEach((facility, index) => {
    expandedInitial[index] = false
  })

  // const [allExpanded, setAllExpanded] = useState(false)
  const [expanded, setExpanded] = useState(expandedInitial)

  if (facilityData.length === 0) return null

  const handleChange = id => (event, isExpanded) => {
    expanded[id] = isExpanded
    setExpanded([...expanded])
  }

  // const expandAll = isAllExpanded => {
  //   let expanded = []
  //   facilityData.forEach((facility, index) => {
  //     expanded[index] = isAllExpanded
  //   })
  //   setExpanded(expanded)
  // }

  return (
    <Grid item xs={12} id="park-facility-container" className="anchor-link">
      <Paper elevation={0}>
        <Grid container>
          <Grid item xs={12}>
            <Heading>Facilities</Heading>
          </Grid>
          {/* <Grid
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
                  {allExpanded ? "[collapse all]" : "[expand all]"}
                </Button>
              )}
            </Box>
          </Grid> */}
        </Grid>
        {facilityData && (
          <Grid container spacing={1}>
            {facilityData.map((facility, index) => (
              <Grid key={index} item xs={12}>
                <Paper>
                  <Accordion
                    expanded={expanded[index]}
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
                          width="48"
                          height="48"
                        />
                      </Box>
                      <HtmlContent className="pl15 p10t">
                        {facility.facilityName}
                      </HtmlContent>
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
