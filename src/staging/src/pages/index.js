import React from "react"
import { graphql } from "gatsby"
import Header from "../components/header"
import Footer from "../components/footer"
import Zone from "../components/zone"
import MainSearch from "../components/search/mainSearch"
import { Container } from "@material-ui/core"
import { useMediaQuery } from "react-responsive"

// Temporary in-code images
import imgSearchBg from "../images/home/image006.png"
import imgCampingInfo from "../images/home/image012.png"
import imgThingsToDo from "../images/home/image013.png"
import imgAccessibility from "../images/home/image011.png"
import imgVisitResponsibly from "../images/home/image014.png"
import imgReconciliation from "../images/home/image007.png"
import imgWildlife from "../images/home/image010.png"
import imgConservation from "../images/home/image003.png"
import imgGetToKnow from "../images/home/image005.png"
import imgGetInvolved from "../images/home/image004.png"

import "../styles/home.scss"
import "../styles/gridCard.scss"

export const query = graphql`
  query {
    strapiWebsites(Name: { eq: "BCParks.ca" }) {
      Footer
      Header
      Name
      Navigation
      id
      homepage {
        id
        Template
        Content {
          id
          strapi_component
          HTML
        }
      }
    }
    allStrapiMenus(
      sort: { fields: order, order: ASC }
      filter: { show: { eq: true } }
    ) {
      nodes {
        strapiId
        title
        url
        order
        id
        strapiChildren {
          id
          title
          url
          order
          parent
        }
        strapiParent {
          id
          title
        }
      }
    }
  }
`

