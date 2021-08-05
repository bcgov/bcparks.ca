import React from "react"
import { Link, graphql } from "gatsby"
import Header from "../components/header"
import Menu from "../components/menu"
import Footer from "../components/footer"
import "../styles/search.scss"

export const query = graphql`
  query {
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

export default function Home({ data }) {
  return (
    <div>
      <Header>{data.strapiWebsites.Header}</Header>
      <Menu>{data.strapiWebsites.Navigation}</Menu>

      <div id="search-results">Hello</div>
      <Footer>{data.strapiWebsites.Footer}</Footer>
    </div>
  )
}
