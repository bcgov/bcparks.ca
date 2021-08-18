import React from "react"
import { graphql } from "gatsby"
import { AppBar, Box, Grid, Paper } from "@material-ui/core"

const ParksPage = ({ data }) => (
  <>
    <AppBar position="static">
      <Box m={2}>
        <h1>BC Parks - Staging Page</h1>
      </Box>
    </AppBar>
    <Box m={4} p={4}>
      <Paper>
        <Box m={4} p={3}>
          <Grid container spacing={3}>
            {data.allStrapiProtectedArea.edges.map(document => (
              <Grid item xs={12} key={document.node.id}>
                <Box>
                  <h3>
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
                  </h3>
                </Box>
              </Grid>
            ))}
            <Grid item xs={12}></Grid>
          </Grid>
        </Box>
      </Paper>
    </Box>
  </>
)

export default ParksPage

export const query = graphql`
  {
    allStrapiProtectedArea(
      filter: { orcs: { lt: 50 } }
      sort: { fields: protectedAreaName }
    ) {
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
  }
`
