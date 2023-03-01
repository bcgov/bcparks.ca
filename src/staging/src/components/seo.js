/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */
import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"

const Seo = ({ description, title, keywords, children }) => {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
            image
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const metaKeywords = keywords
  const defaultTitle = site.siteMetadata?.title
  const defaultImage = site.siteMetadata?.image

  return (
    <>
      <title>{title + ' | ' + defaultTitle}</title>
      <meta name="description" content={metaDescription} />
      <meta name="keywords" content={metaKeywords} />
      <meta name="og:title" content={title + ' | ' + defaultTitle} />
      <meta name="og:description" content={metaDescription} />
      <meta name="og:site_name" content={defaultTitle} />
      <meta name="og:type" content="website" />
      <meta name="og:image" content={defaultImage} />
      <meta name="twitter:title" content={title + ' | ' + defaultTitle} />
      <meta name="twitter:description" content={metaDescription} />
      <meta name="twitter:card" content={defaultImage} />
      {children}
    </>
  )
}

Seo.defaultProps = {
  description: ``,
  keywords: ''
}

Seo.propTypes = {
  description: PropTypes.string,
  title: PropTypes.string.isRequired,
  keywords: PropTypes.string
}

export default Seo
