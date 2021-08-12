import React from "react"
import {
  Box,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Container,
  Divider,
  Grid,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Heading from "./heading"

import blueAlertIcon from "../../images/park/blue-alert-64.png"
import yellowAlertIcon from "../../images/park/yellow-alert-64.png"
import redAlertIcon from "../../images/park/red-alert-64.png"

const useStyles = makeStyles(theme => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}))

export default function AdvisoryDetails({ data }) {
  const classes = useStyles()
  const advisories = data.nodes.map(advisory => {
    let alertIcon = blueAlertIcon
    let alertColorCss = ".blue-alert"
    switch (advisory.urgency.color) {
      case "blue":
        alertIcon = blueAlertIcon
        alertColorCss = "blue-alert"
        break
      case "red":
        alertIcon = redAlertIcon
        alertColorCss = "red-alert"
        break
      case "yellow":
        alertIcon = yellowAlertIcon
        alertColorCss = "yellow-alert"
    }
    advisory.alertIcon = alertIcon
    advisory.alertColorCss = alertColorCss
    return advisory
  })

  const tempCss = "yellow-alert"
  return (
    <div id="park-advisory-details-container">
      <Paper elevation={0}>
        <Heading title={`Alerts (${advisories.length})`} />
        {data && (
          <Container>
            <Grid container spacing={1}>
              {advisories.map(advisory => (
                <Grid key={advisory.id} item xs={12}>
                  <Paper elevation={0}>
                    <Accordion>
                      <AccordionSummary
                        className={advisory.alertColorCss}
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={advisory.title}
                        id={advisory.id}
                      >
                        <Box mr={1}>
                          <Avatar
                            src={advisory.alertIcon}
                            className={classes.small}
                            width="24"
                            height="24"
                          />
                        </Box>
                        <p>{advisory.title}</p>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div>
                          <Divider variant="fullWidth" />
                          <p>{advisory.description}</p>
                          {advisory.isEffectiveDateDisplayed &&
                            advisory.effectiveDate && (
                              <>
                                <br />
                                <p>
                                  In effect {advisory.effectiveDate}
                                  {advisory.isEndDateDisplayed &&
                                    advisory.endDate && (
                                      <>
                                        {" to "}
                                        {advisory.endDate}
                                      </>
                                    )}
                                </p>
                              </>
                            )}
                          {advisory.isAdvisoryDateDisplayed &&
                            advisory.advisoryDate && (
                              <>
                                <p>Posted {advisory.advisoryDate}</p>
                              </>
                            )}
                        </div>
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
