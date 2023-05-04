import React from "react"

import bcParksWordmark from "../images/BCParks_Wordmark_White.svg"
import facebookIcon from "../images/Facebook_Negative.svg"
import instaIcon from "../images/Instagram_Negative.svg"

import "../styles/footer.scss"

function FooterMenu({ items, menuIndex }) {
  return (
    <>
      <ul className="footer-menu-list list-unstyled pt-3 pl-1 ml-3 ml-md-0 text-white">
        {items.map((item, index) => (
          <li key={index}>
            {item.type === "header" && (
              <>
                <div className="font-weight-bold">{item.display}</div>
                <div className="footer-menu-divider"></div>
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
        {/* Add social media links if it's menu3 */}
        {menuIndex === 2 && (
          <li>
            <div className="d-inline-block mt-3">
              <a href="https://www.facebook.com/YourBCParks/">
                <img src={facebookIcon} alt="Facebook" />
              </a>
            </div>
            <div className="d-inline-block mt-3 ml-3">
              <a href="https://www.instagram.com/yourbcparks">
                <img src={instaIcon} alt="Instagram" />
              </a>
            </div>
          </li>
        )}
      </ul>
    </>
  )
}

export default function Footer() {
  // Arrays of footer menus
  // TODO replace with data from Strapi
  const menu1 = [
    { type: "header", display: "Get a permit" },
    { type: "link", display: "Commercial use", link: "/commercial-use/" },
    { type: "link", display: "Filming in parks", link: "/commercial-use/filming-in-parks/" },
    { type: "link", display: "Travel trade", link: "/commercial-use/travel-trade/" },
  ]
  const menu2 = [
    { type: "header", display: "Get involved" },
    { type: "link", display: "Donate", link: "/get-involved/donate/" },
    { type: "link", display: "Buy a licence plate", link: "/get-involved/buy-licence-plate/" },
    { type: "link", display: "Volunteer", link: "/get-involved/volunteer/" },
  ]
  const menu3 = [
    { type: "header", display: "Stay connected" },
    { type: "link", display: "Contact us", link: "/contact/" },
    {
      type: "link",
      display: "BC Parks blog",
      link: "https://engage.gov.bc.ca/bcparksblog/",
    },
  ]
  const footerMenu = [menu1, menu2, menu3]
  const utilityMenu = [
    { display: "Sitemap", link: "/sitemap/" },
    { display: "Disclaimer", link: "https://www2.gov.bc.ca/gov/content/home/disclaimer" },
    { display: "Privacy", link: "https://www2.gov.bc.ca/gov/content/home/privacy" },
    { display: "Accessibility", link: "https://www2.gov.bc.ca/gov/content/home/accessible-government" },
    { display: "Copyright", link: "https://www2.gov.bc.ca/gov/content/home/copyright" },
  ]


  return (
    <>
      <footer id="footer">
        <div className="home-footer" id="home-footer">
          <div className="my-5 by-3">
            <div className="row">
              <div className="col col-12 col-md-4">
                <div className="text-center text-md-left" id="footer-logo">
                  <a href="/">
                    <img alt="BC Parks wordmark" src={bcParksWordmark} />
                  </a>
                </div>
              </div>
              <div className="col col-12 col-md-8">
                <div className="row">
                  {footerMenu.map((item, index) => (
                    <div className="col col-12 col-sm-4" key={index}>
                      <div>
                        <FooterMenu items={item} menuIndex={index}></FooterMenu>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="text-left text-sm-center py-3 mx-3 mx-md-0 mt-5 border-top border-white">
              {utilityMenu.map((item, index) => (
                <div
                  className="footer-utility-link d-inline-block"
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
