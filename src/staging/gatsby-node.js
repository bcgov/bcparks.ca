const { graphql } = require("gatsby")
const slugify = require("slugify")
const NodePolyfillPlugin = require("node-polyfill-webpack-plugin")
const parseUrl = require("parse-url")

const strapiApiRequest = (graphql, query) =>
  new Promise((resolve, reject) => {
    resolve(
      graphql(query).then(result => {
        if (result.errors) {
          reject(result.errors)
        }
        return result
      })
    )
  })

exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Pages have been built!`)
}

// exports.createSchemaCustomization = ({ actions }) => {
//   const { createTypes } = actions

//   const typeDefs = `
//   type StrapiParkAccessStatus implements Node {
//     campfireBanEffectiveDate: Date
//     color: String
//     precedence: String
//   }

//   type StrapiActivityType implements Node {
//     activityName: String
//     activityCode: String
//     rank: Int
//     isCamping: Boolean
//     defaultDescription: String
//   }

//   type StrapiFacilityType implements Node {
//     facilityNumber: Int
//     facilityName: String
//     facilityCode: String
//     rank: Int
//     isCamping: Boolean
//     defaultDescription: String
//   }

//   type StrapiParkAccessStatusParkActivity implements Node {
//     description: String
//   }

//   type StrapiParkAccessStatusParkFacility implements Node {
//     description: String
//   }

//   type StrapiParkActivity implements Node {
//     name: String
//     description: String
//     isActive: Boolean
//     isActivityOpen: Boolean
//     activityType: StrapiActivityTypes @link(by: "strapiId")
//   }

//   type StrapiParkFacility implements Node {
//     name: String
//     description: String
//     isActive: Boolean
//     isFacilityOpen: Boolean
//     facilityType: StrapiFacilityTypes @link(by: "strapiId")
//   }

//   type StrapiParkPhoto implements Node {
//     orcs: Int
//     isActive: Boolean
//     sortOrder: Int
//     isFeatured: Boolean
//   }

//   type StrapiProtectedArea implements Node {
//     orcs: Int
//     hasDayUsePass: Boolean
//     isDisplayed: Boolean
//     parkContact: String
//     marineArea: Float
//     urlPath: String @parkPath
//     parkActivities: [StrapiParkActivities]
//     parkFacilities: [StrapiParkFacilities]
//     parkOperation: StrapiParkOperation
//     parkOperationSubAreas: [StrapiParkOperationSubAreas]
//     seo: StrapiSeoComponent
//   }

//   type StrapiParkOperationSubAreaDate implements Node {
//     operatingYear: String
//   }

//   type StrapiParkOperationSubAreaType implements Node {
//     isActive: Boolean
//     subAreaType: String
//     subAreaTypeCode: String
//     iconUrl: String
//   }

//   type StrapiParkOperation implements Node {
//     openDate: Date
//     closeDate: Date
//     isActive: Boolean
//     hasReservations: Boolean
//     hasBackcountryReservations: Boolean
//     hasBackcountryPermits: Boolean
//     hasDayUsePass: Boolean
//     hasFirstComeFirstServed: Boolean
//     reservationUrl: String
//     backcountryPermitUrl: String
//     dayUsePassUrl: String
//     hasParkGate: Boolean
//     offSeasonUse: Boolean  
//     totalCapacity: String
//     frontcountrySites: String
//     reservableSites: String
//     nonReservableSites: String
//     vehicleSites: String
//     vehicleSitesReservable: String
//     doubleSites: String
//     pullThroughSites: String
//     rvSites: String
//     rvSitesReservable: String
//     electrifiedSites: String
//     longStaySites: String
//     walkInSites: String
//     walkInSitesReservable: String
//     groupSites: String
//     groupSitesReservable: String
//     backcountrySites: String
//     wildernessSites: String
//     boatAccessSites: String
//     horseSites: String
//     cabins: String
//     huts: String
//     yurts: String
//     shelters: String
//     boatLaunches: String
//     openNote: String
//     serviceNote: String
//     reservationsNote: String
//     offSeasonNote: String
//     generalNote: String
//     adminNote: String
//   }

