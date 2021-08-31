import React, { useState } from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import Header from "../components/header"
import Menu from "../components/menu"
import Footer from "../components/footer"
import HTMLArea from "../components/HTMLArea"

import {
  Box,
  Chip,
  Container,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Avatar,
  Divider,
  Grid,
} from "@material-ui/core"
import { makeStyles } from "@material-ui/core/styles"
import ExpandMoreIcon from "@material-ui/icons/ExpandMore"

import blueAlertIcon from "../images/park/blue-alert-64.png"
import yellowAlertIcon from "../images/park/yellow-alert-64.png"
import redAlertIcon from "../images/park/red-alert-64.png"

const useStyles = makeStyles(theme => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
}))

const PublicAdvisoryPage = ({ data }) => {
  const classes = useStyles()

  const advisoryData = data.allStrapiPublicAdvisory.nodes

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
        alertColorCss = "blue-alert"
    }
    advisory.alertIcon = alertIcon
    advisory.alertColorCss = alertColorCss
    return advisory
  })

  return (
    <>
      <Helmet>
        <title>BC Parks | Public Advisories</title>
      </Helmet>
      <Header>{data.strapiWebsites.Header}</Header>
      <Menu>{data.strapiWebsites.Navigation}</Menu>
      <Container>
        <br />
        <h1>Public Advisories</h1>
        <Box m={4} p={3}>
          <Grid container spacing={1}>
            {advisories.map((advisory, index) => (
              <Grid item xs={12} key={advisory.id}>
                <Accordion className={advisory.alertColorCss}>
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
                    <div>
                      {advisory.protectedAreas.length > 0 &&
                        advisory.protectedAreas.map((par, index) => (
                          <Chip
                            variant="outlined"
                            key={index}
                            label={par.protectedAreaName}
                          />
                        ))}
                      <HTMLArea isVisible>{advisory.title}</HTMLArea>
                    </div>
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
                              {advisory.isEndDateDisplayed && advisory.endDate && (
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
                      <HTMLArea isVisible>{advisory.description}</HTMLArea>
                    </div>
                  </AccordionDetails>
                </Accordion>
              </Grid>
            ))}
            <Grid item xs={12}></Grid>
          </Grid>
        </Box>
      </Container>
      <Footer>{data.strapiWebsites.Footer}</Footer>
    </>
  )
}

export default PublicAdvisoryPage

export const query = graphql`
  {
    allStrapiPublicAdvisory(sort: { fields: urgency___sequence, order: DESC }) {
      nodes {
        id
        title
        description
        isAdvisoryDateDisplayed
        isEffectiveDateDisplayed
        isEndDateDisplayed
        isReservationsAffected
        isSafetyRelated
        urgency {
          code
          color
          sequence
          urgency
        }
        protectedAreas {
          orcs
          protectedAreaName
          hasCampfireBan
          hasSmokingBan
        }
        accessStatus {
          color
          accessStatus
          precedence
        }
        advisoryDate(formatString: "MMMM DD, YYYY")
        advisoryNumber
        dcTicketNumber
        effectiveDate(formatString: "MMMM DD, YYYY")
        endDate(formatString: "MMMM DD, YYYY")
        expiryDate(formatString: "MMMM DD, YYYY")
      }
    }
    strapiWebsites(Name: { eq: "BCParks.ca" }) {
      Footer
      Header
      Name
      Navigation
      id
      homepage {
        id
        Template
        Content {
          id
          strapi_component
          HTML
        }
      }
    }
  }
`
