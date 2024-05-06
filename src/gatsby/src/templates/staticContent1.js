import React, { useRef } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Breadcrumbs } from "@mui/material"
import useScrollSpy from "react-use-scrollspy"

import Footer from "../components/footer"
import Header from "../components/header"
import HTMLArea from "../components/HTMLArea"
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

  const menuContent = queryData?.allStrapiMenu?.nodes || []
  const { page } = pageContext
  const pageContent = page?.Content || []
  const filteredContent = pageContent.filter(c =>
    c.strapi_component !== "parks.page-header" &&
    c.strapi_component !== "parks.seo") || []
  const headerContent = pageContent.find(c => c.strapi_component === "parks.page-header") || {}
  const pageHeader = page?.PageHeader || null
  const hasPageHeader = (pageHeader.pageTitle !== undefined || headerContent.pageTitle !== undefined)


  const sections = pageContent.filter(c => c.strapi_component === "parks.page-section") || []
  const hasSections = sections.length > 0

  // create page sections for sticky sidebar menu
  // and scrollspy highlighting

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
      // get page title, using same method as renderBreadcrumbs
      // this assume the page is in the menu, use metaTitle from SEO otherwise
      const slug = page?.Slug
      const current = menuContent.find(mc => mc.url === slug)
      firstSectionTitle = current.title
    }
    pageSections = [
      { display: firstSectionTitle, sectionIndex: 0, id: 0, link: "#" },
    ]

    let sectionIndex = 0
    for (const s of sections) {
      sectionIndex += 1
      // each section needs an index to be used for in-page navigation
      // and scrollspy highlighting
      const titleId = slugify(s.sectionTitle).toLowerCase()
      s.sectionIndex = sectionIndex
      pageSections.push({
        display: s.sectionTitle,
        sectionIndex: sectionIndex,
        id: s.id,
        link: "#" + titleId,
        visible: true // Default
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
        <Header mode="internal" content={menuContent} />
      </div>
      <div className="static-content--header">
        <div id="main-content" className="page-breadcrumbs">
          <Breadcrumbs separator="›" aria-label="breadcrumb">
            {renderBreadcrumbs(menuContent, page)}
          </Breadcrumbs>
        </div>
        {/* page header */}
        {pageHeader ? (
          <>
            <div className="header-image-wrapper">
              <img
                src={pageHeader.imageUrl}
                alt={pageHeader.pageTitle}
              />
            </div>
            <h1 className="header-title">
              {pageHeader.pageTitle}
            </h1>
          </>
        ) : (
          <>
            <div className="header-image-wrapper">
              <img
                src={headerContent.imageUrl}
                alt={headerContent.pageTitle || page.Title}
              />
            </div>
            <h1 className="header-title">
              {headerContent.pageTitle || page.Title}
            </h1>
          </>
        )}
      </div>
      {/* page sections */}
      {hasSections && (
        <div className="page-menu--mobile d-block d-md-none">
          <PageMenu
            pageSections={pageSections}
            activeSection={activeSection}
            menuStyle="select"
          />
        </div>
      )}
      <div className="static-content-container">
        <div className="page-content-wrapper">
          {hasSections ? (
            <div className="row no-gutters">
              <div className="page-menu--desktop col-md-4 col-12 d-none d-md-block">
                <PageMenu
                  pageSections={pageSections}
                  activeSection={activeSection}
                  menuStyle="nav"
                />
              </div>
              <div className="page-content col-md-8 col-12">
                {hasPageHeader && (pageHeader.introHtml.data.introHtml || headerContent.introHtml.data.introHtml) &&
                  <div className="header-content">
                    {pageHeader.introHtml.data.introHtml ? (
                      <HTMLArea isVisible>{pageHeader.introHtml.data.introHtml}</HTMLArea>
                    ) : (
                      <HTMLArea isVisible>{headerContent.introHtml.data.introHtml}</HTMLArea>
                    )}
                  </div>
                }
                {filteredContent.map(content => (
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
              {hasPageHeader && (pageHeader.introHtml.data.introHtml || headerContent.introHtml.data.introHtml) &&
                <div className="header-content">
                  {pageHeader.introHtml.data.introHtml ? (
                    <HTMLArea isVisible>{pageHeader.introHtml.data.introHtml}</HTMLArea>
                  ) : (
                    <HTMLArea isVisible>{headerContent.introHtml.data.introHtml}</HTMLArea>
                  )}
                </div>
              }
              {filteredContent.map(content => (
                <PageContent
                  contentType={content.strapi_component}
                  content={content}
                  key={content.strapi_component + "-" + content.id}
                ></PageContent>
              ))}
            </div>
          )}
        </div>
      </div>
      <div className="max-width-override">
        <ScrollToTop />
        <Footer />
      </div>
    </>
  )
}

export const Head = ({ pageContext }) => {
  const { page } = pageContext
  const components = page?.Content || []
  const headerContent = components.find(c => c.strapi_component === "parks.page-header") || {}
  const pageHeader = page?.PageHeader || null
  const meta = components.find(c => c.strapi_component === "parks.seo") || {}
  const seo = page?.Seo || null

  return (
    seo ? (
      <Seo
        title={seo?.metaTitle || page?.Title}
        description={seo?.metaDescription}
        keywords={seo?.metaKeywords}
        image={pageHeader?.imageUrl || headerContent?.imageUrl}
      />
    ) : (
      <Seo
        title={meta?.metaTitle || page?.Title}
        description={meta?.metaDescription}
        keywords={meta?.metaKeywords}
        image={pageHeader?.imageUrl || headerContent?.imageUrl}
      />
    )
  )
}
