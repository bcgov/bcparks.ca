import React from "react"
import { graphql } from "gatsby"
import { Helmet } from "react-helmet"
import { Link, Breadcrumbs } from "@material-ui/core"

import Footer from "../components/footer"
import Header from "../components/header"
import MegaMenu from "../components/megaMenu.js"

import "../styles/staticContent1.scss"

const SitemapPage = ({ data }) => {
  const menuContent = data?.allStrapiMenus?.nodes || []

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
      <Helmet>
        <title>Site Map | BC Parks</title>
      </Helmet>
      <Header mode="internal" content={menuContent} />

      <div className="static-content-container">
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
      {/* <Footer>{data.strapiWebsites.Footer}</Footer> */}
    </>
  )
}

export default SitemapPage

export const query = graphql`
  {
    # strapiWebsites(Name: { eq: "BCParks.ca" }) {
    #   Footer
    # }
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
        imgUrl
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
