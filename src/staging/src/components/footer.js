import React, { useState } from "react"
import { Helmet } from "react-helmet"

import bcParksWordmark from "../images/BCParks_Wordmark_White.svg"
import facebookIcon from "../images/Facebook_Negative.svg"
import instaIcon from "../images/Instagram_Negative.svg"

import "../styles/footer.scss"

function FooterMenu({ items }) {
  return (
    <>
      <ul className="footer-menu-list list-unstyled pt-3 pl-1 ml-3 ml-md-0 text-white">
        {items.map((item, index) => (
          <li key={index}>
            {item.type === "header" && (
              <>
                <div className="font-weight-bold">{item.display}</div>
                <div className="footer-menu-divider">&nbsp;</div>
              </>
            )}
            {item.type === "link" && (
              <>
                <div key={index} className="mt-2">
                  <a href={item.link}>{item.display}</a>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    </>
  )
}

export default function Footer() {
  // Arrays of footer menus
  // TODO replace with data from Strapi
  const menu1 = [
    { type: "header", display: "Get a permit" },
    { type: "link", display: "Commercial services", link: "/commercial-use" },
  ]
  const menu2 = [
    { type: "header", display: "Get involved" },
    { type: "link", display: "Volunteer", link: "/volunteers" },
    { type: "link", display: "Support BC Parks", link: "/donate" },
  ]
  const menu3 = [
    { type: "header", display: "Stay connected" },
    { type: "link", display: "Contact us", link: "/contact" },
    {
      type: "link",
      display: "Blog",
      link: "https://engage.gov.bc.ca/bcparksblog/",
    },
  ]
  const utilityMenu = [
    { display: "Sitemap", link: "/sitemap" },
    { display: "Accessibility", link: "/accessibility" },
    { display: "Careers", link: "/careers" },
    { display: "Disclaimer", link: "/disclaimer" },
    { display: "Privacy", link: "/privacy" },
    { display: "Copyright", link: "/copyright" },
  ]

  const [searchText, setSearchText] = useState("")
  const [searchMsg, setSearchMsg] = useState("")

  const handleSearchTextChange = str => {
    // TODO - search box does nothing
    setSearchText(str)
    if (str) {
      setSearchMsg("Search utility under construction")
    } else {
      setSearchMsg("")
    }
  }

  return (
    <>
      {/* The next 3 lines will load the Snowplow script mounted from OpenShift configmap. */}
      {process.env.GATSBY_ENABLE_SNOWPLOW === "true" && (
        <Helmet>
          <script src="/_scripts/snowplow.js" />
        </Helmet>
      )}

      <footer id="footer">
        <div className="home-footer" id="home-footer">
          <div className="my-5 by-3">
            <div className="row">
              <div className="col col-12 col-md-5">
                <div className="text-center text-md-left" id="footer-logo">
                  <a href="/">
                    <img alt="BC Parks logo" src={bcParksWordmark} />
                  </a>
                </div>

                <div className="footer-search-container form-control text-white">
                  <div className="footer-search-box d-flex">
                    <span className="fa fa-search form-control-icon"></span>
                    <input
                      type="search"
                      className="form-control"
                      placeholder="Search BCParks.ca"
                      aria-label="Search BCParks.ca"
                      onChange={event => {
                        handleSearchTextChange(event.target.value)
                      }}
                      onKeyPress={ev => {
                        if (ev.key === "Enter") {
                          handleSearchTextChange(searchText)
                          ev.preventDefault()
                        }
                      }}
                    />
                  </div>
                </div>
                <div className="footer-search-msg text-center font-italic text-white mt-3">
                  {searchMsg === "" ? <> &nbsp; </> : searchMsg}
                </div>
              </div>
              <div className="col d-none d-lg-block col-lg-1">&nbsp;</div>
              <div className="col col-12 col-md-6">
                <div className="row">
                  <div className="col col-6 col-sm-4">
                    <div>
                      <FooterMenu items={menu1}></FooterMenu>
                    </div>
                  </div>
                  <div className="col col-6 col-sm-4 order-sm-3">
                    <div>
                      <FooterMenu items={menu3}></FooterMenu>
                    </div>
                  </div>
                  <div className="col col-6 col-sm-4 order-sm-2">
                    <div>
                      <FooterMenu items={menu2}></FooterMenu>
                    </div>
                  </div>
                  <div className="col col-8 d-none d-sm-block order-5">
                    &nbsp;
                  </div>
                  <div className="col col-6 col-sm-4 order-last">
                    <div className="text-left">
                      <div className="d-inline-block mt-3 ml-4 ml-md-1">
                        <a href="https://www.facebook.com/YourBCParks/">
                          <img src={facebookIcon} alt="Facebook" />
                        </a>
                      </div>
                      <div className="d-inline-block mt-3 ml-4">
                        <a href="https://www.instagram.com/yourbcparks">
                          <img src={instaIcon} alt="Instagram" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-center py-3 mt-5 border-top border-white">
              {utilityMenu.map((item, index) => (
                <div
                  className="footer-utility-link mx-1 mx-sm-2 mx-md-3 d-inline-block"
                  key={index}
                >
                  <a href={item.link}>{item.display}</a>
                </div>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </>
  )
}
