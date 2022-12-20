import * as React from "react"

import Header from "../components/header"
import Footer from "../components/footer"
import Seo from "../components/seo"
import ThumbLink from "../components/thumbLink"

import "../styles/404.scss"

const NotFoundPage = () => (
  <>
    <Seo title="404: Not found" />
    <Header />
    <div className="not-found">
      <div>
        <div className="not-found-container d-flex align-items-center justify-content-center container">
          <div className="p-3">
            <div className="mx-2">
              <p>
                Good catch! You seem to have found a link that’s not working or a page that hasn’t been added to our new
                website yet. Help us fix things as soon as possible by letting us know at{" "}
                <a href="mailto:parkinfo@gov.bc.ca" aria-label="Send a mail to BC Parks">
                  parkinfo@gov.bc.ca
                </a>
              </p>
              <p>
                You may find what you were looking for at the links below.
              </p>
            </div>
            <div className="mt-2 d-flex justify-content-center">
              <div className="row">
                <div className="col-lg-4 col-md-12 mt-2">
                  <ThumbLink imageLink="404/home-thumb.jpg" title="Homepage" navLink="/" />
                </div>
                <div className="col-lg-4 col-md-12 mt-2">
                  <ThumbLink imageLink="404/park-thumb.jpg" title="Find a park" navLink="/find-a-park" />
                </div>
                <div className="col-lg-4 col-md-12 mt-2">
                  <ThumbLink imageLink="404/reserve-thumb.jpg" title="Reservations" navLink="/reservations" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  </>
)

export default NotFoundPage