//   type StrapiParkOperationSubArea implements Node {
//     name: String
//     isActive: Boolean
//     isActivityOpen: Boolean
//     totalCapacity: String
//     frontcountrySites: String
//     reservableSites: String
//     nonReservableSites: String
//     vehicleSites: String
//     vehicleSitesReservable: String
//     doubleSites: String
//     pullThroughSites: String
//     rvSites: String
//     rvSitesReservable: String
//     electrifiedSites: String
//     longStaySites: String
//     walkInSites: String
//     walkInSitesReservable: String
//     groupSites: String
//     groupSitesReservable: String
//     backcountrySites: String
//     wildernessSites: String
//     boatAccessSites: String
//     horseSites: String
//     cabins: String
//     huts: String
//     yurts: String
//     shelters: String
//     boatLaunches: String
//     openNote: String
//     serviceNote: String
//     reservationsNote: String
//     offSeasonNote: String
//     adminNote: String
//   }

//   type StrapiPublicAdvisoryProtectedArea implements Node {
//     hasCampfireBan: String
//     hasSmokingBan: String
//   }

//   type StrapiPublicAdvisory implements Node {
//     accessStatus: StrapiParkAccessStatus
//   }

//   type StrapiMenu implements Node {
//     title: String
//     url: String
//   }

//   type StrapiComponentParksPageHeader implements Node {
//     pageTitle: String
//     introHtml: String
//     imageUrl: String
//     imageCaption: String
//     imageAlt: String
//   }

//   type StrapiComponentParksSeo implements Node {
//     metaKeywords: String
//     metaTitle: String
//     metaDescription: String
//   }  

//   type StrapiParkSubPage implements Node {
//     slug: String
//     title: String
//     pageHeader: StrapiPageHeaderComponent
//     seo: StrapiSeoComponent
//     protectedArea: StrapiProtectedArea
//   }

//   type StrapiSite implements Node {
//     slug: String
//     siteName: String
//     siteNumber: Int
//     orcsSiteNumber: String
//     locationNotes: String
//     description: String
//     reservations: String
//     isDisplayed: Boolean
//     hasDayUsePass: Boolean
//     protectedArea: StrapiProtectedArea
//     parkActivities: [StrapiParkActivities]
//     parkFacilities: [StrapiParkFacilities]
//     parkOperation: StrapiParkOperation
//   }

//   type StrapiPage implements Node {
//     Title: String
//   }

//   type StrapiLegacyRedirect implements Node {
//     fromPath: String
//     toPath: String
//   }
//   `
//   createTypes(typeDefs)
// }

exports.createPages = async ({ graphql, actions, reporter }) => {
  const staticQuery = `
  {
    allStrapiPage(filter: {Slug: {nin: ["/home", "/active-advisories", "/find-a-park"]}}) {
      totalCount
      nodes {
        id
        Slug
        Title
        Template
        Content {
          ... on STRAPI__COMPONENT_PARKS_CARD_SET {
            id
            strapi_component
          }
          ... on STRAPI__COMPONENT_PARKS_HTML_AREA {
            id
            strapi_component
            HTML {
              data {
                HTML
              }
            }
          }
          ... on STRAPI__COMPONENT_PARKS_LINK_CARD {
            id
            strapi_component
            url
            title
            variation
            buttonText
            imageUrl
            imageAltText
          }
          ... on STRAPI__COMPONENT_PARKS_PAGE_HEADER {
            id
            strapi_component
            pageTitle
            imageUrl
            imageAlt
            imageCaption
            introHtml {
              data {
                introHtml
              }
            }
          }
          ... on STRAPI__COMPONENT_PARKS_PAGE_SECTION {
            id
            strapi_component
            sectionTitle
            sectionHTML {
              data {
                sectionHTML
              }
            }
          }
          ... on STRAPI__COMPONENT_PARKS_SEO {
            id
            strapi_component
            metaTitle
            metaKeywords
            metaDescription
          }
        }
      }
    }
  }
  `

  // await createParks({ graphql, actions })
  // await createParkSubPages({ graphql, actions })
  // await createSites({ graphql, actions })
  await createPageSlugs("static", staticQuery, { graphql, actions, reporter })
  // await createRedirects({ graphql, actions, reporter })
}

// const parkQuery = `
// {
//   allStrapiProtectedArea(filter: {isDisplayed: {eq: true}}) {
//     nodes {
//       id
//       orcs
//       protectedAreaName
//       slug  
//       url
//       oldUrl
//     }
//     totalCount
//   }
// }
// `
// const staticQueryPath = `
// { 
//   allStrapiLegacyRedirect {
//     nodes {
//       toPath
//       fromPath
//     }
//   }
// }`

// async function createRedirects({ graphql, actions, reporter }) {
//   const response = await strapiApiRequest(graphql, staticQueryPath)
//   const resultPark = await strapiApiRequest(graphql, parkQuery)

//   const redirects = response.data.allStrapiLegacyRedirect.nodes
//   const parks = resultPark.data.allStrapiProtectedArea.nodes

