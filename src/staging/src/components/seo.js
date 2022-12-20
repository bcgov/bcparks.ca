/**
 * SEO component that queries for data with
 *  Gatsby's useStaticQuery React hook
 *
 * See: https://www.gatsbyjs.com/docs/use-static-query/
 */
import * as React from "react"
import PropTypes from "prop-types"
import { useStaticQuery, graphql } from "gatsby"
import { Helmet } from "react-helmet"

function SEO({ canonical, description, lang, meta, title, keywords }) {
  const { site } = useStaticQuery(
    graphql`
      query {
        site {
          siteMetadata {
            title
            description
            author
          }
        }
      }
    `
  )

  const metaDescription = description || site.siteMetadata.description
  const metaKeywords = keywords || site.siteMetadata.keywords
  const defaultTitle = site.siteMetadata?.title

  return (
    <Helmet
      htmlAttributes={{
        lang,
      }}
      title={title}
      titleTemplate={defaultTitle ? `%s | ${defaultTitle}` : null}
      link={
        canonical
        ? [{ rel: 'canonical', key: canonical, href: canonical }]
        : []
      }
      meta={[
        {
          name: `description`,
          content: metaDescription,
        },
        {
          name: `keywords`,
          content: metaKeywords,
        },
        {
          property: `og:title`,
          content: `${title} | ${defaultTitle}`,
        },
        {
          property: `og:description`,
          content: metaDescription,
        },
        {
          property: `og:image`,
          content: `https://nrs.objectstore.gov.bc.ca/kuwyyf/generic_social_1146x600_603acfb441.jpg`,
        },
        {
          name: `twitter:card`,
          content: `https://nrs.objectstore.gov.bc.ca/kuwyyf/generic_social_1146x600_603acfb441.jpg`,
        },
        {
          property: `og:site_name`,
          content: `BC Parks`,
        },
        {
          property: `og:url`,
          content: `https://bcparks.ca`,
        },
        {
          property: `og:type`,
          content: `website`,
        }
      ].concat(meta)}
    />
  )
}

SEO.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``,
  keywords: ''
}

SEO.propTypes = {
  canonical: PropTypes.string,
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired,
  keywords: PropTypes.string
}

export default SEO
