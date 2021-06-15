import React from "react"
import { Link, graphql } from "gatsby"
import Layout from "../components/layout"

const PublicAdvisoryPage = ({ data }) => (
  <Layout>
    <h1>Public Advisories</h1>
    <ul>
      {data.allStrapiPublicAdvisory.edges.map(document => (
        <li key={document.node.id}>
          <h2>
            <Link to={`${document.node.id}`}>{document.node.title}</Link>
          </h2>
          <p>{document.node.description}</p>
          <p>{document.node.advisoryStatus.advisoryStatus}</p>
        </li>
      ))}
    </ul>
  </Layout>
)

export default PublicAdvisoryPage

export const query = graphql`
  {
    allStrapiPublicAdvisory {
      edges {
        node {
          id
          title
          description
          advisoryStatus {
            advisoryStatus
          }
          eventType {
            eventType
          }
        }
      }
    }
  }
`
