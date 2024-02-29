import React from "react"
import { graphql, useStaticQuery, Link } from "gatsby"
import { StaticImage } from "gatsby-plugin-image"

import "../styles/footer.scss"

function FooterMenu({ item, menuIndex }) {
  return (
    item.strapi_children.length > 0 && (
      <div className="col col-12 col-sm-4 footer-menu-container" key={menuIndex}>
        <ul className="footer-menu-list list-unstyled text-white">
          <li>
            <div className="font-weight-bold">{item.title}</div>
            <div className="footer-menu-divider"></div>
          </li>
          {item.strapi_children.map((child, index) => (
            <li key={index} className="mt-2">
              {child.isExternalUrl ?
                <a href={child.url} target="_blank" rel="noopener noreferrer">
                  {child.title}
                </a>
                :
                <Link to={child.url}>
                  {child.title}
                </Link>
              }
            </li>
          ))}
          {/* Add social media links if it's menu3 */}
          {item.order === 3 && (
            <li>
              <div className="d-inline-block mt-3">
                <a className="d-inline-block" href="https://www.facebook.com/YourBCParks/" target="_blank" rel="noopener noreferrer">
                  <StaticImage
                    src="../images/Facebook_Negative.svg"
                    placeholder="none"
                    loading="eager"
                    alt="Facebook"
                  />
                </a>
              </div>
              <div className="d-inline-block mt-3 ml-3">
                <a className="d-inline-block" href="https://www.instagram.com/yourbcparks" target="_blank" rel="noopener noreferrer">
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
            isExternalUrl
          }
        }
      }
    }
  `)

  const footerMenu = data?.allStrapiFooterMenu?.nodes || []
  const utilityMenu = [
    { title: "Site map", url: "/site-map/", isExternalUrl: false },
    { title: "Disclaimer", url: "https://www2.gov.bc.ca/gov/content/home/disclaimer", isExternalUrl: true },
    { title: "Privacy", url: "https://www2.gov.bc.ca/gov/content/home/privacy", isExternalUrl: true },
    { title: "Accessibility", url: "https://www2.gov.bc.ca/gov/content/home/accessible-government", isExternalUrl: true },
    { title: "Copyright", url: "https://www2.gov.bc.ca/gov/content/home/copyright", isExternalUrl: true },
  ]

  return (
    <footer id="footer">
      <div className="home-footer" id="home-footer">
        <div className="row no-gutters">
          <div className="col col-12 col-md-4">
            <div className="mb-5">
              <a className="d-inline-block" href="/">
                <StaticImage
                  src="../images/BCParks_Wordmark_White-cropped.svg"
                  placeholder="none"
                  loading="eager"
                  height={48}
                  alt="BC Parks Wordmark"
                />
              </a>
            </div>
          </div>
          <div className="col col-12 col-md-8">
            <div className="row no-gutters">
              {footerMenu.map((item, index) => (
                <FooterMenu item={item} menuIndex={index} />
              ))}
            </div>
          </div>
        </div>
        <div className="text-left text-sm-center pt-4 mt-5 border-top border-white">
          {utilityMenu.map((item, index) => (
            <div
              className="footer-utility-link d-inline-block"
              key={index}
            >
              <a href={item.link}>{item.display}</a>
              {item.isExternalUrl ?
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
                :
                <Link to={item.url}>
                  {item.title}
                </Link>
              }
            </div>
          ))}
        </div>
      </div>
    </footer>
  )
}
