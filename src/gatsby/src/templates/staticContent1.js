import React, { useRef } from "react"
import { useStaticQuery, graphql } from "gatsby"
import useScrollSpy from "react-use-scrollspy"

import Acknowledgment from "../components/acknowledgment"
import Breadcrumbs from "../components/breadcrumbs"
import Header from "../components/header"
import Footer from "../components/footer"
import HtmlContent from "../components/htmlContent"
import Seo from "../components/seo"
import PageContent from "../components/pageContent/pageContent"
import PageMenu from "../components/pageContent/pageMenu"
import ScrollToTop from "../components/scrollToTop"

import { renderBreadcrumbs } from "../utils/helpers";

import "../styles/staticContent1.scss"

const slugify = require("slugify")

export default function StaticContent1({ pageContext }) {
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
          show
          strapi_children {
            id
            title
            url
            order
            show
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
  const filteredContents = pageContents.filter(c =>
    c.strapi_component !== "parks.page-header" &&
    c.strapi_component !== "parks.seo") || []
  const headerContent = pageContents.find(c => c.strapi_component === "parks.page-header") || {}
  // New non-repeatable page header component
  const pageHeader = page?.PageHeader || null
  const hasPageHeader =
    pageHeader?.pageTitle &&
    pageHeader?.introHtml?.data?.introHtml.length > 0
  const hasPageHeaderIntro = (
    pageHeader?.introHtml?.data?.introHtml.length > 0 || headerContent?.introHtml?.data?.introHtml.length > 0)
  const sectionContents = pageContents.filter(c => c.strapi_component === "parks.page-section") || []
  const hasSections = sectionContents.length > 0
  const breadcrumbs = renderBreadcrumbs(menuContents, pageContext?.page)

  let sectionRefs = [
    // Creating 12 refs for scrollspy
    // TODO create dynamically without causing error
    // these are created whether or not there are sections
    // as useRef cannot be used conditionally
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
    useRef(null),
  ]

  let pageSections = []
  if (hasSections) {
    let firstSectionTitle = page.Title
    if (!firstSectionTitle) {
      const slug = page?.Slug
      const current = menuContents.find(c => c.url === slug)
      firstSectionTitle = current.title
    }
    pageSections = [
      { sectionIndex: 0, display: firstSectionTitle, link: "#", visible: false },
    ]

    let sectionIndex = 0
    for (const s of sectionContents) {
      sectionIndex += 1
      s.sectionIndex = sectionIndex
      // each section needs an index to be used for in-page navigation
      // and scrollspy highlighting
      const titleId = slugify(s.sectionTitle).toLowerCase()
      pageSections.push({
        sectionIndex: sectionIndex,
        display: s.sectionTitle,
        link: "#" + titleId,
        visible: true
      })
    }
  }

  // activeSection will be the index of the on-screen section
  // this is setup whether or not there are sections,
  // as useScrollSpy cannot be used conditionally
  const activeSection = useScrollSpy({
    sectionElementRefs: sectionRefs,
    defaultValue: 0,
    offsetPx: -100,
  })

  return (
    <>
      <div className="max-width-override" ref={sectionRefs[0]}>
        <Header mode="internal" content={menuContents} />
      </div>
      <div className="static-content--header">
        <div id="main-content" tabIndex={-1} className="page-breadcrumbs">
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>
        {/* Display new non-repeatable pageHeader component if exists */}
        {/* Otherwise, display old repeatable seo/pageHeader component */}
        {(hasPageHeader && hasPageHeader !== null) ? (
          <>
            {pageHeader?.imageUrl &&
              <div className="header-image-wrapper">
                <img
                  src={pageHeader.imageUrl}
                  alt={pageHeader.pageTitle}
                />
              </div>
            }
            <h1 className="header-title">
              {pageHeader.pageTitle}
            </h1>
          </>
        ) : (
          <>
            {headerContent?.imageUrl &&
              <div className="header-image-wrapper">
                <img
                  src={headerContent.imageUrl}
                  alt={headerContent.pageTitle || page.Title}
                />
              </div>
            }
            <h1 className="header-title">
              {headerContent.pageTitle || page.Title}
            </h1>
          </>
        )}
      </div>
      <div className="static-content-container">
        <div className="page-content-wrapper">
          {hasSections ? (
            <div className="row g-0">
              <div className="page-menu--desktop col-md-4 col-12 d-none d-md-block">
                <PageMenu
                  pageSections={pageSections}
                  activeSection={activeSection}
                  menuStyle="nav"
                />
              </div>
              <div className="page-content col-md-8 col-12">
                {/* Display new non-repeatable pageHeader component if exists */}
                {/* Otherwise, display old repeatable seo/pageHeader component */}
                {hasPageHeaderIntro && (
                  <div className="header-content">
                    {(hasPageHeader && hasPageHeader !== null) ? (
                      <HtmlContent>{pageHeader.introHtml.data.introHtml}</HtmlContent>
                    ) : (
                      <HtmlContent>{headerContent.introHtml.data.introHtml}</HtmlContent>
                    )}
                  </div>
                )}
                {filteredContents.map(content => (
                  <div
                    ref={sectionRefs[content.sectionIndex]}
                    key={content.strapi_component + "-" + content.id}
                  >
                    <PageContent
                      contentType={content.strapi_component}
                      content={content}
                    ></PageContent>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              {/* Display new non-repeatable pageHeader component if exists */}
              {/* Otherwise, display old repeatable seo/pageHeader component */}
              {hasPageHeaderIntro && (
                <div className="header-content">
                  {(hasPageHeader && hasPageHeader !== null) ? (
                    <HtmlContent>{pageHeader.introHtml.data.introHtml}</HtmlContent>
                  ) : (
                    <HtmlContent>{headerContent.introHtml.data.introHtml}</HtmlContent>
                  )}
                </div>
              )}
              {filteredContents.map(content => (
                <PageContent
                  contentType={content.strapi_component}
                  content={content}
                  key={content.strapi_component + "-" + content.id}
                ></PageContent>
              ))}
            </div>
          )}
        </div>
      </div >
      <Acknowledgment  />
      <ScrollToTop />
      <Footer />
    </>
  )
}

export const Head = ({ pageContext }) => {
  const { page } = pageContext
  const components = page?.Content || []
  const headerContent = components.find(c => c.strapi_component === "parks.page-header") || {}
  // New non-repeatable page header component
  const pageHeader = page?.PageHeader || null
  const meta = components.find(c => c.strapi_component === "parks.seo") || {}
  // New non-repeatable seo component
  const seo = page?.Seo || null

  return (
    // Display new non-repeatable seo/pageHeader component if exists
    // Otherwise, display old repeatable seo/pageHeader component
    <Seo
      title={seo?.metaTitle || meta?.metaTitle || pageHeader?.pageTitle || headerContent?.pageTitle || page?.Title}
      description={seo?.metaDescription || meta?.metaDescription}
      keywords={seo?.metaKeywords || meta?.metaKeywords}
      image={pageHeader?.imageUrl || headerContent?.imageUrl}
    />
  )
}
