import React from "react"
import { graphql } from "gatsby"
import { Box, Grid, Container } from "@material-ui/core"

import Footer from "../components/footer"
import Header from "../components/header"
import Seo from "../components/seo"

import "../styles/home.scss"

const ParksPage = ({ data }) => {
  const menuContent = data?.allStrapiMenu?.nodes || []
  const parks = data.allStrapiProtectedArea.nodes

  return (
    <>
      <Header mode="internal" content={menuContent} />
      <Container>
        <br />
        <h1>Parks</h1>
        <Box m={4} p={3}>
          <Grid container spacing={0}>
            {parks.map(park => (
              <Grid item xs={12} key={park.id}>
                <p>
                  <a
                    href={`/${(park.slug
                      ? park.slug
                      : park.protectedAreaName
                        .toLowerCase()
                        .replace(/ /g, "-"))
                      .replace(/\/$|$/, `/`)
                      }`}
                  >
                    {`${park.protectedAreaName}`}
                  </a>
                </p>
              </Grid>
            ))}
            <Grid item xs={12}></Grid>
          </Grid>
        </Box>
      </Container>
      <Footer />
    </>
  )
}

export default ParksPage

export const Head = () => (
  <Seo title="Parks" />
)

export const query = graphql`
  {
    allStrapiProtectedArea(filter: {isDisplayed: {eq: true}}, sort: { fields: protectedAreaName }) {
      nodes {
        id
        slug
        protectedAreaName
      }
    }
    allStrapiMenu(
      sort: { fields: order, order: ASC }
      filter: { show: { eq: true } }
    ) {
      nodes {
        strapi_id
        title
        url
        order
        id
        strapi_children {
          id
          title
          url
          order
        }
        strapi_parent {
          id
          title
        }
      }
    }
  }
`
