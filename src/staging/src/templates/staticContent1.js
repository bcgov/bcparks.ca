import React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import Header from "../components/header"
import Footer from "../components/footer"
import Zone from "../components/zone"
import Seo from "../components/seo"
import { Container, Breadcrumbs } from "@material-ui/core"

import "../styles/staticContent1.scss"

export default function StaticContent1({ pageContext }) {
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
      sort: {fields: order, order: ASC}
      filter: {show: {eq: true}}
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
  }`)

  const zonesContent = pageContext?.page?.Content?.filter(c => Boolean(c.strapi_component === 'parks.html-area'))
  const meta = pageContext?.page?.Content.find(c => Boolean(c.strapi_component === 'parks.seo')) || {}
  const menuContent = queryData?.allStrapiMenus?.nodes || []

  return (
      <>
        <Seo title={meta.metaTitle} description={meta.description} keywords={meta.metaKeywords} />
        <Container id="header" className="max-width-override" fixed disableGutters>
          <Header mode="internal" content={menuContent} />
        </Container>
        <Container id="indigenous-relations" className="content-width-override content" fixed>
          <Breadcrumbs
            separator="›"
            aria-label="breadcrumb"
          >
            {renderBreadcrumbs(menuContent, pageContext?.page)}
          </Breadcrumbs>
          <div className="zone">
              {zonesContent.map(content => <Zone className="content-zone" key={content.id} zoneID={`Zone${content.id}`} Content={content} />)}
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

function renderBreadcrumbs(menuContent, pageContext) {
  let current = menuContent.find(mc => mc.url === pageContext.Slug)
  const breadcrumbItems = [
    <div key={pageContext.id} className="breadcrumb-text">
      {current?.title}
    </div>
  ]
  let parent = menuContent.find(mc => mc.strapiId === current?.strapiParent?.id)
  return addItems(parent, menuContent, breadcrumbItems)

  function addItems(parent, menuContent, breadcrumbItems) {
    if (parent) {
      breadcrumbItems.push(
        <Link key={parent.strapiId} to={parent?.url ?? '/'}>{parent.title}</Link>
      )
      parent = menuContent.find(mc => mc.strapiId === parent?.strapiParent?.id)
      return addItems(parent, menuContent, breadcrumbItems)
    }
    return breadcrumbItems.reverse()
  }
}

