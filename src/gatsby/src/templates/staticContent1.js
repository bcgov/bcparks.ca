import React, { useRef } from "react"
import { graphql, useStaticQuery } from "gatsby"
import useScrollSpy from "react-use-scrollspy"

import Breadcrumbs from "../components/breadcrumbs"
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
  const pageContent = pageContext?.page?.Content
  const breadcrumbs = renderBreadcrumbs(menuContent, pageContext?.page)
  const filteredContent = pageContent.filter(c =>
    Boolean(c.strapi_component !== "parks.page-header") &&
    Boolean(c.strapi_component !== "parks.seo")
  ) || []
  const meta =
    pageContext?.page?.Content.find(c =>
      Boolean(c.strapi_component === "parks.seo")
    ) || {}

  // look for PageHeader content
  // if it exists, will affect the layout of the top of the page
  // note that it does not matter what position the component is in, it will appear at the top
  // note that if there are more than one such component, it will pick the first
  const headerContent =
    pageContext?.page?.Content.find(c =>
      Boolean(c.strapi_component === "parks.page-header")
    ) || {}
  const hasPageHeader = headerContent.pageTitle !== undefined

  // Get page title from Title field
  // if not there, get title from pageTitle, if there is a PageHeader component
  // otherwise, page title & breadcrumb assumed to be in the content
  let pageTitle = pageContext.page.Title
  if (!pageTitle) {
    pageTitle = headerContent.pageTitle
  }
  const hasTitle = pageTitle !== undefined

  const sections =
    pageContent.filter(c =>
      Boolean(c.strapi_component === "parks.page-section")
    ) || []
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
    let firstSectionTitle = pageTitle
    if (!firstSectionTitle) {
      // get page title, using same method as renderBreadcrumbs
      // this assume the page is in the menu, use metaTitle from SEO otherwise
      const slug = pageContext?.page?.Slug
      const current = menuContent.find(mc => mc.url === slug)
      firstSectionTitle = current ? current.title : meta.metaTitle
    }
    pageSections = [
      { display: firstSectionTitle, sectionIndex: 0, id: 0, link: "#" },
    ]

    let sectionIndex = 0
    for (const c of pageContent) {
      sectionIndex += 1
      if (c.strapi_component === "parks.page-section") {
        // each section needs an index to be used for in-page navigation
        // and scrollspy highlighting
        const titleId = slugify(c.sectionTitle).toLowerCase()
        c.sectionIndex = sectionIndex
        pageSections.push({
          display: c.sectionTitle,
          sectionIndex: sectionIndex,
          id: c.id,
          link: "#" + titleId,
          visible: true // Default
        })
      }
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
      {hasTitle && (
        <div className="static-content--header">
          <div id="main-content" className="page-breadcrumbs">
            <Breadcrumbs breadcrumbs={breadcrumbs} />
          </div>
          {headerContent.imageUrl && (
            <div className="header-image-wrapper">
              <img
                src={headerContent.imageUrl}
                alt=""
              />
            </div>
          )}
          <h1 className="header-title">
            {pageTitle}
          </h1>
        </div>
      )}
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
                {hasPageHeader && (
                  <div className="header-content">
                    {headerContent.introHtml.data.introHtml &&
                      <HTMLArea isVisible>{headerContent.introHtml.data.introHtml}</HTMLArea>
                    }
                  </div>
                )}
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
              {hasPageHeader && headerContent.introHtml && (
                <div className="header-content">
                  <HTMLArea isVisible>{headerContent.introHtml}</HTMLArea>
                </div>
              )}
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
  const meta =
    pageContext?.page?.Content.find(c =>
      Boolean(c.strapi_component === "parks.seo")
    ) || {}

  const headerContent =
    pageContext?.page?.Content.find(c =>
      Boolean(c.strapi_component === "parks.page-header")
    ) || {}

  let pageTitle = pageContext.page.Title
  if (!pageTitle) {
    pageTitle = headerContent.pageTitle
  }

  return (
    <Seo
      title={meta?.metaTitle || pageTitle}
      description={meta?.metaDescription}
      keywords={meta?.metaKeywords}
      image={headerContent?.imageUrl}
    />
  )
}
