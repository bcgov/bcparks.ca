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
import StaticIcon from "./staticIcon"

export default function ParkFacility({ data }) {
  const facilityData = data
  const [expanded, setExpanded] = useState(
    Array(facilityData.length).fill(false)
  )

  if (facilityData.length === 0) return null

  const handleChange = id => (event, isExpanded) => {
    expanded[id] = isExpanded
    setExpanded([...expanded])
  }

  return (
    <Grid item xs={12} id="park-facility-container" className="anchor-link">
      <Paper elevation={0}>
        <Grid container>
          <Grid item xs={12}>
            <Heading>Facilities</Heading>
          </Grid>
        </Grid>

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
              </Paper>
            </Grid>
          ))}
        </Grid>
        <Spacer />
      </Paper>
    </Grid>
  )
}
