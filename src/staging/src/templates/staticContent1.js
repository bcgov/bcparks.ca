import React, { useRef } from "react"
import { graphql, useStaticQuery } from "gatsby"
import { Breadcrumbs } from "@material-ui/core"
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

export default function StaticContent1({ pageContext }) {
  const queryData = useStaticQuery(graphql`
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
  `)

  const menuContent = queryData?.allStrapiMenu?.nodes || []
  const pageContent = pageContext?.page?.Content
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
    // Creating 10 refs for scrollspy
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
        c.sectionIndex = sectionIndex
        pageSections.push({
          display: c.sectionTitle,
          sectionIndex: sectionIndex,
          id: c.id,
          link: "#page-section-" + c.id,
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
    offsetPx: -180,
  })

  return (
    <>
      <ScrollToTop />
      <div className="max-width-override" ref={sectionRefs[0]}>
        <Header mode="internal" content={menuContent} />
      </div>
      <div id="sr-content" className="d-none d-md-block static-content-container page-breadcrumbs">
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {renderBreadcrumbs(menuContent, pageContext?.page)}
        </Breadcrumbs>
      </div>
      {hasTitle && (
        <div className="static-content--header">
          {headerContent.imageUrl && (
            <div className="header-image-wrapper">
              <img
                src={headerContent.imageUrl}
                alt={headerContent.imageAlt ?? ""}
              />
            </div>
          )}
          <h1 className="header-title">
            {pageTitle}
          </h1>
        </div>
      )}
      {hasSections && (
        <div className="page-menu--mobile">
          <div className="d-block d-md-none">
            <PageMenu
              pageSections={pageSections}
              activeSection={activeSection}
              menuStyle="select"
            />
          </div>
        </div>
      )}
      <div className="static-content-container">
        <div className="page-content-wrapper">
          {hasSections ? (
            <div className="row">
              <div className="page-menu--desktop col-md-3 col-12 d-none d-md-block">
                <div className="">
                  <PageMenu
                    pageSections={pageSections}
                    activeSection={activeSection}
                    menuStyle="nav"
                  />
                </div>
              </div>
              <div className="page-content col-md-9 col-12">
                {hasPageHeader && (
                  <div className="header-content">
                    <div className="page-header--caption">
                      {headerContent.imageCaption}
                    </div>
                    <HTMLArea isVisible>{headerContent.introHtml.data.introHtml}</HTMLArea>
                  </div>
                )}
                {pageContent.map(content => (
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
              {hasPageHeader && (
                <div className="header-content">
                  <HTMLArea isVisible>{headerContent.introHtml}</HTMLArea>
                </div>
              )}
              {pageContent.map(content => (
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
        <Footer />
      </div>
    </>
  )
}

export const Head = ({pageContext}) => {
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
    />
  )
}
