import React from "react"
import { graphql } from "gatsby"
import MegaMenu from "../components/megaMenu.js"
import { Helmet } from "react-helmet"
import Header from "../components/header"
import Footer from "../components/footer"
import "../styles/staticContent1.scss"


const SitemapPage = ({ data }) => {

  const menuContent = data?.allStrapiMenus?.nodes || []


  return (
    <>
      <Helmet>
        <title>BC Parks - Site Map</title>
      </Helmet>
      <Header mode="internal" content={menuContent} />
      <div className="static-content-container">
        <div className="sitemap-header">Sitemap</div>
        This is the main structure of the website, subject to change.
        <MegaMenu content={menuContent} menuMode="sitemap" />
      </div>
      <Footer>{data.strapiWebsites.Footer}</Footer>
    </>
  )
}

export default SitemapPage

export const query = graphql`
  {
    strapiWebsites(Name: { eq: "BCParks.ca" }) {
      Footer
    }
    strapiPages(Slug: { eq: "/beta-landing" }) {
      id
      Slug
      Content
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
