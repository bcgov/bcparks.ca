import React, { useState } from "react"
import PropTypes from "prop-types"
import { parseJSON, format } from "date-fns"
import {
  Box,
  Button,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Divider,
  Grid,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"
import Heading from "./heading"
import HtmlContent from "./htmlContent"
import Spacer from "./spacer"

import blueAlertIcon from "../../images/park/blue-alert-64.png"
import yellowAlertIcon from "../../images/park/yellow-alert-64.png"
import redAlertIcon from "../../images/park/red-alert-64.png"

const useStyles = makeStyles(theme => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
    marginTop: 5,
    marginRight: 5,
  },
}))


const formatDate = (isoDate) => {
  return isoDate ? format(parseJSON(isoDate), "MMMM dd, yyyy") : ""
}

export default function AdvisoryDetails({ advisories }) {
  const classes = useStyles()

  let expandedsInitial = []
  advisories.forEach((advisory, index) => {
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
    advisories.forEach((advisory, index) => {
      expandeds[index] = isAllExpanded
    })
    setExpandeds(expandeds)
  }

  const advisoriesWithFormatting = advisories.map(advisory => {
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
        alertColorCss = "blue-alert"
    }

    return {
      alertIcon,
      alertColorCss,  
      formattedAdvisoryDate: formatDate(advisory.advisoryDate),
      formattedEffectiveDate: formatDate(advisory.effectiveDate),
      formattedEndDate: formatDate(advisory.endDate),
      ...advisory
    }
  })

  return (
    <Grid
      item
      xs={12}
      id="park-advisory-details-container"
      className="anchor-link"
    >
      <Paper elevation={0}>
        <Grid container>
          <Grid item xs={6}>
            <Heading>{`Advisories (${advisories.length})`}</Heading>
          </Grid>
          <Grid
            item
            xs={6}
            container
            justifyContent="flex-end"
            alignItems="flex-start"
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
                  {allExpanded ? "[collapse all]" : "[expand all]"}
                </Button>
              )}
            </Box>
          </Grid>
        </Grid>
        {advisories.length === 0 && (
          <HtmlContent>There are no reported advisories for this park</HtmlContent>
        )}
        {advisories.length > 0 && (
          <Grid container spacing={1}>
            {advisoriesWithFormatting.map((advisory, index) => (
              <Grid key={advisory.id} item xs={12}>
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
                    <HtmlContent>{advisory.title}</HtmlContent>
                  </AccordionSummary>
                  <AccordionDetails>
                    <div className="advisory-content">
                      <HtmlContent>{advisory.description}</HtmlContent>
                      {advisory.isEffectiveDateDisplayed &&
                        advisory.formattedEffectiveDate && (
                          <>
                            <br />
                            <p>
                              In effect {advisory.formattedEffectiveDate}
                              {advisory.isEndDateDisplayed && advisory.formattedEndDate && (
                                <>
                                  {" to "}
                                  {advisory.formattedEndDate}
                                </>
                              )}
                            </p>
                          </>
                        )}
                      {advisory.isAdvisoryDateDisplayed &&
                        advisory.formattedAdvisoryDate && (
                          <>
                            <br />
                            <p>Posted {advisory.formattedAdvisoryDate}</p>
                          </>
                        )}
                      <br />
                      <Divider />
                    </div>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
          </Grid>
        )}
        <Spacer />
      </Paper>
    </Grid>
  )
}

AdvisoryDetails.propTypes = {
  advisories: PropTypes.array.isRequired,
};
