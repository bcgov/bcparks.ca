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
