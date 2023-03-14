import React from "react"
import { graphql } from "gatsby"

import Footer from "../components/footer"
import Header from "../components/header"
import HTMLArea from "../components/HTMLArea"
import Seo from "../components/seo"

import "../styles/betaLanding.scss"

const IntroPage = ({ data }) => {
  const pageContent = data?.strapiPage?.Content || []
  const menuContent = data?.allStrapiMenu?.nodes || []

  const htmlContent = pageContent.find(
    item => item.strapi_component === "parks.html-area"
  )

  return (
    <>
      <div className="max-width-override">
        <Header mode="internal" content={menuContent} />
      </div>

      {htmlContent && (
        <div className="intro-page">
          <HTMLArea isVisible={true}>{htmlContent.HTML.data.HTML}</HTMLArea>
        </div>
      )}

      <div className="max-width-override">
        <Footer />
      </div>
    </>
  )
}

export default IntroPage

export const Head = ({data}) => {
  const pageContent = data?.strapiPage?.Content || []
  const seoContent = pageContent.find(
    item => item.strapi_component === "parks.seo"
  )

  return (
    seoContent && (
      <Seo
        title={seoContent.metaTitle}
        description={seoContent.description}
        keywords={seoContent.metaKeywords}
      />
    )
  )
}

export const query = graphql`
  {
    strapiPage(Slug: { eq: "/beta-landing" }) {
      id
      Slug
      Content {
        ... on STRAPI__COMPONENT_PARKS_HTML_AREA {
          id
          strapi_component
          HTML {
            data {
              HTML
            }
          }
        }
        ... on STRAPI__COMPONENT_PARKS_SEO {
          id
          strapi_component
          metaTitle
          metaKeywords
          metaDescription
        }
      }
    }
    allStrapiMenu(
      sort: { fields: order, order: ASC }
      filter: { show: { eq: true } }
    ) {
      nodes {
        strapi_id
        title
        url
        order
        id
        strapi_children {
          id
          title
          url
          order
        }
        strapi_parent {
          id
          title
        }
      }
    }
  }
`
