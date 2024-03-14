import React from "react"
import { graphql } from "gatsby"
import { Link, Breadcrumbs } from "@mui/material"

import Footer from "../components/footer"
import Header from "../components/header"
import MegaMenu from "../components/megaMenu.js"
import Seo from "../components/seo"
import ScrollToTop from "../components/scrollToTop"

import "../styles/staticContent1.scss"

const SitemapPage = ({ data }) => {
  const menuContent = data?.allStrapiMenu?.nodes || []

  const breadcrumbs = [
    // TODO convert MUI breadcrumbs and use gatsby Link
    <Link key="1" href="/" underline="hover">
      Home
    </Link>,
    <div key="2" className="breadcrumb-text">
      Site map
    </div>,
  ]

  return (
    <>
      <ScrollToTop />
      <Header mode="internal" content={menuContent} />
      <div id="main-content" className="static-content--header unique-page--header page-breadcrumbs">
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {breadcrumbs}
        </Breadcrumbs>
      </div>
      <div className="static-content-container">
        <h1 className="header-title">
          Site map
        </h1>
      </div>
      <div className="static-content-container">
        <div className="intro-text-container">
          <p>
            This is the main structure of the website, subject to change.
          </p>
        </div>
      </div>
      <div className="static-content-container">
        <MegaMenu content={menuContent} menuMode="sitemap" />
      </div>
      <Footer />
    </>
  )
}

export default SitemapPage

export const Head = () => (
  <Seo title="Site map" />
)

export const query = graphql`
  {
    allStrapiMenu(
      sort: {order: ASC},
      filter: {show: {eq: true}}
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
