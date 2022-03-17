import React, { useEffect } from "react"
import { graphql } from "gatsby"

import Seo from "../components/seo"
import HTMLArea from "../components/HTMLArea"
import Header from "../components/header"
import Footer from "../components/footer"


const IntroPage = ({ data }) => {
  const pageContent = data?.strapiPages?.Content || []
  const menuContent = data?.allStrapiMenus?.nodes || []

  const htmlContent = pageContent.find(
    item => item.strapi_component === "parks.html-area"
  )
  const seoContent = pageContent.find(
    item => item.strapi_component === "parks.seo"
  )

  useEffect(() => {
    sessionStorage.setItem("beta-landing-visited", true)
  }, [])

  return (
    <>
      {seoContent && (
        <Seo
          title={seoContent.metaTitle}
          description={seoContent.description}
          keywords={seoContent.metaKeywords}
        />
      )}

      <div className="max-width-override">
        <Header mode="internal" content={menuContent} />
      </div>

      {htmlContent && <HTMLArea isVisible={true}>{htmlContent.HTML}</HTMLArea>}

      <div className="max-width-override">
        <Footer>{data.strapiWebsites.Footer}</Footer>
      </div>
    </>
  )
}

export default IntroPage

export const query = graphql`
  {
    strapiWebsites(Name: { eq: "BCParks.ca" }) {
      Footer
    }
    strapiPages(Slug: { eq: "/beta-landing" }) {
      id
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
