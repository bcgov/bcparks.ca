import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

const ParksPage = ({ data }) => (
  <Layout>
    <h1>Parks</h1>
    <ul>
      {data.allStrapiProtectedArea.edges.map(document => (
        <li key={document.node.id}>
          <a
            href={`${
              document.node.slug
                ? document.node.slug
                : document.node.protectedAreaName
                    .toLowerCase()
                    .replace(/ /g, "-")
            }`}
          >
            {`${document.node.protectedAreaName} - ${document.node.orcs}`}
          </a>
        </li>
      ))}
    </ul>
  </Layout>
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
