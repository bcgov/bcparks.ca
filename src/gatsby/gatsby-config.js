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
        skipFileDownloads: true,
        apiURL: process.env.STRAPI_SOURCE_URL || process.env.REACT_APP_CMS_BASE_URL,
        accessToken: process.env.STRAPI_TOKEN,
        collectionTypes: [
          "region",
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
          "management-document",
          "management-document-type",
          "biogeoclimatic-zone",
          "marine-ecosection",
          "terrestrial-ecosection",
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
                  fields: "*"
                },
                parkActivities: {
                  populate: ["activityType"]
                },
                parkFacilities: {
                  populate: ["facilityType"]
                },
                parkOperation: {
                  fields: "*"
                }
              }
            }
          },
          {
            singularName: "protected-area",
            queryParams: {
              populate: {
                parkNames: {
                  populate: ["parkNameType"]
                },
                parkActivities: {
                  populate: ["activityType"]
                },
                parkFacilities: {
                  populate: ["facilityType"]
                },
                parkOperation: {
                  fields: "*"
                },
                parkOperationSubAreas: {
                  fields: "*"
                },
                managementDocuments: {
                  populate: "*"
                },
                biogeoclimaticZones: {
                  populate: "*"
                },
                marineEcosections: {
                  populate: "*"
                },
                terrestrialEcosections: {
                  populate: "*"
                },
                seo: {
                  populate: "*"
                }
              }
            },
            queryLimit: 100
          }
        ]
      }
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
        name: `bcparks.ca`,
        short_name: `bcparks.ca`,
        start_url: `/`,
        background_color: `#003366`,
        theme_color: `#003366`,
        display: `minimal-ui`,
        icon: `src/images/bcid-favicon-32x32.png`, // This path is relative to the root of the site.
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
        sitemap: "https://bcparks.ca/sitemap-index.xml",
        resolveEnv: () => process.env.ENV_SUFFIX || 'dev',
        env: {
          'dev': {
            policy: [{userAgent: '*', disallow: ['/']}]
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
