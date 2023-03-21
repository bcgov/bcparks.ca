import * as React from "react"
import { graphql, useStaticQuery } from "gatsby"

import Header from "../components/header"
import Footer from "../components/footer"
import Seo from "../components/seo"
import ThumbLink from "../components/thumbLink"

import "../styles/404.scss"

const NotFoundPage = () => {

  const queryData = useStaticQuery(graphql`
    query {
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
  `)

  const menuContent = queryData?.allStrapiMenu?.nodes || []

  return (
    <>
      <Header mode="internal" content={menuContent} />
      <div id="sr-content" className="not-found">
        <div>
          <div className="not-found-container d-flex align-items-center justify-content-center container">
            <div className="p-3">
              <div className="p-2 mt-5">
                <p>
                  Good catch! You seem to have found a link that’s not working or a page that hasn’t been added to our new
                  website yet. Help us fix things as soon as possible by letting us know at{" "}
                  <a href="mailto:parkinfo@gov.bc.ca" aria-label="Send a mail to BC Parks" className="text-white">
                    parkinfo@gov.bc.ca
                  </a>
                </p>
                <p>
                  You may find what you were looking for at the links below.
                </p>
              </div>
              <div className="mt-2 d-flex justify-content-center">
                <div className="row">
                  <ThumbLink imageLink="404/home-thumb.jpg" title="Homepage" navLink="/" />
                  <ThumbLink imageLink="404/park-thumb.jpg" title="Find a park" navLink="/find-a-park" />
                  <ThumbLink imageLink="404/reserve-thumb.jpg" title="Reservations" navLink="/reservations" />
                </div>
              </div>
            </div>
          </div>
          <Footer />
        </div>
      </div>
    </>
  )
}

export default NotFoundPage

export const Head = () => (
  <Seo title="404: Not found" />
)
