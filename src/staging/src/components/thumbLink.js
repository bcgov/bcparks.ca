
import React from "react"
import { navigate, graphql, useStaticQuery } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image";

function goToLink(link) {
    navigate(link);
}

export default function ThumbLink({ imageLink, title, navLink }) {

    const query = useStaticQuery(graphql`
    query {
        images: allFile(
          filter: {sourceInstanceName: {eq: "images"}, relativeDirectory: {eq: "404"}}
        ) {
          edges {
            node {
              relativePath
              childImageSharp {
                gatsbyImageData(placeholder: BLURRED)
                fluid(maxWidth: 1000) {
                  base64
                  tracedSVG
                  srcWebp
                  srcSetWebp
                  originalImg
                  originalName
                }
              }
            }
          }
        }
      }
    `)

    const image = query.images.edges.find(
        img => img.node.relativePath === imageLink
    );

    return (
        <>
            <button className="btn btn-outline-primary thumb-link" onClick={() => goToLink(navLink)}>
                <div>
                    <GatsbyImage image={image.node.childImageSharp.gatsbyImageData}
                        alt={title} />
                    <div className="mt-2 text-left">
                        <h3 className="mb-1">{title}</h3>
                        <p>Learn more</p>
                    </div>
                </div>
            </button>
        </>
    )
}