//   redirects.map(item => {
//     return actions.createRedirect({
//       fromPath: item.fromPath,
//       toPath: item.toPath,
//     })
//   })
//   parks.map(park => {
//     if (park.oldUrl) {
//       try {
//         const oldUrl = parseUrl(park.oldUrl);
//         if (oldUrl?.pathname !== `/${park.slug}/`) {
//           return actions.createRedirect({
//             fromPath: oldUrl.pathname,
//             toPath: park.slug,
//           })
//         }
//       } catch (error) {
//         reporter.warn(`Field oldUrl for park ${park.protectedAreaName} could not be parsed`)
//       }
//     }
//   })
// }

// async function createParks({ graphql, actions, reporter }) {
//   const parkQuery = `
//   {
//     allStrapiProtectedArea(filter: {isDisplayed: {eq: true}}) {
//       nodes {
//         id
//         orcs
//         protectedAreaName
//         slug  
//         urlPath
//       }
//       totalCount
//     }
//   }
//   `
//   const result = await strapiApiRequest(graphql, parkQuery)

//   result.data.allStrapiProtectedArea.nodes.forEach(park => {
//     actions.createPage({
//       // add a trailing slash park pages so they are treated as folders
//       // when resolving relative urls (so they can link to their child pages)
//       path: park.urlPath.replace(/\/$|$/, `/`),
//       component: require.resolve(`./src/templates/park.js`),
//       context: { ...park },
//     })
//   })
// }

// async function createParkSubPages({ graphql, actions, reporter }) {
//   const parkSubPageQuery = `
//   {
//     allStrapiParkSubPage {
//       nodes {
//         id
//         slug
//         title
//         protectedArea {
//           slug
//           urlPath
//         }
//       }
//     }
//   }
//   `
//   const result = await strapiApiRequest(graphql, parkSubPageQuery)

//   result.data.allStrapiParkSubPage.nodes.forEach(parkSubPage => {
//     const parkPath = parkSubPage.protectedArea?.urlPath
//     const parkSubPagePath = `${parkPath}/${parkSubPage.slug}`
//     actions.createPage({
//       path: parkSubPagePath.replace(/\/$|$/, `/`),
//       component: require.resolve(`./src/templates/parkSubPage.js`),
//       context: {
//         protectedAreaSlug: parkSubPage.protectedArea.slug,
//         ...parkSubPage 
//       },
//     })
//   })
// }

// async function createSites({ graphql, actions, reporter }) {
//   const siteQuery = `
//   {
//     allStrapiSite(filter: {isDisplayed: {eq: true}}) {
//       nodes {
//         id
//         slug
//         siteName
//         siteNumber
//         orcsSiteNumber
//         protectedArea {
//           urlPath
//         }
//       }
//       totalCount
//     }
//   }
//   `
//   const result = await strapiApiRequest(graphql, siteQuery)

//   result.data.allStrapiSite.nodes.forEach(site => {
//     // fallback in case site doesn't have a slug
//     const slug = site.slug || slugify(site.siteName).toLowerCase()
//     // fallback in case site doesn't have a relation with protectedArea
//     const parkPath = site.protectedArea?.urlPath ?? "no-protected-area"
//     const sitePath = `${parkPath}/${slug}`
//     actions.createPage({
//       path: sitePath.replace(/\/$|$/, `/`),
//       component: require.resolve(`./src/templates/site.js`),
//       context: { ...site },
//     })
//   })
// }

async function createPageSlugs(type, query, { graphql, actions, reporter }) {
  const result = await graphql(query)
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(
      `Error while running GraphQL query - node create page.`
    )
    return
  }

  if (type === "static") {
    result.data.allStrapiPage.nodes.forEach(page => {
      actions.createPage({
        path: page.Slug.replace(/\/$|$/, `/`),
        component: require.resolve(`./src/templates/${page.Template}.js`),
        context: { page },
      })
    })
  }
}

exports.onCreateWebpackConfig = ({ stage, loaders, actions, getConfig }) => {
  if (stage === "build-html" || stage === "develop-html") {
    actions.setWebpackConfig({
      module: {
        rules: [
          {
            test: /@arcgis/,
            use: loaders.null(),
          },
        ],
      },
      plugins: [new NodePolyfillPlugin()],
    })
  }
  if (stage === 'build-javascript' || stage === 'develop') {
    const config = getConfig()
    const miniCssExtractPlugin = config.plugins.find(
      plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
    )
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true
    }
    actions.replaceWebpackConfig(config)
  }
}
