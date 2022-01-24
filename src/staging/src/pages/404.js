import * as React from "react"
import { Link, navigate } from "gatsby"
import Seo from "../components/seo"
import BCParksLogo from "../images/bcparks-h-rgb-rev.png"
import { Button } from "@material-ui/core"

import "../styles/404.scss"

function goHome() {
  navigate('/');
}

const NotFoundPage = () => (
  <>
    <Seo title="404: Not found" />
    <div className="not-found">
      <nav className="navbar navbar-dark" id="desktopNav">
        <Link to="/">
          <img className="bc-parks-logo" src={BCParksLogo} alt="BC Parks logo" />
        </Link>
      </nav>
      <div className="not-found-container d-flex align-items-center justify-content-center">
        <div className="p-3 text-center">
          <h1>The page you are looking for is coming soon.</h1>
          <p>The link you followed may be broken, or the page is being developed. Come back soon.</p>
          <Button variant="contained"
            className="home-button px-5 py-2"
            onClick={() => goHome()}>
            Back Home
          </Button>
        </div>
      </div>
    </div>
  </>
)

export default NotFoundPage

