import React from "react"
import { css } from "@emotion/react"
import { Link, graphql } from "gatsby"
import { rhythm } from "../utils/typography"
import Layout from "../components/layout"
import Header from "../components/header"
import Menu from "../components/menu"
import Footer from "../components/footer"
import HTMLArea from "../components/HTMLArea"
import Media from "../components/media"
import Zone from "../components/zone"

export const query = graphql`
  query {
    strapiWebsites(Name: { eq: "BCParks.ca"  }) {
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
  }
`

export default function Home({ data }) {
  return (
    <div>
      <Header>
        { data.strapiWebsites.Header}
      </Header>
      <Menu>
      { data.strapiWebsites.Navigation}
      </Menu>
      <div class="alert-banner">
      <span>Some parks are currently affected by wildfire activity. More details. </span>
      </div>
      <div class="park-search">
      <img src="http://localhost:1337/uploads/ID_4_3984_Valhalla_DBC_44ff0c4d8e.png" />
      <div><span id="search-title">Welcome to BC Parks</span>
      <span>Plan your next adventure by searching for campsites and day-use areas around B.C.</span>
      <span>
        <input type="search" id="park-search-box" name="park-search-box" value="Search by park name, location, activity …"></input>
        <svg class="search-icon-center-main">
          <ellipse id="search-icon-center-main" rx="34.5" ry="34.5" cx="34.5" cy="34.5">
          </ellipse>
		    </svg>
      </span>
     
      </div>
      </div>
      <div id='main'>      
          <Zone zoneID='Zone1' Content={data.strapiWebsites.homepage.Content[0]} />
          <Zone zoneID='Zone2' Content={data.strapiWebsites.homepage.Content[1]} />
          <Zone zoneID='Zone3' Content={data.strapiWebsites.homepage.Content[2]} />
          <Zone zoneID='Zone4' Content={data.strapiWebsites.homepage.Content[3]} />
          <Zone zoneID='Zone5' Content={data.strapiWebsites.homepage.Content[4]} />
      </div>
      <Footer>
        { data.strapiWebsites.Footer}
      </Footer>
    </div>
  )
        }
