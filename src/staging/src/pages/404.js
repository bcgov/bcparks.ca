import * as React from "react"
import { Link } from "gatsby"
import Seo from "../components/seo"
import BCParksLogo from "../images/bcparks-h-rgb-rev.png"
import Footer from "../components/footer"
import ThumbLink from "../components/thumbLink"
import { Box } from "@material-ui/core"
import "../styles/404.scss"

const NotFoundPage = () => (
  <>
  <Box className="bc-bg-yellow bc-color-blue-dk text-center d-flex align-items-center justify-content-center p-2">
        <i className="banner-icon fa fa-info-circle"></i>
        <Box className="banner-text">This site is in <a href="https://beta.bcparks.ca/intro">beta</a></Box>
        <Box className="link-divider">|</Box>
        <Box className="banner-text-dark-link">
          <a href="https://chefs.nrs.gov.bc.ca/app/form/success?s=d4b3917c-04da-4446-b733-372a09bdb7a9">Help us improve this site by submitting here</a>
        </Box>
      </Box>
    <Seo title="404: Not found" />
    <div className="not-found">
      <nav className="navbar navbar-dark" id="desktopNav">
        <Link to="/">
          <img className="bc-parks-logo" src={BCParksLogo} alt="BC Parks logo" />
        </Link>
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

