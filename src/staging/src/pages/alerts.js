import React from "react"
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
import MoreVertIcon from "@material-ui/icons/MoreVert"

import blueAlertIcon from "../images/park/blue-alert-64.png"
import yellowAlertIcon from "../images/park/yellow-alert-64.png"
import redAlertIcon from "../images/park/red-alert-64.png"

import "../styles/home.scss"

const useStyles = makeStyles(theme => ({
  small: {
    width: theme.spacing(3),
    height: theme.spacing(3),
  },
  chip: {
    margin: theme.spacing(0.2),
  },
  title: {
    fontSize: "0.8rem",
    fontWeight: "bold",
  },
  subTitle: {
    color: "#696969",
    fontSize: "0.7rem",
  },
}))

const PublicAdvisoryPage = ({ data }) => {
  const classes = useStyles()

  const advisories = data.allStrapiPublicAdvisory.nodes.map(advisory => {
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
  const menuContent = data?.allStrapiMenus?.nodes || []

  return (
    <>
      <Helmet>
        <title>BC Parks | Public Advisories</title>
      </Helmet>
      <Header mode="internal" content={menuContent} />
      <Menu>{data.strapiWebsites.Navigation}</Menu>
      <Container>
        <br />
        <h1>Public Advisories</h1>
        <span>
          Updated Monday to Friday from 8:30 am to 4:30 pm, excluding statutory
          holidays.
        </span>
        <span>There are {advisories.length} advisories in effect.</span>
        <br />
        <Grid container spacing={1}>
          {advisories.map((advisory, index) => (
            <Grid item xs={12} key={advisory.id}>
              <Accordion className={advisory.alertColorCss}>
                <AccordionSummary
                  expandIcon={<MoreVertIcon />}
                  aria-controls={advisory.title}
                  id={advisory.id}
                >
                  <Box mr={1}>
                    <Avatar
                      src={advisory.alertIcon}
                      className={classes.small}
                      variant="circle"
                      width="24"
                      height="24"
                    />
                  </Box>
                  <div>
                    {advisory.eventType && (
                      <div className={classes.title}>
                        {advisory.eventType.eventType}
                      </div>
                    )}
                    {advisory.advisoryDate && (
                      <div className={classes.subTitle}>
                        {advisory.advisoryDate}
                      </div>
                    )}

                    {advisory.protectedAreas.length > 0 &&
                      advisory.protectedAreas.map((par, index) => (
                        <Chip
                          size="small"
                          variant="outlined"
                          component="a"
                          className={classes.chip}
                          href={`/${
                            par.slug
                              ? par.slug
                              : par.protectedAreaName
                                  .toLowerCase()
                                  .replace(/ /g, "-")
                          }`}
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
                    <HTMLArea isVisible>{advisory.description}</HTMLArea>
                  </div>
                </AccordionDetails>
              </Accordion>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Footer>{data.strapiWebsites.Footer}</Footer>
    </>
  )
}

export default PublicAdvisoryPage

export const query = graphql`
  {
    allStrapiPublicAdvisory(sort: { fields: advisoryDate, order: DESC }) {
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
          slug
        }
        accessStatus {
          color
          accessStatus
          precedence
        }
        eventType {
          eventType
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
    allStrapiMenus(
      sort: {fields: order, order: ASC}
      filter: {show: {eq: true}}
    ) {
      nodes {
        strapiId
        title
        url
        order
        id
        strapiChildren {
          id
          title
          url
          order
          parent
        }
        strapiParent {
          id
          title
        }
      }
    }
  }
`
