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
  const advisories = data.nodes
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
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={advisory.title}
                        id={advisory.id}
                      >
                        <Box mr={1}>
                          {advisory.urgency.color === "blue" && (
                            <Avatar
                              src={blueAlertIcon}
                              className={classes.small}
                              width="24"
                              height="24"
                            />
                          )}
                          {advisory.urgency.color === "yellow" && (
                            <Avatar
                              src={yellowAlertIcon}
                              className={classes.small}
                              width="24"
                              height="24"
                            />
                          )}
                          {advisory.urgency.color === "red" && (
                            <Avatar
                              src={redAlertIcon}
                              className={classes.small}
                              width="24"
                              height="24"
                            />
                          )}
                        </Box>
                        <p>{advisory.title}</p>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div>
                          <Divider variant="inset" />
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
