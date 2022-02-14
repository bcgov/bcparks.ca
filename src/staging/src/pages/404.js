import * as React from "react"
import { Link } from "gatsby"
import Seo from "../components/seo"
import BCParksLogo from "../images/bcparks-h-rgb-rev.png"
import Footer from "../components/footer"
import ThumbLink from "../components/thumbLink"
import "../styles/404.scss"

const thumbHome = "https://github.com/bcgov/bcparks.ca/blob/main/src/staging/src/images/home/home-thumb.jpg?raw=true"
const thumbPark = "https://github.com/bcgov/bcparks.ca/blob/main/src/staging/src/images/park/park-thumb.jpg?raw=true"
const thumbReserve = "https://github.com/bcgov/bcparks.ca/blob/main/src/staging/src/images/reserve/reserve-thumb.jpg?raw=true"

const NotFoundPage = () => (
  <>
    <Seo title="404: Not found" />
    <div className="not-found">
      <nav className="navbar navbar-dark" id="desktopNav">
        <Link to="/">
          <img className="bc-parks-logo" src={BCParksLogo} alt="BC Parks logo" />
        </Link>
      </nav>
      <div>
        <div className="not-found-container d-flex align-items-center justify-content-center container">
          <div className="p-5">
            <div className="mx-2">
              <h1>This page is still being designed.</h1>
              <h1>Please visit our featured pages below.</h1>
            </div>
            <div className="mt-2 d-flex justify-content-center">
              <div className="row">
                <div className="col-lg-4 col-md-12 mt-2">
                  <ThumbLink imageLink={thumbHome} title="Homepage" navLink="/" />
                </div>
                <div className="col-lg-4 col-md-12 mt-2">
                  <ThumbLink imageLink={thumbPark} title="Park Search" navLink="/explore" />
                </div>
                <div className="col-lg-4 col-md-12 mt-2">
                  <ThumbLink imageLink={thumbReserve} title="Reservations" navLink="/reserve" />
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

