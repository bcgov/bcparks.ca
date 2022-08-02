import React, { useRef } from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import { Breadcrumbs } from "@material-ui/core"
import useScrollSpy from "react-use-scrollspy"

import Footer from "../components/footer"
import Header from "../components/header"
import HTMLArea from "../components/HTMLArea"
import Seo from "../components/seo"
import PageContent from "../components/pageContent/pageContent"
import PageMenu from "../components/pageContent/pageMenu"

import "../styles/staticContent1.scss"

export default function StaticContent1({ pageContext }) {
  const queryData = useStaticQuery(graphql`
    {
      strapiWebsites(Name: { eq: "BCParks.ca" }) {
        Footer
        Header
        Name
        Navigation
        id
        homepage {
          id
          Template
          Content {
            id
            strapi_component
          }
        }
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
  `)

  const pageContent = pageContext?.page?.Content // array of content components in page
  const meta =
    pageContext?.page?.Content.find(c =>
      Boolean(c.strapi_component === "parks.seo")
    ) || {}
  const menuContent = queryData?.allStrapiMenus?.nodes || [] // megaMenu

  // look for PageHeader content
  // if it exists, will affect the layout of the top of the page
  // note that it does not matter what position the component is in, it will appear at the top
  // note that if there are more than one such component, it will pick the first
  const headerContent =
    pageContext?.page?.Content.find(c =>
      Boolean(c.strapi_component === "parks.page-header")
    ) || {}
  const hasPageHeader = headerContent.pageTitle !== undefined

  // Get page title from record
  // if not there, get from page title, if there is a PageHeader compopnent
  // otherwise, page title & breadcrumb assumed to be in the content
  let pageTitle = pageContext.page.title
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
      <Seo
        title={meta.metaTitle}
        description={meta.description}
        keywords={meta.metaKeywords}
      />
      <div className="max-width-override" ref={sectionRefs[0]}>
        <Header mode="internal" content={menuContent} />
      </div>
      <div className="d-none d-md-block static-content-container page-breadcrumbs">
        <Breadcrumbs separator="›" aria-label="breadcrumb">
          {renderBreadcrumbs(menuContent, pageContext?.page)}
        </Breadcrumbs>
      </div>
      {hasTitle && (
        <div className="static-content--header">
          <div className="header-title header-title--desktop d-none d-md-block">
            {pageTitle}
          </div>
          {headerContent.imageUrl && (
            <div className="header-image-wrapper">
              <img
                src={headerContent.imageUrl}
                alt={headerContent.imageAlt ?? null}
              />
            </div>
          )}
          <div className="header-title header-title--mobile d-block d-md-none">
            {pageTitle}
          </div>
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
                    <HTMLArea isVisible>{headerContent.introHtml}</HTMLArea>
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
        <Footer>{queryData.strapiWebsites.Footer}</Footer>
      </div>
    </>
  )
}

function renderBreadcrumbs(menuContent, pageContext) {
  // TODO this doesn't work if the page is not in the menu
  let current = menuContent.find(mc => mc.url === pageContext.Slug)
  const breadcrumbItems = [
    <div key={pageContext.id} className="breadcrumb-text">
      {current?.title}
    </div>,
  ]

  let parent = menuContent.find(mc => mc.strapiId === current?.strapiParent?.id)
  return addItems(parent, menuContent, breadcrumbItems)

  function addItems(parent, menuContent, breadcrumbItems) {
    if (parent) {
      breadcrumbItems.push(
        <Link key={parent.strapiId} to={parent?.url ?? "/"}>
          {parent.title}
        </Link>
      )
      parent = menuContent.find(mc => mc.strapiId === parent?.strapiParent?.id)
      return addItems(parent, menuContent, breadcrumbItems)
    }
    return breadcrumbItems.reverse()
  }
}
