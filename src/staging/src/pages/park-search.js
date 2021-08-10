import React from "react"
import { Link, graphql } from "gatsby"
import Header from "../components/header"
import Menu from "../components/menu"
import Footer from "../components/footer"
import "../styles/search.scss"
import { Divider } from "@material-ui/core"

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
  }
`

export default function Home({ location, data }) {
  const searchResults = location.state.searchResults
  return (
    <div>
      <Header>{data.strapiWebsites.Header}</Header>
      <Menu>{data.strapiWebsites.Navigation}</Menu>

      <div id="search-results">
        <div className="container">
          {!searchResults || (searchResults.length == 0 && <p>No results</p>)}
          <div>
            {searchResults && searchResults.length > 0 && (
              <div>
                {searchResults.length} parks found
                <br />
                <br />
                {searchResults.map((r, index1) => (
                  <div key={index1}>
                    <div>
                      <b>
                        {index1 + 1}
                        {")"} {r.protectedAreaName}
                      </b>
                    </div>
                    <Divider />
                    <br />
                    <div className="row">
                      <div className="col-6">
                        Activities:
                        <div>
                          {r.parkActivities.map((a, index2) => (
                            <div key={index2}>{a.name.split(":")[1]}</div>
                          ))}
                        </div>
                      </div>
                      <div className="col-6">
                        Facilities:
                        <div>
                          {r.parkFacilities.map((f, index3) => (
                            <div key={index3}>{f.name.split(":")[1]}</div>
                          ))}
                        </div>
                      </div>
                    </div>
                    <br />
                    Other names:
                    <div>
                      {r.parkNames.map((n, index4) => (
                        <div key={index4}>{n.parkName}</div>
                      ))}
                    </div>
                    <br />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer>{data.strapiWebsites.Footer}</Footer>
    </div>
  )
}
