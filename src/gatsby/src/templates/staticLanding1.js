import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Breadcrumbs from "../components/breadcrumbs"
import Footer from "../components/footer"
import Header from "../components/header"
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

  const menuContent = queryData?.allStrapiMenu?.nodes || []
  const { page } = pageContext
  const components = page?.Content || []
  const introContent = components.slice(0, 1)
  const linkContent = components.slice(1)
  const breadcrumbs = renderBreadcrumbs(menuContent, pageContext?.page)

  return (
    <>
      <Header mode="internal" content={menuContent} />
      <div id="main-content"></div>
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
            {linkContent
              .filter(content => content.strapi_component === "parks.link-card")
              .map(content => (
                <PageContent
                  key={content.id}
                  contentType={content.strapi_component}
                  content={content}
                />
              ))}
          </div>
        </div>
      )}
      {/* This is a temporary attempt not to break the existing hard code HTMLArea */}
      {/* For the edge case: show breadcrumbs and title if there's no HTMLArea */}
      {linkContent.length === 0 && (
        <div className="bcp-landing-intro">
          <div className="bcp-landing-intro__image">
            {/* TODO: here should be landing image */}
          </div>
          <div className="bcp-landing-intro__text">
            <div className="container">
              <div className="row d-none d-lg-block">
                <div className="col">
                  <Breadcrumbs breadcrumbs={breadcrumbs} />
                </div>
              </div>
              <div className="row">
                <div className="col">
                  <h1>{page?.Title}</h1>
                </div>
              </div>
              <div className="row">
                <div className="col">
                  {/* TODO: here should be some text */}
                </div>
              </div>
            </div>
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
  const components = page?.Content || []
  const meta =
    components.find(component => component.strapi_component === "parks.seo") || {}

  return (
    <Seo
      title={meta?.metaTitle || page?.Title}
      description={meta?.metaDescription}
      keywords={meta?.metaKeywords}
    />
  )
}
