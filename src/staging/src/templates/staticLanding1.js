import React from "react"
import { graphql, useStaticQuery } from "gatsby"
import Seo from "../components/seo"
import Header from "../components/header"
import Footer from "../components/footer"
import Zone from "../components/zone"
import { Container, CssBaseline } from "@material-ui/core"
import "../styles/staticLanding1.scss"

export default function StaticLanding1({ data, pageContext }) {
  const queryData = useStaticQuery(graphql`
  {
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
  `)

  const zonesContent = pageContext?.page?.Content?.filter(c => Boolean(c.HTML))
  const meta = pageContext?.page?.Content.find(c => Boolean(c.metaTitle)) || {}
  const menuContent = queryData?.allStrapiMenus?.nodes || []

  return (
    <>
      <Seo title={meta.metaTitle} description={meta.description} keywords={meta.metaKeywords} />
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
          {queryData.strapiWebsites.Footer}
        </Footer>
      </Container>
    </>
  )
}