export default function Home({ data }) {
  const zonesContent =
    data?.strapiWebsites?.homepage?.Content?.filter(
      c => !c.HTML.includes("carousel")
    ) || []
  const searchCarousel =
    data?.strapiWebsites?.homepage?.Content?.find(c =>
      c.HTML.includes("carousel")
    ) || {}
  const menuContent = data?.allStrapiMenus?.nodes || []
  const isMobile = useMediaQuery({ query: '(max-width: 414px)' })

  const isLiveContent = false;

  return (
    <>
      { isLiveContent ? (
        <>
          <Container className="park-search-container-wrapper max-width-override" fixed disableGutters>
            <Header mode="internal" content={menuContent} />
            <div className="park-search">
              <MainSearch />
              <div className="park-search-carousel">
                <Zone key={6} Content={searchCarousel}  />
                <div className="col-12 d-none d-lg-block text-center text-white" id="carousel-down"><i className="fa fa-chevron-down"></i></div>
              </div>
            </div>
          </Container>
            <Container className="content-width-override" fixed disableGutters={isMobile ? true: false}>
              <div id="main">
                {zonesContent.map(content => <Zone key={content.id} zoneID={`Zone${content.id}`} Content={content} />)}
              </div>
            </Container>
          </>
      ) : (
        <>
          <Container className="park-search-container-wrapper max-width-override" fixed disableGutters>
            <Header mode="internal" content={menuContent} />
              <div className="park-search">
                <div id="home-parks-search">
                  <MainSearch />
                </div>
              <div className="park-search-carousel">
                <img src={imgSearchBg} alt="Mount Robson Park" />
              </div> 
            </div>
          </Container>
          <Container className="home-content-width-override" fixed disableGutters={isMobile ? true : false}>
            <div>
              <div>
                <div className="home-advisories text-center" id="home-advisories">
                  <h2 className="zone-header">Advisories</h2>
                  <div className="zone-hr"><hr/></div>
                  <p>
                  Updated Monday to Friday from 8:30 am to 4:30 pm, excluding statutory holidays.
                  </p>
                  <div className="home-advisory-buttons row no-gutters">
                    <div className="home-advisory-button col-12 col-lg-4 pr-sm-2">
                      <a href="/alerts?type=floods" className="btn btn-primary btn-block">
                        <span className="text-white">Parks impacted by <span className="font-weight-bold">flooding</span>
                        <i className="fa fa-chevron-circle-right"></i>
                        </span>
                      </a>
                    </div>
                    <div className="home-advisory-button col-12 col-lg-4 pr-sm-2">
                      <a className="btn btn-primary btn-block" href="/alerts?type=wildfires">
                        <span className="text-white">Parks impacted by <span className="font-weight-bold">wildfires</span> <span className="fa fa-chevron-circle-right"> </span>
                        </span>
                      </a>
                    </div>
                    <div className="home-advisory-button home-advisory-button--all col-12 col-lg-3 pr-sm-2">
                      <a className="btn btn-light btn-block" href="/alerts">
                        <span className="text-primary font-weight-bold">See all advisories </span>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Container>
          <Container className="home-content-width-override" fixed disableGutters={isMobile ? true: false}>
            <div id="main">
              <div className="text-center" id="home-plan-your-trip">
                <h2 className="zone-header">Plan your trip</h2>
                <div className="zone-hr"><hr/></div>
                <p className="zone-content">
                  <span>There's an adventure waiting for every visitor.</span>
                </p>
              </div>
              <div className="row">
                <div className="col-12 col-md-8 home-card-wrapper">
                  <a href="/reserve"className="card grid-card">
                    <div className="card-img">
                      <img src={imgCampingInfo} alt="People setting up a tent" />
                    </div>
                    <div className="card-body">
                      <h5 className="card-body-header">
                        Camping information
                      </h5>
                      <p className="card-text">
                      Reservation policies and fees.
                      </p>
                    </div>
                  </a>
                </div>
                <div className="col-12 col-md-4 home-card-wrapper">
                  <a href="/visiting" className="card grid-card">
                    <div className="card-img">
                      <img src={imgThingsToDo} alt="People with binoculars" />
                    </div>
                    <div className="card-body">
                      <h5 className="card-body-header">
                      Things to do
                      </h5>
                      <p className="card-text">
                      Explore activities and attractions.
                      </p>
                    </div>
                  </a>
                </div>
                <div className="col-12 col-md-4 home-card-wrapper">
                  <a href="/accessibility" className="card grid-card">
                    <div className="card-img">
                      <img src={imgAccessibility} alt="A child in a wheelchair" />    
                    </div>
                    <div className="card-body">
                      <h5 className="card-body-header">
                        Accessibility
                      </h5>
                      <p className="card-text">
                      BC Parks for everyone.
                      </p>
                    </div>
                  </a>
                </div>
                <div className="col-12 col-md-8 home-card-wrapper">
                  <a href="/responsible-recreation" className="card grid-card">
                    <div className="card-img">
                      <img src={imgVisitResponsibly} alt="Cleaning up after a dog" />    
                    </div>
                    <div className="card-body">
                      <h5 className="card-body-header">
                        Visit Responsibly
                      </h5>
                      <p className="card-text">
                      Guideline for a safe and respectful adventure.
                      </p>
                    </div>
                  </a>
                </div>
              </div>
              <div className="home-desktop-card-spacer">&nbsp;</div>
              <div className="row">
                <div className="col-12 home-card-wrapper">
                  <a href="/reconciliation" className="card grid-card grid-card--horz">
                    <div className="card-img">
                      <img src={imgReconciliation} alt="A wood carving" />    
                    </div>
                    <div className="card-body">
                      <h5 className="card-body-header">
                      Indigenous Relations and Reconciliation
                      </h5>
                      <div className="card-button">
                      Learn more <i className="fa fa-chevron-circle-right"></i>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-12 home-card-wrapper">
                  <a href="/wildlife-safety" className="card grid-card grid-card--horz">
                    <div className="card-img">
                      <img src={imgWildlife} alt="A Bighorn Sheep" />    
                    </div>
                    <div className="card-body">
                      <h5 className="card-body-header">
                        Wildlife Viewing and Safety
                      </h5>
                      <div className="card-button">
                      Learn more <i className="fa fa-chevron-circle-right"></i>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-12 home-card-wrapper">
                  <a href="/conserve" className="card grid-card grid-card--horz">
                    <div className="card-img">
                      <img src={imgConservation} alt="A mountain peak" />    
                    </div>
                    <div className="card-body">
                      <h5 className="card-body-header">
                        Conservation
                      </h5>
                      <div className="card-button">
                      Learn more <i className="fa fa-chevron-circle-right"></i>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-12 home-card-wrapper">
                  <a href="/news" className="card grid-card grid-card--horz">
                    <div className="card-img">
                      <img src={imgGetToKnow} alt="Family walking on a trail" />    
                    </div>
                    <div className="card-body">
                      <h5 className="card-body-header">
                        Get to know BC Parks
                      </h5>
                      <div className="card-button">
                      Learn more <i className="fa fa-chevron-circle-right"></i>
                      </div>
                    </div>
                  </a>
                </div>
                <div className="col-12 home-card-wrapper">
                  <a href="/get-involved" className="card grid-card grid-card--horz">
                    <div className="card-img">
                      <img src={imgGetInvolved} alt="People holding license plates" />    
                    </div>
                    <div className="card-body">
                      <h5 className="card-body-header">
                        Get Involved
                      </h5>
                      <div className="card-button">
                      Learn more <i className="fa fa-chevron-circle-right"></i>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </Container>
        </>
      )}
      <Container className="max-width-override" fixed disableGutters>
        <Footer>
          {data.strapiWebsites.Footer}
        </Footer>
      </Container>
    </>
  )
}
