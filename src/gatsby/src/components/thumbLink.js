
import React from "react"
import { navigate, graphql, useStaticQuery } from "gatsby"
import { GatsbyImage } from "gatsby-plugin-image";

export default function ThumbLink({ imageLink, title, navLink }) {

  const query = useStaticQuery(graphql`
    query {
        images: allFile(
          filter: {sourceInstanceName: {eq: "images"}, relativeDirectory: {eq: "404"}}
        ) {
          nodes {
            relativePath
            childImageSharp {
              gatsbyImageData(placeholder: BLURRED)
            }
          }
        }
      }
  `)

  const image = query.images.nodes.find(
    img => img.relativePath === imageLink
  );

  return (
    <div className="col-lg-4 col-md-12 mt-2">
      <button className="btn btn-outline-primary thumb-link" onClick={() => navigate(navLink)}>
        <div>
          <GatsbyImage image={image.childImageSharp.gatsbyImageData} alt={title} />
          <div className="mt-4 text-left">
            <h3>{title}</h3>
          </div>
        </div>
      </button>
    </div>
  )
}

