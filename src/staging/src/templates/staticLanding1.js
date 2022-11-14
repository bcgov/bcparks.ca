import React from "react"
import { useStaticQuery, graphql, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { CssBaseline, Breadcrumbs } from "@material-ui/core"

import Footer from "../components/footer"
import Header from "../components/header"
import Seo from "../components/seo"
import MainSearch from "../components/search/mainSearch"
import PageContent from "../components/pageContent/pageContent"

import "../styles/global.scss"
import "../styles/staticLanding1.scss"

const LandingPage = ({ pageContext }) => {
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
  const menuContent = queryData?.allStrapiMenus?.nodes || []
  const { page } = pageContext
  const components = page?.Content || []
  const meta =
    components.find(component => component.strapi_component === "parks.seo") ||
    {}
  const introContent = components.slice(0, 1)
  const linkContent = components.slice(1)

  return (
    <>
      <Seo
        title={meta.metaTitle}
        description={meta.description}
        keywords={meta.metaKeywords}
      />
      <CssBaseline />
      <Header mode="internal" content={menuContent} />
      {linkContent.length > 0 && (
        <div id="intro-content" className="bcp-landing-intro">
          {introContent.map(content => (
            <PageContent
              key={content.id}
              contentType={content.strapi_component}
              content={content}
            />
          ))}
        </div>
      )}
      {linkContent.length > 0 && (
        <div id="link-content" className="bcp-landing-links">
          <div className="container">
            {linkContent.map(content => (
              <div key={content.id} className="row">
                <div className="col">
                  <PageContent
                    contentType={content.strapi_component}
                    content={content}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* Show breadcrumbs and title even if there's no HTMLArea */}
      {linkContent.length === 0 && (
        <>
          <div className="d-none d-md-block static-content-container page-breadcrumbs">
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {renderBreadcrumbs(menuContent, pageContext?.page)}
            </Breadcrumbs>
          </div>
          <div className="static-content--header">
            <h1 className="header-title">
              {page.Title}
            </h1>
          </div>
        </>
      )}
      <div className="bcp-landing-park-search d-none d-lg-block">
        <div className="container">
          <div className="row">
            <div className="col">
              <StaticImage
                src="../images/landing/footer-find-your-next-adventure.png"
                alt="Two hikers filming in a BC Park"
              />
            </div>
            <div className="col">
              <MainSearch />
            </div>
          </div>
        </div>
      </div>
      <Footer>{queryData.strapiWebsites.Footer}</Footer>
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

export default LandingPage
