import React, { useState } from "react"
import {
  Box,
  Button,
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
import HtmlContent from "./htmlContent"

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

  const advisoryData = data.nodes

  let expandedsInitial = []
  advisoryData.forEach((advisory, index) => {
    expandedsInitial[index] = false
  })

  const [allExpanded, setAllExpanded] = useState(false)
  const [expandeds, setExpandeds] = useState(expandedsInitial)

  const handleChange = id => (event, isExpanded) => {
    expandeds[id] = isExpanded
    setExpandeds([...expandeds])
  }

  const expandAll = isAllExpanded => {
    let expandeds = []
    advisoryData.forEach((advisory, index) => {
      expandeds[index] = isAllExpanded
    })
    setExpandeds(expandeds)
  }

  const advisories = advisoryData.map(advisory => {
    let alertIcon
    let alertColorCss
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
        break
      default:
        alertIcon = blueAlertIcon
        alertColorCss = ".blue-alert"
    }
    advisory.alertIcon = alertIcon
    advisory.alertColorCss = alertColorCss
    return advisory
  })

  return (
    <div id="park-advisory-details-container" className="anchor-link">
      <Paper elevation={0}>
        <Grid container>
          <Grid item xs={12} sm={6}>
            <Heading>{`Alerts (${advisories.length})`}</Heading>
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
              {advisories.length > 1 && (
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
        {data.totalCount === 0 && (
          <Container>
            <Box p={1}>
              <p>There are no reported alerts for this park</p>
            </Box>
          </Container>
        )}
        {data.totalCount > 0 && (
          <Container>
            <Grid container spacing={1}>
              {advisories.map((advisory, index) => (
                <Grid key={advisory.id} item xs={12}>
                  <Paper elevation={0}>
                    <Accordion
                      className={advisory.alertColorCss}
                      expanded={expandeds[index]}
                      onChange={handleChange(index)}
                    >
                      <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls={advisory.title}
                        id={advisory.id}
                      >
                        <Box mr={1}>
                          <Avatar
                            src={advisory.alertIcon}
                            className={classes.small}
                            variant="rounded"
                            width="24"
                            height="24"
                          />
                        </Box>
                        <p>{advisory.title}</p>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div>
                          <Divider variant="fullWidth" />
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
                          <HtmlContent>{advisory.description}</HtmlContent>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                  </Paper>
                </Grid>
              ))}
            </Grid>
            <br />
          </Container>
        )}
      </Paper>
    </div>
  )
}
