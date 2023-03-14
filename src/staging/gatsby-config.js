require("dotenv").config({
  path: `.env`,
})

module.exports = {
  siteMetadata: {
    title: `BC Parks`,
    description: `BC Parks`,
    author: `@bcparks`,
    apiURL: process.env.REACT_APP_CMS_BASE_URL,
    siteUrl: process.env.REACT_APP_SITE_URL,
    image: 'https://nrs.objectstore.gov.bc.ca/kuwyyf/generic_social_1146x600_603acfb441.jpg'
  },
  plugins: [
    `gatsby-plugin-loadable-components-ssr`,
    {
      resolve: `gatsby-plugin-canonical-urls`,
      options: {
        siteUrl: `https://bcparks.ca`,
      },
    },
    `gatsby-plugin-sass`,
    `gatsby-plugin-image`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: "gatsby-source-strapi",
      options: {
        apiURL: process.env.STRAPI_API_URL,
        accessToken: process.env.STRAPI_TOKEN,
        collectionTypes: [
          "urgency",
          "public-advisory",
          "park-photo",
          "website",
          "activity-type",
          "facility-type",
          "menu",
          "park-operation",
          "access-status",
          "park-operation-sub-area",
          "park-sub-page",
          "legacy-redirect",
          {
            singularName: "page",
            queryParams: {
              populate: {
                Content: {
                  populate: "*"
                }
              }
            }
          },
          {
            singularName: "site",
            queryParams: {
              populate: {
                protectedArea: {
                  populate: "*"
                },
                parkActivities: {
                  populate: "*"
                },
                parkFacilities: {
                  populate: "*"
                },
                parkOperation: {
                  populate: "*"
                }
              }
            }
          },
          {
            singularName: "protected-area",
            queryParams: {
              populate: {
                parkNames: {
                  populate: "*"
                },
                parkActivities: {
                  populate: "*"
                },
                parkFacilities: {
                  populate: "*"
                },
                parkOperation: {
                  populate: "*"
                },
                parkOperationSubAreas: {
                  populate: "*"
                },
                seo: {
                  populate: "*"
                }
              }
            }
          }
        ],
        queryLimit: 1000,
      },
    },
    `gatsby-transformer-sharp`,
    {
      resolve: `gatsby-plugin-sharp`,
      options: {
        defaults: {
          formats: [`auto`, `webp`],
          placeholder: `dominantColor`,
          quality: 90,
        },
      },
    },
    {
      resolve: `gatsby-plugin-manifest`,
      options: {
        name: `gatsby-starter-default`,
        short_name: `starter`,
        start_url: `/`,
        background_color: `#663399`,
        theme_color: `#663399`,
        display: `minimal-ui`,
        icon: `src/images/bcid-favicon-32x32.png`, // This path is relative to the root of the site.
      },
    },
    {
      resolve: `gatsby-plugin-material-ui`,
      options: {
        stylesProvider: {
          injectFirst: true,
        },
      },
    },
    `gatsby-plugin-meta-redirect`,
    {
      resolve: `gatsby-plugin-sitemap`,
      options: {
        output: '/'
      }
    },
    {
      resolve: `gatsby-plugin-robots-txt`,
      options: {
        resolveEnv: () => process.env.ENV_SUFFIX || 'dev',
        env: {
          'dev': {
            policy: [{userAgent: '*', allow: ['/']}]
          },
          'test': {
            policy: [{userAgent: '*', disallow: ['/']}]
          },
          'prod': {
            policy: [{userAgent: '*', allow: ['/']}]
          },
        },
      },
    },
  ],
}
