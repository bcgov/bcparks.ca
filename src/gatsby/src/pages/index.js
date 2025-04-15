import React from "react"
import { graphql } from "gatsby"

import Acknowledgment from "../components/acknowledgment"
import Footer from "../components/footer"
import Header from "../components/header"
import MainSearch from "../components/search/mainSearch"
import PageContent from "../components/pageContent/pageContent"
import Seo from "../components/seo"
import ScrollToTop from "../components/scrollToTop"

import "../styles/home.scss"

export const query = graphql`
  {
    strapiPage(Slug: {eq: "/home"}) {
      Slug
      Content {
        ... on STRAPI__COMPONENT_PARKS_CARD_SET {
          id
          strapi_id
          strapi_component
          cards {
            id
            strapi_id
            url
            title
            subTitle
            buttonText
            imageUrl
            imageAltText
            variation
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

export default function Home({ data }) {
  const pageContent = data.strapiPage.Content || []
  const menuContent = data?.allStrapiMenu?.nodes || []

  return (
    <div id="home">
      <div className="park-search-container-wrapper">
        <Header mode="internal" content={menuContent} />
        <div
          id="main-content"
          className="park-search"
          style={{
            backgroundImage: `url(${require("../images/home/search_bg.png").default})`,
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        >
          <div id="home-parks-search">
            <MainSearch hasCityNameSearch={true} />
          </div>
        </div>
      </div>
      <div className="home-content-width-override">
        <div id="main">
          {pageContent.map(content => (
            <div key={content.strapi_component + "-" + content.id}>
              <PageContent
                contentType={content.strapi_component}
                content={content}
              ></PageContent>
            </div>
          ))}
        </div>
      </div>
      <Acknowledgment />
      <ScrollToTop />
      <Footer />
    </div>
  )
}

export const Head = () => (
  <Seo title="Home" description="Official website for BC Parks. Get information on camping and other activities in parks across British Columbia. Learn about our environmental conservation work." />
)
