import * as React from "react"
import { Link } from "gatsby"

import BetaBanner from "../components/betaBanner"
import Footer from "../components/footer"
import Seo from "../components/seo"
import ThumbLink from "../components/thumbLink"

import BCParksLogo from "../images/bcparks-h-rgb-rev.png"

import "../styles/404.scss"

const NotFoundPage = () => (
  <>
    <BetaBanner></BetaBanner>
    <Seo title="404: Not found" />
    <div className="not-found">
      <nav className="navbar navbar-dark" id="desktopNav">
        <div className="container">
          <div className="p-md-3 p-sm-0 mx-2">
            <Link to="/">
              <img className="bc-parks-logo" height="50" src={BCParksLogo} alt="BC Parks logo" />
            </Link>
          </div>
        </div>
      </nav>
      <div>
        <div className="not-found-container d-flex align-items-center justify-content-center container">
          <div className="p-3">
            <div className="mx-2">
              <h1>This page is still being designed.</h1>
              <h1>Please visit our featured pages below.</h1>
            </div>
            <div className="mt-2 d-flex justify-content-center">
              <div className="row">
                <div className="col-lg-4 col-md-12 mt-2">
                  <ThumbLink imageLink="404/home-thumb.jpg" title="Homepage" navLink="/" />
                </div>
                <div className="col-lg-4 col-md-12 mt-2">
                  <ThumbLink imageLink="404/park-thumb.jpg" title="Park Search" navLink="/explore" />
                </div>
                <div className="col-lg-4 col-md-12 mt-2">
                  <ThumbLink imageLink="404/reserve-thumb.jpg" title="Reservations" navLink="/reserve" />
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

