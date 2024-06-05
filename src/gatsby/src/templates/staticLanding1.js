import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Breadcrumbs from "../components/breadcrumbs"
import Header from "../components/header"
import Footer from "../components/footer"
import HTMLArea from "../components/HTMLArea"
import Seo from "../components/seo"
import MainSearch from "../components/search/mainSearch"
import PageContent from "../components/pageContent/pageContent"
import ScrollToTop from "../components/scrollToTop"

import { renderBreadcrumbs } from "../utils/helpers";

import "../styles/staticLanding1.scss"

const LandingPage = ({ pageContext }) => {
  const queryData = useStaticQuery(graphql`
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
  `)

  const menuContents = queryData?.allStrapiMenu?.nodes || []
  const { page } = pageContext
  const pageContents = page?.Content || []
  const introContents = pageContents.filter(c => c.strapi_component === "parks.html-area")
  const linkContents = pageContents.filter(c => c.strapi_component === "parks.link-card")
  // New non-repeatable page header component
  const pageHeader = page?.PageHeader || null
  const breadcrumbs = renderBreadcrumbs(menuContents, pageContext?.page)
  const hasPageHeader =
    pageHeader?.pageTitle &&
    pageHeader?.imageUrl &&
    pageHeader?.introHtml.data.introHtml.length > 0

  return (
    <>
      <Header mode="internal" content={menuContents} />
      <div id="main-content"></div>
      <div id="intro-content" className="bcp-landing-intro">
        {/* Display new non-repeatable pageHeader component if exists */}
        {/* Otherwise, display old repeatable pageHeader component */}
        {(hasPageHeader && hasPageHeader !== null) ? (
          <>
            <div
              className="bcp-landing-intro__image"
              style={{ backgroundImage: `url(${pageHeader.imageUrl})` }}
            >
            </div>
            <div className="bcp-landing-intro__text">
              <div className="container">
                <div className="row d-none d-lg-block">
                  <div className="col">
                    <div id="main-content" tabIndex={-1}>
                      <Breadcrumbs breadcrumbs={breadcrumbs} />
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <h1>{pageHeader.pageTitle}</h1>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <HTMLArea isVisible>
                      {pageHeader.introHtml.data.introHtml}
                    </HTMLArea>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          introContents.length > 0 &&
          introContents.map(content => (
            <PageContent
              key={content.id}
              contentType={content.strapi_component}
              content={content}
            />
          ))
        )}
      </div>
      {linkContents.length > 0 && (
        <div id="link-content" className="bcp-landing-links">
          <div className="container">
            {linkContents.map(content => (
              <PageContent
                key={content.id}
                contentType={content.strapi_component}
                content={content}
              />
            ))}
          </div>
        </div>
      )}
      <div className="bcp-landing-park-search d-none d-lg-block">
        <div className="container">
          <div className="row no-gutters">
            <div className="col">
              <StaticImage
                src="../images/landing/footer-find-your-next-adventure.png"
                alt="Two hikers filming in a BC Park"
              />
            </div>
            <div className="col">
              <MainSearch hasCityNameSearch={false} />
            </div>
          </div>
        </div>
      </div>
      <ScrollToTop />
      <Footer />
    </>
  )
}

export default LandingPage

export const Head = ({ pageContext }) => {
  const { page } = pageContext
  const pageContents = page?.Content || []
  const meta = pageContents.find(c => c.strapi_component === "parks.seo") || {}
  // New non-repeatable seo component
  const seo = page?.Seo || null

  return (
    // Display new non-repeatable seo component if exists
    // Otherwise, display old repeatable seo component
    <Seo
      title={seo?.metaTitle || meta?.metaTitle}
      description={seo?.metaDescription || meta?.metaDescription}
      keywords={seo?.metaKeywords || meta?.metaKeywords}
    />
  )
}
