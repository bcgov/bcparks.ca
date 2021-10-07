import React from "react"
import { graphql } from "gatsby"
import SEO from "../components/seo"
import Header from "../components/header"
import Footer from "../components/footer"
import Zone from "../components/zone"
import { Container, CssBaseline } from "@material-ui/core"
import "./staticGeneral1.scss"

export default function StaticGeneral1Template({ data, pageContext }) {
  const zonesContent = pageContext?.page?.Content?.filter(c => Boolean(c.HTML))
  const meta = pageContext?.page?.Content.find(c => Boolean(c.metaTitle)) || {}
  const menuContent = data?.allStrapiMenus?.nodes || []

  return (
    <>
      <SEO title={meta.metaTitle} description={meta.description} keywords={meta.metaKeywords} />
      <CssBaseline />
      <Container id="content" className="max-width-override" fixed disableGutters>
        <Header mode="internal" content={menuContent} />
      </Container>
      <Container className="content-width-override" fixed disableGutters>
        <div id="main">
          {zonesContent.map(content => <Zone key={content.id} zoneID={`Zone${content.id}`} Content={content} />)}
        </div>
      </Container>
      <Container className="max-width-override" fixed disableGutters>
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
    allStrapiMenus(
      sort: { fields: order, order: ASC }
      filter: { show: { eq: true } }
    ) {
      nodes {
        strapiId
        title
        url
        order
        id
        strapiChildren {
          id
          title
          url
          order
          parent
        }
        strapiParent {
          id
          title
        }
      }
    }
  }
`
