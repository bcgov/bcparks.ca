import React from "react"
import { Helmet } from "react-helmet"
import { graphql } from "gatsby"
import Header from "../components/header"
import Menu from "../components/menu"
import Footer from "../components/footer"
import Dropdown from "../components/dropdown"
import Zone from "../components/zone"

import {
    Container,
} from "@material-ui/core"

const IRRPage = ({ data }) => {

    const menuContent = data?.allStrapiMenus?.nodes || [];
    const pages = data?.strapiWebsites?.pages || [];
    let pageContent = [];
    let buttonContent = [{ id: 100, title: "About Indigenous Peoples in British Columbia", description: "Did you know there are 34 distinct First Nations culture/language groups and over 200 Indian Act Bands in British Columbia? To learn more about first Nations cultures, languages, and practices in BC, as well as more about appropriate terminology and pronounciations, please follow the links below:" },
    ]

    for (let page of pages) {
        if (page?.Slug == "/indigenous-relations") {
            pageContent = page.Content;
        }
    }

    return (
        <>
            <Helmet>
                <title>BC Parks | Indigenous Relations and Reconciliation</title>
            </Helmet>
            <Header mode="internal" content={menuContent} />
            <Menu>{data.strapiWebsites.Navigation}</Menu>
            <Container id="indigenous-relations">
                <div>
                    {pageContent.map(content => <Zone key={content.id} zoneID={`Zone${content.id}`} Content={content} />)}
                </div>
                <div className="text-block" id="indigeous-relations">
                    {buttonContent.map(content =>
                        <Dropdown
                            id={content.id}
                            title={content.title}
                            Content={content.description}
                        />
                    )}
                </div>
            </Container>
            <Footer>{data.strapiWebsites.Footer}</Footer>
        </>
    )
}

export default IRRPage;

export const query = graphql`
  {
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
      pages {
        Slug
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
      sort: {fields: order, order: ASC}
      filter: {show: {eq: true}}
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