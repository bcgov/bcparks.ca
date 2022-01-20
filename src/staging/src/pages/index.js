import React from "react"
import { graphql } from "gatsby"
import Header from "../components/header"
import Footer from "../components/footer"
import Zone from "../components/zone"
import MainSearch from "../components/search/mainSearch"
import { Container } from "@material-ui/core"
import { useMediaQuery } from "react-responsive"

import "../styles/home.scss"

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

const TestCard = ({col, orientation}) => {
  return (
    <>
      <div className={'col-12 col-md-' + col + ' card-col-padding'} onclick="location.href='/reserve'">
        <div className={'card grid-card grid-card-' + orientation }>
          <div class="card-img">
            <img src="http://localhost:1337/uploads/homepage_camping_769a1e5d9e.jpg" alt="People setting up a tent" />    
          </div>
          <div class="card-body">
            <h5 class="card-body-header">
              <a href="/reserve">Camping information</a>
            </h5>
            <p class="card-text">
              Reservation policies and fees.
            </p>
            <div class="card-button">
              Learn more <i class="fa fa-chevron-circle-right"></i>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

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

  return (
    <>
      <Container className="park-search-container-wrapper max-width-override" fixed disableGutters>
        <Header mode="internal" content={menuContent} />
        <div className="park-search">
          <MainSearch
              data={{
                activities: data.allStrapiActivityTypes.nodes,
                facilities: data.allStrapiFacilityTypes.nodes,
                protectedAreas: data.allStrapiProtectedArea.nodes,
              }}
            />
          <div className="park-search-carousel">
            <Zone key={6} Content={searchCarousel} />
          </div>
        </div>
      </Container>
      <Container className="content-width-override" fixed disableGutters={isMobile ? true: false}>
        <div id="main">
          <div className="row">
            <TestCard col={8}></TestCard>
            <TestCard col={4}></TestCard>
            <TestCard col={4}></TestCard>
            <TestCard col={8}></TestCard>
            <br/><br />
            <TestCard col={12} orientation={'horz'}></TestCard>
            <TestCard col={12} orientation={'horz'}></TestCard>
          </div>
          {zonesContent.map(content => <Zone key={content.id} zoneID={`Zone${content.id}`} Content={content} />)}
        </div>
      </Container>
      <Container className="max-width-override" fixed disableGutters>
        <Footer>
          {data.strapiWebsites.Footer}
        </Footer>
      </Container>
    </>
  )
}
