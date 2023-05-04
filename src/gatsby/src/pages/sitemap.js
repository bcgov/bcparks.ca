import React from "react"
import { graphql } from "gatsby"
import { Link, Breadcrumbs } from "@material-ui/core"

import Footer from "../components/footer"
import Header from "../components/header"
import MegaMenu from "../components/megaMenu.js"
import Seo from "../components/seo"

import "../styles/staticContent1.scss"

const SitemapPage = ({ data }) => {
  const menuContent = data?.allStrapiMenu?.nodes || []

  const breadcrumbs = [
    // TODO convert MUI breadcrumbs and use gatsby Link
    <Link key="1" href="/">
      Home
    </Link>,
    <div key="2" className="breadcrumb-text">
      Site Map
    </div>,
  ]

  return (
    <>
      <Header mode="internal" content={menuContent} />

      <div id="sr-content" className="static-content-container">
        <Breadcrumbs
          separator="›"
          aria-label="breadcrumb"
          className="p10t sm-p10"
        >
          {breadcrumbs}
        </Breadcrumbs>
        <div className="sitemap-header">Sitemap</div>
        This is the main structure of the website, subject to change.
        <MegaMenu content={menuContent} menuMode="sitemap" />
      </div>
      <Footer />
    </>
  )
}

export default SitemapPage

export const Head = () => (
  <Seo title="Site Map" />
)

export const query = graphql`
  {
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
