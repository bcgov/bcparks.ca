import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

const ParkPage = ({ data }) => (
  <Layout>
    <h1>Parks</h1>
    <ul>
      {data.allStrapiProtectedArea.edges.map(document => (
        <li key={document.node.id}>
          <h2>
            <a href={`${document.node.url}`}>
              {document.node.protectedAreaName}
            </a>
          </h2>
          <p>{document.node.protectedAreaName}</p>
        </li>
      ))}
    </ul>
  </Layout>
)

export default ParkPage

export const query = graphql`
  {
    allStrapiProtectedArea {
      edges {
        node {
          id
          orcs
          protectedAreaName
          typeCode
          url
        }
      }
    }
  }
`
