import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import { Box, Grid, Container } from "@material-ui/core"
import Header from "../components/header"
import Menu from "../components/menu"
import Footer from "../components/footer"
import "../styles/home.scss"

const ParksPage = ({ data }) => (
  <>
    <Helmet>
      <title>BC Parks</title>
    </Helmet>
    <Header>{data.strapiWebsites.Header}</Header>
    <Menu>{data.strapiWebsites.Navigation}</Menu>
    <Container>
      <br />
      <h1>Parks</h1>
      <Box m={4} p={3}>
        <Grid container spacing={0}>
          {data.allStrapiProtectedArea.edges.map(document => (
            <Grid item xs={12} key={document.node.id}>
              <p>
                <a
                  href={`/${
                    document.node.slug
                      ? document.node.slug
                      : document.node.protectedAreaName
                          .toLowerCase()
                          .replace(/ /g, "-")
                  }`}
                >
                  {`${document.node.protectedAreaName}`}
                </a>
              </p>
            </Grid>
          ))}
          <Grid item xs={12}></Grid>
        </Grid>
      </Box>
    </Container>
    <Footer>{data.strapiWebsites.Footer}</Footer>
  </>
)

export default ParksPage

export const query = graphql`
  {
    allStrapiProtectedArea(sort: { fields: protectedAreaName }) {
      edges {
        node {
          id
          orcs
          protectedAreaName
          typeCode
          url
          slug
        }
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
