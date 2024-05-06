import React from "react"
import { useStaticQuery, graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { CssBaseline, Breadcrumbs } from "@mui/material"

import Footer from "../components/footer"
import Header from "../components/header"
import Seo from "../components/seo"
import MainSearch from "../components/search/mainSearch"
import PageContent from "../components/pageContent/pageContent"
import ScrollToTop from "../components/scrollToTop"
import HTMLArea from "../components/HTMLArea"

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
  const introContents = components.filter(component => component.strapi_component === "parks.html-area")
  const linkContents = components.filter(component => component.strapi_component === "parks.link-card")
  const pageHeader = page?.PageHeader || null

  return (
    <>
      <CssBaseline />
      <Header mode="internal" content={menuContent} />
      <div id="main-content"></div>
      {/* page header */}
      <div id="intro-content" className="bcp-landing-intro">
        {pageHeader ? (
          <>
            <div
              className="bcp-landing-intro__image"
              style={{ backgroundImage: `url(${pageHeader.imageUrl})` }}
            >
            </div>
            <div className="bcp-landing-intro__text">
              <div className="container">
                <div className="row d-none d-lg-block">
                  <div className="col">
                    <Breadcrumbs separator="›" aria-label="breadcrumb">
                      {renderBreadcrumbs(menuContent, page)}
                    </Breadcrumbs>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <h1>{pageHeader.pageTitle}</h1>
                  </div>
                </div>
                <div className="row">
                  <div className="col">
                    <HTMLArea isVisible>
                      {pageHeader.introHtml.data.introHtml}
                    </HTMLArea>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          // It can be removed after all data is migrated to pageHeader and seo
          introContents.length > 0 &&
          introContents.map(content => (
            <PageContent
              key={content.id}
              contentType={content.strapi_component}
              content={content}
            />
          ))
        )}
      </div>
      {/* link cards */}
      {linkContents.length > 0 && (
        <div id="link-content" className="bcp-landing-links">
          <div className="container">
            {linkContents.map(content => (
              <PageContent
                key={content.id}
                contentType={content.strapi_component}
                content={content}
              />
            ))}
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
  const seo = page?.Seo || null

  return (
    seo ? (
      <Seo
        title={seo?.metaTitle || page?.Title}
        description={seo?.metaDescription}
        keywords={seo?.metaKeywords}
      />
    ) : (
      <Seo
        title={meta?.metaTitle || page?.Title}
        description={meta?.metaDescription}
        keywords={meta?.metaKeywords}
      />
    )
  )
}
