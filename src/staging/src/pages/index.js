import React from "react"
import { graphql } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"
import { useMediaQuery } from "react-responsive"

import Header from "../components/header"
import Footer from "../components/footer"
import MainSearch from "../components/search/mainSearch"
import PageContent from "../components/pageContent/pageContent"

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
  const isMobile = useMediaQuery({ query: '(max-width: 414px)' })

  return (
    <div id="home">
      <div className="park-search-container-wrapper max-width-override" fixed disableGutters>
        <Header mode="internal" content={menuContent} />
          <div className="park-search">
            <div id="home-parks-search">
              <MainSearch />
            </div>
          <div className="park-search-carousel">
            <StaticImage src="../images/home/image006.png"
              placeholder="blurred"
              loading="eager"
              alt="Mount Robson Park" />
          </div> 
        </div>
      </div>
      <div className="home-content-width-override" fixed disableGutters={isMobile ? true: false}>
        <div id="main">
          {pageContent.map(content =>
            <div key={content.strapi_component + '-' + content.id}>
              <PageContent contentType={content.strapi_component} content={content}></PageContent>
            </div>
          )}
        </div>
      </div>
      <div className="max-width-override" fixed disableGutters>
        <Footer>
          {data.strapiWebsites.Footer}
        </Footer>
      </div>
    </div>
  )
}
