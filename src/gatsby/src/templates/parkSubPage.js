import React, { useRef } from "react"
import { graphql, Link as GatsbyLink, navigate } from "gatsby"
import useScrollSpy from "react-use-scrollspy"

import Acknowledgment from "../components/acknowledgment"
import Breadcrumbs from "../components/breadcrumbs"
import Footer from "../components/footer"
import Header from "../components/header"
import HtmlContent from "../components/htmlContent"
import Seo from "../components/seo"
import PageContent from "../components/pageContent/pageContent"
import PageMenu from "../components/pageContent/pageMenu"
import ScrollToTop from "../components/scrollToTop"

import "../styles/staticContent1.scss"

const slugify = require("slugify")

export default function ParkSubPage({ data }) {
  const page = data.strapiParkSubPage
  const contents = page.content
  const header = page.pageHeader
  const park = page.protectedArea
  const menuContent = data?.allStrapiMenu?.nodes || []
  const sections = contents?.filter(content => Boolean(content.strapi_component === "parks.page-section")) || []
  const hasSections = sections.length > 0
  const filteredContent = contents?.filter(c =>
    Boolean(c.strapi_component !== "parks.page-header") &&
    Boolean(c.strapi_component !== "parks.seo")
  ) || []

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
    useRef(null),
    useRef(null),
    useRef(null),
  ]

  let pageSections = []
  if (hasSections) {
    let sectionIndex = 0
    for (const s of sections) {
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

  const activeSection = useScrollSpy({
    sectionElementRefs: sectionRefs,
    defaultValue: 0,
    offsetPx: -100,
  })

  const breadcrumbs = [
    <GatsbyLink key="1" to="/">
      Home
    </GatsbyLink>,
    <GatsbyLink
      key="2"
      to="/find-a-park"
      onClick={(e) => {
        if (sessionStorage.getItem("lastSearch")) {
          e.preventDefault();
          navigate('/find-a-park/' + sessionStorage.getItem("lastSearch"))
        }
      }}
    >
      Find a park
    </GatsbyLink>,
    <GatsbyLink key="3" to={`/${park.slug}`}>
      {park.protectedAreaName}
    </GatsbyLink>,
    <div key="4" className="breadcrumb-text">
      {page.title}
    </div>,
  ]

  return (
    <>
      <div className="max-width-override" ref={sectionRefs[0]}>
        <Header mode="internal" content={menuContent} />
      </div>
      <div className="static-content--header">
        <div id="main-content" tabIndex={-1} className="page-breadcrumbs">
          <Breadcrumbs breadcrumbs={breadcrumbs} />
        </div>
        {header?.imageUrl && (
          <div className="header-image-wrapper">
            <img
              src={header.imageUrl}
              alt=""
            />
          </div>
        )}
        <h1 className="header-title">
          {park.protectedAreaName}: {header?.title ?? page.title}
        </h1>
      </div>
      {hasSections && (
        <div className="page-menu--mobile d-block d-md-none">
          <PageMenu
            pageSections={pageSections}
            menuStyle="list"
          />
        </div>
      )}
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
                {header && (
                  <div className="header-content">
                    {header.introHtml.data.introHtml &&
                      <HtmlContent>{header.introHtml.data.introHtml}</HtmlContent>
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
              {header && header.introHtml.data.introHtml && (
                <div className="header-content">
                  <HtmlContent>{header.introHtml.data.introHtml}</HtmlContent>
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
      <Acknowledgment />
      <ScrollToTop />
      <Footer />
    </>
  )
}

export const Head = ({ data }) => {
  const page = data.strapiParkSubPage
  const park = page.protectedArea
  const seo = page.seo

  return (
    <Seo
      title={seo?.metaTitle ?? park.protectedAreaName + ": " + page.title}
      description={seo?.metaDescription}
      keywords={seo?.metaKeywords}
      image={page.pageHeader?.imageUrl}
    />
  )
}

export const query = graphql`
  query ParkSubPageDetails($slug: String, $protectedAreaSlug: String) {
    strapiParkSubPage(
      slug: {eq: $slug}
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
`