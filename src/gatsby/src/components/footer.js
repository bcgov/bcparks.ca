import React from "react"
import { Link, graphql, useStaticQuery } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import { trackSnowplowEvent } from "../utils/snowplowHelper"
import "../styles/footer.scss"

function FooterMenu({ item, handleClick }) {
  // Sort children by order
  const sortedChildren = item.strapi_children && item.strapi_children.length > 0
    ? [...item.strapi_children].sort((a, b) => a.order - b.order) : []

  // URL is considered external if it begins with "http://" or "https://"
  const isExternalUrl = (url) => {
    return /^https?:\/\//.test(url)
  }

  return (
    // Do not render menu items with order > 3
    item.strapi_children.length > 0 && item.order < 4 && (
      <div className="col col-12 col-sm-4 footer-menu-container">
        <ul className="footer-menu-list list-unstyled text-white">
          <li>
            <div><b>{item.title}</b></div>
            <div className="footer-menu-divider"></div>
          </li>
          {sortedChildren.map((child, index) => (
            <li key={index} className="mt-2">
              {isExternalUrl(child.url) ?
                <a href={child.url} onClick={() => handleClick(child.url)} className="footer-menu-link">
                  {child.title}
                </a> : 
                <Link to={child.url} onClick={() => handleClick(child.url)} className="footer-menu-link">
                  {child.title}
                </Link>
              }
            </li>
          ))}
          {/* Add social media links if it's menu3 */}
          {item.order === 3 && (
            <li>
              <div className="d-inline-block mt-3">
                <a 
                  className="d-inline-block"
                  href="https://www.facebook.com/YourBCParks/"
                  onClick={() => handleClick("https://www.facebook.com/YourBCParks/")}
                >
                  <StaticImage
                    src="../images/Facebook_Negative.svg"
                    placeholder="none"
                    loading="eager"
                    alt="Facebook"
                  />
                </a>
              </div>
              <div className="d-inline-block mt-3 ms-3">
                <a
                  className="d-inline-block"
                  href="https://www.instagram.com/yourbcparks/"
                  onClick={() => handleClick("https://www.instagram.com/yourbcparks/")}
                >
                  <StaticImage
                    src="../images/Instagram_Negative.svg"
                    placeholder="none"
                    loading="eager"
                    alt="Instagram"
                  />
                </a>
              </div>
            </li>
          )}
        </ul>
      </div>
    )
  )
}

export default function Footer() {
  const data = useStaticQuery(graphql`{
      allStrapiFooterMenu(
        sort: {order: ASC}
      ) {
        nodes {
          title
          order
          strapi_children {
            title
            order
            url
          }
        }
      }
    }
  `)

  const footerMenu = data?.allStrapiFooterMenu?.nodes || []
  const utilityMenu = [
    { title: "Site map", url: "/site-map/" },
    { title: "Disclaimer", url: "https://www2.gov.bc.ca/gov/content/home/disclaimer" },
    { title: "Privacy", url: "https://www2.gov.bc.ca/gov/content/home/privacy" },
    { title: "Accessibility", url: "https://www2.gov.bc.ca/gov/content/home/accessible-government" },
    { title: "Copyright", url: "https://www2.gov.bc.ca/gov/content/home/copyright" },
  ]

  const handleClick = (url) => {
    trackSnowplowEvent(
      "link_click",
      null,
      null,
      null,
      url,
      {}
    )
  }

  return (
    <footer id="footer">
      <div className="home-footer" id="home-footer">
        <div className="row g-0">
          <div className="col col-12 col-md-4">
            <div className="mb-5">
              <Link className="d-inline-block" to="/" onClick={() => handleClick("/")}>
                <StaticImage
                  src="../images/BCParks_Wordmark_White-cropped.svg"
                  placeholder="none"
                  loading="eager"
                  height={48}
                  alt="BC Parks Wordmark"
                />
              </Link>
            </div>
          </div>
          <div className="col col-12 col-md-8">
            <div className="row g-0">
              {footerMenu.map((item, index) => (
                <FooterMenu item={item} key={index} handleClick={handleClick} />
              ))}
            </div>
          </div>
        </div>
        <div className="text-start text-sm-center pt-4 mt-5 border-top border-white">
          {utilityMenu.map((item, index) => (
            <div
              className="footer-utility-link d-inline-block"
              key={index}
            >
              <a href={item.url} onClick={() => handleClick(item.url)}>
                {item.title}
              </a>
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
