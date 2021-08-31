import React from "react"
import { graphql } from "gatsby"
import SEO from "../components/seo"
import Header from "../components/header"
import Menu from "../components/Menu"
import Footer from "../components/footer"
import Zone from "../components/zone"
import { Container, CssBaseline } from "@material-ui/core"
import "./staticGeneral1.scss"

export default function StaticGeneral1Template({ data, pageContext }) {
  const zonesContent = pageContext?.page?.Content?.filter(c => Boolean(c.HTML))
  const meta = pageContext?.page?.Content.find(c => Boolean(c.metaTitle)) || {}

  return (
    <>
      <SEO title={meta.metaTitle} description={meta.description} keywords={meta.metaKeywords} />
      <CssBaseline />
      <Container id="content" maxWidth={false} disableGutters>
        <Header>
          {data.strapiWebsites.Header}
        </Header>
        <Menu>
          {data.strapiWebsites.Navigation}
        </Menu>
        <div id="main">
          {zonesContent.map(content => <Zone key={content.id} zoneID={`Zone${content.id}`} Content={content} />)}
        </div>
        <Footer>
          {data.strapiWebsites.Footer}
        </Footer>
      </Container>
    </>
  )
}

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
    allStrapiPages(filter: {Template: {eq: "StaticGeneral1"} }) {
      totalCount
      nodes {
        id
        Slug
        Template
        Content
      }
    }
  }
`
