import React, { useEffect, useState } from "react"
import { graphql, navigate } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import Footer from "../components/footer"
import Header from "../components/header"
import MainSearch from "../components/search/mainSearch"
import PageContent from "../components/pageContent/pageContent"
import Seo from "../components/seo"

import "../styles/home.scss"

export const query = graphql`
  query {
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
        }
      }
    }
    strapiPages(Slug: { eq: "/home" }){
      Slug
      Content
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
`

export default function Home({ data }) {

  const pageContent = data.strapiPages.Content || [];
  const menuContent = data?.allStrapiMenus?.nodes || []

  // Fake loading flag to briefly show a blank page while redirecting to the
  // beta landing page.  The intention is to prevent home page content from 
  // briefly showing before redirecting to the beta landing page.
  // 
  // The state, useEffect and the conditional render can be removed later
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const visited = sessionStorage.getItem("beta-landing-visited")

    if (!visited) {
      navigate("/intro")
    } else {
      setLoading(false)
    }
  }, [])

  return (
    <>
      {loading ? (
        <></>
      ) : (
        <div id="home">
          <Seo title="Home"/>
          <div className="park-search-container-wrapper home-max-width-override">
            <Header mode="internal" content={menuContent} />
            <div className="park-search">
              <div id="home-parks-search">
                <MainSearch />
              </div>
              <div className="home-page-search-bg">
                <StaticImage src="../images/home/search_bg.png"
                  placeholder="blurred"
                  loading="eager"
                  style={{ display: "block" }}
                  alt="Mount Robson Park" />
              </div>
            </div>
          </div>
          <div className="home-content-width-override">
            <div id="main">
              {pageContent.map(content =>
                <div key={content.strapi_component + '-' + content.id}>
                  <PageContent contentType={content.strapi_component} content={content}></PageContent>
                </div>
              )}
            </div>
          </div>
          <div className="home-max-width-override">
            <Footer>
              {data.strapiWebsites.Footer}
            </Footer>
          </div>
        </div>
      )}
    </>
  )
}
