import React from "react"
import { graphql, Link } from "gatsby"

import Breadcrumbs from "../components/breadcrumbs"
import Footer from "../components/footer"
import Header from "../components/header"
import MegaMenu from "../components/megaMenu.js"
import Seo from "../components/seo"
import ScrollToTop from "../components/scrollToTop"

import "../styles/staticContent1.scss"

const SitemapPage = ({ data }) => {
  const menuContent = data?.allStrapiMenu?.nodes || []

  const breadcrumbs = [
    <Link key="1" to="/">
      Home
    </Link>,
    <div key="2" className="breadcrumb-text">
      Site map
    </div>,
  ]

  return (
    <>
      <Header mode="internal" content={menuContent} />
      <div id="main-content" className="static-content--header unique-page--header page-breadcrumbs">
        <Breadcrumbs breadcrumbs={breadcrumbs} />
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
      <ScrollToTop />
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
