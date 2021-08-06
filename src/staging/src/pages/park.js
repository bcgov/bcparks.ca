import React from "react"
import { graphql } from "gatsby"
import Layout from "../components/layout"

const ParkPage = ({ data }) => (
  <Layout>
    <h1>Parks</h1>
    <ul>
      {data.allStrapiProtectedArea.nodes.map(park => (
        <li key={park.id}>
          <h2>
            <a
              href={`${park.protectedAreaName
                .toLowerCase()
                .replace(/ /g, "-")}`}
            >
              {park.protectedAreaName}
            </a>
          </h2>
          <p>{park.protectedAreaName}</p>
        </li>
      ))}
    </ul>
  </Layout>
)

export default ParkPage

export const query = graphql`
  {
    allStrapiProtectedArea {
      nodes {
        id
        orcs
        protectedAreaName
        typeCode
        url
      }
    }
  }
`
