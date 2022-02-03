import React, { useRef } from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import Header from "../components/header"
import Footer from "../components/footer"
import PageMenu from "../components/pageContent/pageMenu"
import PageHeader from "../components/pageContent/pageHeader"
import PageContent from "../components/pageContent/pageContent"
import { Container, Breadcrumbs } from "@material-ui/core"
import useScrollSpy from "react-use-scrollspy"

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
          HTML
        }
      }
    }
    allStrapiMenus(
      sort: {fields: order, order: ASC}
      filter: {show: {eq: true}}
    ) {
      nodes {
        strapiId
        title
        url
        order
        id
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
  }`)


  const pageContent = pageContext?.page?.Content; // array of content components in page
  const meta = pageContext?.page?.Content.find(c => Boolean(c.strapi_component === 'parks.seo')) || {}
  const menuContent = queryData?.allStrapiMenus?.nodes || [] // megaMenu

  console.log(pageContent)

  // get page title, using same method as renderBreadcrumbs
  // this assume the page is in the menu, use metaTitle from SEO otherwise
  let slug = pageContext?.page?.Slug
  let current = menuContent.find(mc => mc.url === slug)
  let pageTitle = current ? current.title : meta.metaTitle;


  // create page sections for sticky sidebar menu
  // and scrollspy highlighting
  let pageSections = [{ display: pageTitle, sectionIndex: 0, id: 0, link: "#" }];
  let sectionRefs = [
    // Creating 10 refs for scrollspy
    // TODO create dynamically without causing error
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
    
  let sectionIndex = 0
  for (var cIdx in pageContent) {
    var c = pageContent[cIdx];
    sectionIndex += 1;    
    if (c.strapi_component === 'parks.page-section') {
      // each section needs an index to be used for in-page navigation
      // and scrollspy highlighting
      c.sectionIndex = sectionIndex;
      pageSections.push({ display: c.SectionTitle, sectionIndex: sectionIndex, id: c.id, link: "#page-section-" + c.id })

    } 
  }

  // activeSection will be the index of the on-screen section
  const activeSection = useScrollSpy({ 
    sectionElementRefs: sectionRefs,
    defaultValue: 0,
    offsetPx: -180,
  })

  

  
  return (
    <>
      <Container id="header" className="max-width-override" fixed disableGutters>
        <Header mode="internal" ref={sectionRefs[0]} content={menuContent} />
      </Container>
      <Container className="d-none d-md-block static-content-width content" fixed>
        <Breadcrumbs   
            separator="›"
            aria-label="breadcrumb"
          >
            {renderBreadcrumbs(menuContent, pageContext?.page)}
        </Breadcrumbs>
      </Container>
      <PageHeader pageSections={pageSections} activeSection={activeSection}></PageHeader>
      <Container className="static-content-width content" fixed>
        <div className="page-content-wrapper">
          {pageSections.length > 1 ? (
            <div className="row">
              <div className="page-content-menu col-md-3 col-12">
                <PageMenu pageSections={pageSections} activeSection={activeSection} />
              </div>
              <div className="page-content col-md-8 col-12">
                {pageContent.map(content =>
                  <div ref={ sectionRefs[content.sectionIndex]} key={content.strapi_component + '-' + content.id}>
                    <PageContent contentType={content.strapi_component} content={content}></PageContent>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>{pageContent.map(content => <PageContent contentType={content.strapi_component} content={content} key={content.strapi_component + '-' + content.id}></PageContent>)}</div>
          )}
        </div>
      </Container>
      <Container className="max-width-override" fixed disableGutters>
        <Footer>
          {queryData.strapiWebsites.Footer}
        </Footer>
      </Container>
    </>
  )
}

function renderBreadcrumbs(menuContent, pageContext) {
  // TODO this doesn't work if the page is not in the menu
  let current = menuContent.find(mc => mc.url === pageContext.Slug)
  const breadcrumbItems = [
    <div key={pageContext.id} className="breadcrumb-text">
      {current?.title}
    </div>
  ]

  let parent = menuContent.find(mc => mc.strapiId === current?.strapiParent?.id)
  return addItems(parent, menuContent, breadcrumbItems)

  function addItems(parent, menuContent, breadcrumbItems) {
    if (parent) {
      breadcrumbItems.push(
        <Link key={parent.strapiId} to={parent?.url ?? '/'}>{parent.title}</Link>
      )
      parent = menuContent.find(mc => mc.strapiId === parent?.strapiParent?.id)
      return addItems(parent, menuContent, breadcrumbItems)
    }
    return breadcrumbItems.reverse()
  }
}

