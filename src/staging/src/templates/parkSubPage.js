import React, { useRef } from "react"
import { graphql } from "gatsby"
import { Breadcrumbs, Link } from "@material-ui/core"
import useScrollSpy from "react-use-scrollspy"

import Footer from "../components/footer"
import Header from "../components/header"
import HTMLArea from "../components/HTMLArea"
import Seo from "../components/seo"
import PageContent from "../components/pageContent/pageContent"
import PageMenu from "../components/pageContent/pageMenu"
import ScrollToTop from "../components/scrollToTop"

import "../styles/staticContent1.scss"

export default function ParkSubPage({ data }) {
  const page = data.strapiParkSubPage
  const contents = page.content
  const header = page.pageHeader
  const park = page.protectedArea
  const menuContent = data?.allStrapiMenu?.nodes || []
  const sections = contents.filter(content => Boolean(content.strapi_component === "parks.page-section")) || []
  const hasSections = sections.length > 0

  let pageSections = []
  if (hasSections) {
    let sectionIndex = 0
    for (const section of sections) {
      sectionIndex += 1
      section.sectionIndex = sectionIndex
      // if pageSection doesn't have a sectionTitle, display page title
      if (!section.sectionTitle) {
          section.sectionTitle = page.title
      }
      pageSections.push({
        display: section.sectionTitle,
        sectionIndex: sectionIndex,
        id: section.id,
        link: "#page-section-" + section.id,
        visible: true
      })
    }
  }

  let sectionRefs = [
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

  const activeSection = useScrollSpy({
    sectionElementRefs: sectionRefs,
    defaultValue: 0,
    offsetPx: -180,
  })

  const breadcrumbs = [
    <Link key="1" href="/">
      Home
    </Link>,
    <Link key="2" href="/find-a-park">
      Find a park
    </Link>,
    <Link key="3" href={`/${park.slug}`}>
      {park.protectedAreaName}
    </Link>,
    <div key="4" className="breadcrumb-text">
      {page.title}
    </div>,
  ]

  return (
    <>
      <ScrollToTop />
      <div className="max-width-override" ref={sectionRefs[0]}>
        <Header mode="internal" content={menuContent} />
      </div>
      <div id="sr-content" className="d-none d-md-block static-content-container page-breadcrumbs">
        <Breadcrumbs separator="›" aria-label="breadcrumb" className="p20t">
          {breadcrumbs}
        </Breadcrumbs>
      </div>
      <div className="static-content--header">
        {header?.imageUrl && (
          <div className="header-image-wrapper">
            <img
              src={header.imageUrl}
              alt={header.imageAlt ?? ""}
            />
          </div>
        )}
        <h1 className="header-title">
          {park.protectedAreaName}: {header?.title ?? page.title}
        </h1>
      </div>
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
                {header && (
                  <div className="header-content">
                    <div className="page-header--caption">
                      {header.imageCaption}
                    </div>
                    <HTMLArea isVisible>{header.introHtml.data.introHtml}</HTMLArea>
                  </div>
                )}
                {contents.map(content => (
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
              {header && (
                <div className="header-content">
                  <HTMLArea isVisible>{header.introHtml.data.introHtml}</HTMLArea>
                </div>
              )}
              {contents.map(content => (
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

export const Head = ({data}) => {
  const page = data.strapiParkSubPage
  const park = page.protectedArea
  const seo = page.seo

  return (
    <Seo
      title={seo?.metaTitle ?? park.protectedAreaName + ": " + page.title}
      description={seo?.metaDescription}
      keywords={seo?.metaKeywords}
    />
  )
}

export const query = graphql`
  query ParkSubPageDetails($slug: String, $protectedAreaSlug: String) {
    strapiParkSubPage(
      slug: { eq: $slug }
      protectedArea: {slug: {eq: $protectedAreaSlug}}
    ) {
      id
      slug
      title
      oldUrl
      content {
        ... on STRAPI__COMPONENT_PARKS_HTML_AREA {
          id
          strapi_id
          strapi_component
          HTML {
            data {
              HTML
            }
          }
        }
        ... on STRAPI__COMPONENT_PARKS_PAGE_SECTION {
          id
          strapi_id
          strapi_component
          sectionTitle
          sectionHTML {
            data {
              sectionHTML
            }
          }
        }
      }
      seo {
        metaDescription
        metaKeywords
        metaTitle
      }
      pageHeader {
        imageAlt
        imageCaption
        imageUrl
        introHtml {
          data {
            introHtml
          }
        }
        pageTitle
      }
      protectedArea {
        slug
        protectedAreaName
      }
    }
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
`