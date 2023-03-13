import React from "react"
import { graphql } from "gatsby"
import { Box, Grid, Container } from "@material-ui/core"

import Footer from "../components/footer"
import Header from "../components/header"
import Seo from "../components/seo"

import "../styles/home.scss"

const ParksPage = ({ data }) => {
  const parks = data.allStrapiProtectedArea.nodes

  return (
    <>
      <Header />
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
  }
`
