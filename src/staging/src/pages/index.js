import React from "react"
import { graphql } from "gatsby"
import Header from "../components/header"
import Footer from "../components/footer"
import Zone from "../components/zone"
import Menu from "../components/menu"
import MainSearch from "../components/search/main-search"
import "../styles/home.scss"
import Exclamation from "../images/alert 32px.png"

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
    allStrapiPages {
      totalCount
      nodes {
        id
        Slug
        Template
        Content
      }
    }
    allStrapiActivityTypes(sort: { fields: activityName }) {
      totalCount
      nodes {
        activityName
        activityNumber
      }
    }
    allStrapiFacilityTypes(sort: { fields: facilityName }) {
      totalCount
      nodes {
        facilityName
        facilityNumber
      }
    }
    allStrapiProtectedArea(sort: { fields: protectedAreaName }) {
      nodes {
        parkActivities {
          activityType
          isActive
          isActivityOpen
          name
        }
        parkFacilities {
          facilityType
          isActive
          isFacilityOpen
          name
        }
        id
        orcs
        latitude
        longitude
        protectedAreaName
        slug
        parkNames {
          parkName
          id
          parkNameType
        }
        status
        typeCode
        marineProtectedArea
      }
    }
  }
`

export default function Home({ data }) {
  // ID 6 === Hero Carousel
  const zonesContent = data?.strapiWebsites?.homepage?.Content?.filter(c => c.id !== 6) || []
  const searchCarousel = data?.strapiWebsites?.homepage?.Content?.find(c => c.id === 6) || {}

  return (
    <div className="container-fluid px-0">
      <Header>
        {data.strapiWebsites.Header}
      </Header>
      <Menu>
        {data.strapiWebsites.Navigation}
      </Menu>
      <AdvisoryBar />
      <div className="park-search">
        <MainSearch
            data={{
              activities: data.allStrapiActivityTypes.nodes,
              facilities: data.allStrapiFacilityTypes.nodes,
              protectedAreas: data.allStrapiProtectedArea.nodes,
            }}
          />
        <div className="park-search-carousel">
          <Zone key={6} Content={searchCarousel}  />
          <div className="col-12 d-none d-sm-block text-center text-white" id="carousel-down"><i className="fa fa-chevron-down"></i></div>
        </div>
      </div>
      <div id="main">
        {zonesContent.map(content => <Zone key={content.id} zoneID={`Zone${content.id}`} Content={content} />)}
      </div>
      <Footer>
        {data.strapiWebsites.Footer}
      </Footer>
    </div>
  )
}

function AdvisoryBar() {
  return (
    <>
      <div className="alert alert-warning alert-dismissable rounded-0 d-block d-sm-none" role="alert" id="home-alert">
        <button type="button" className="close" data-dismiss="alert">×</button>
        <div className="row">
          <div className="col-1 pl-0"><img className="alert-exclamation" src={Exclamation} alt="exclamation" /></div>
          <div className="col-11 align-self-center"><span className="text-center">Some parks are currently affected by wildfire activity. <a href="#" className="d-inline-flex underline">See all advisories</a>.</span></div>
        </div>
      </div>
      <div className="alert alert-warning alert-dismissable rounded-0 d-none d-sm-block" role="alert" id="home-alert">
        <button type="button" className="close" data-dismiss="alert">×</button>
        <span className="text-center">
          <img className="alert-exclamation d-inline-flex pr-4" src={Exclamation} alt="exclamation" />
          Some parks are currently affected by wildfire activity. <a href="#" className="d-inline-flex underline">See all advisories</a>.
        </span>
      </div>
    </>
  )
}