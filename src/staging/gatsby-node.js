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

exports.createSchemaCustomization = ({ actions }) => {
  const { createFieldExtension, createTypes } = actions

  // Clean up any incoming slugs
  // TODO: make slug required in Strapi, after which this can be removed
  createFieldExtension({
    name: "parkPath",
    extend(options, prevFieldConfig) {
      return {
        resolve({ slug, protectedAreaName, orcs }) {
          if (slug) {
            return slug
          }
          // If we don't have a slug, fall back to name, then orcs
          if (protectedAreaName) {
            return `parks/${slugify(protectedAreaName)}`
          }
          return `parks/park-${orcs}`
        },
      }
    },
  })

  const typeDefs = `
  type StrapiParkAccessStatus implements Node {
    campfireBanEffectiveDate: Date
    color: String
    precedence: String
  }

  type StrapiActivityTypes implements Node {
    activityName: String
    activityCode: String
    rank: Int
  }

  type StrapiFacilityTypes implements Node {
    facilityNumber: Int
    facilityName: String
    facilityCode: String
    rank: Int
  }

  type StrapiParkAccessStatusParkActivities implements Node {
    description: String
  }

  type StrapiParkAccessStatusParkFacilities implements Node {
    description: String
  }

  type StrapiParkActivities implements Node {
    name: String
    description: String
    isActive: Boolean
    isActivityOpen: Boolean
    activityType: StrapiActivityTypes @link(by: "strapiId")
  }

  type StrapiParkFacilities implements Node {
    name: String
    description: String
    isActive: Boolean
    isFacilityOpen: Boolean
    facilityType: StrapiFacilityTypes @link(by: "strapiId")
  }

  type StrapiParkPhoto implements Node {
    orcs: Int
    isActive: Boolean
    sortOrder: Int
    isFeatured: Boolean
  }

  type StrapiProtectedArea implements Node {
    orcs: Int
    hasDayUsePass: Boolean
    isDisplayed: Boolean
    parkContact: String
    marineArea: Float
    urlPath: String @parkPath
    parkActivities: [StrapiParkActivities]
    parkFacilities: [StrapiParkFacilities]
    parkOperation: StrapiParkOperation
    parkOperationSubAreas: [StrapiParkOperationSubAreas]
  }

  type StrapiParkOperationSubAreaDates implements Node {
    operatingYear: String
  }

  type StrapiParkOperationSubAreaType implements Node {
    isActive: Boolean
    subAreaType: String
    subAreaTypeCode: String
    iconUrl: String
  }

  type StrapiParkOperation implements Node {
    openDate: Date
    closeDate: Date
    isActive: Boolean
    hasReservations: Boolean
    hasBackcountryReservations: Boolean
    hasBackcountryPermits: Boolean
    hasDayUsePass: Boolean
    hasFirstComeFirstServed: Boolean
    reservationUrl: String
    backcountryPermitUrl: String
    dayUsePassUrl: String
    hasParkGate: Boolean
    offSeasonUse: Boolean  
    totalCapacity: String
    frontcountrySites: String
    reservableSites: String
    nonReservableSites: String
    vehicleSites: String
    vehicleSitesReservable: String
    doubleSites: String
    pullThroughSites: String
    rvSites: String
    rvSitesReservable: String
    electrifiedSites: String
    longStaySites: String
    walkInSites: String
    walkInSitesReservable: String
    groupSites: String
    groupSitesReservable: String
    backcountrySites: String
    wildernessSites: String
    boatAccessSites: String
    horseSites: String
    cabins: String
    huts: String
    yurts: String
    shelters: String
    boatLaunches: String
    openNote: String
    serviceNote: String
    reservationsNote: String
    offSeasonNote: String
    generalNote: String
    adminNote: String
  }

  type StrapiParkOperationSubAreas implements Node {
    name: String
    isActive: Boolean
    isActivityOpen: Boolean
    totalCapacity: String
    frontcountrySites: String
    reservableSites: String
    nonReservableSites: String
    vehicleSites: String
    vehicleSitesReservable: String
    doubleSites: String
    pullThroughSites: String
    rvSites: String
    rvSitesReservable: String
    electrifiedSites: String
    longStaySites: String
    walkInSites: String
    walkInSitesReservable: String
    groupSites: String
    groupSitesReservable: String
    backcountrySites: String
    wildernessSites: String
    boatAccessSites: String
    horseSites: String
    cabins: String
    huts: String
    yurts: String
    shelters: String
    boatLaunches: String
    openNote: String
    serviceNote: String
    reservationsNote: String
    offSeasonNote: String
    adminNote: String
  }

  type StrapiPublicAdvisoryProtectedAreas implements Node {
    hasCampfireBan: String
    hasSmokingBan: String
  }

  type StrapiPublicAdvisory implements Node {
    accessStatus: StrapiParkAccessStatus
  }

  type StrapiMenus implements Node {
    title: String
    url: String
    imgUrl: String
  }

  type StrapiPageHeaderComponent implements Node {
    pageTitle: String
    introHtml: String
    imageUrl: String
    imageCaption: String
    imageAlt: String
  }

  type StrapiSeoComponent implements Node {
    metaKeywords: String
    metaTitle: String
    metaDescription: String
  }  

  type StrapiParkSubPages implements Node {
    slug: String
    title: String
    pageHeader: StrapiPageHeaderComponent
    seo: StrapiSeoComponent
    protectedArea: StrapiProtectedArea
  }

  type StrapiSites implements Node {
    siteName: String
    siteNumber: Int
    orcsSiteNumber: String
    protectedArea: StrapiProtectedArea
    parkActivities: [StrapiParkActivities]
    parkFacilities: [StrapiParkFacilities]
    parkOperation: StrapiParkOperation
  }
  `
  createTypes(typeDefs)
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const staticQuery = `
  {
    allStrapiPages(filter: {Slug: {nin: ["/home", "/active-advisories", "/find-a-park"]}}) {
      totalCount
      nodes {
        id
        Slug
        Title
        Template
        Content
      }
    }
  }
  `

  await createParks({ graphql, actions })
  await createParkSubPages({ graphql, actions })
  await createSites({ graphql, actions })
  await createPageSlugs("static", staticQuery, { graphql, actions, reporter })
  await createRedirects({ graphql, actions })
}

const parkQuery = `
{
  allStrapiProtectedArea(filter: {isDisplayed: {eq: true}}) {
    nodes {
      id
      orcs
      protectedAreaName
      slug  
      url
      oldUrl
    }
    totalCount
  }
}
`
const staticQueryPath = `
{ 
  allStrapiLegacyRedirect {
    nodes {
      toPath
      fromPath
    }
  }
}`

async function createRedirects({ graphql, actions, result }) {
  const response = await strapiApiRequest(graphql, staticQueryPath)
  const resultPark = await strapiApiRequest(graphql, parkQuery)

  const redirects = response.data.allStrapiLegacyRedirect.nodes
  const parks = resultPark.data.allStrapiProtectedArea.nodes

  redirects.map(item => {
    return actions.createRedirect({
      fromPath: item.fromPath,
      toPath: item.toPath,
    })
  })
  parks.map(park => {
    let oldUrl = '';
    try {
      oldUrl = parseUrl(park.oldUrl);
      if (oldUrl?.pathname !== `/${park.slug}/`) {
        return actions.createRedirect({
          fromPath: oldUrl.pathname,
          toPath: park.slug,
        })
      }
    } catch (error) {
      reporter.warn(`Field oldUrl for park ${park.id} not found, 
      error message: ${JSON.stringify(error)}
      

      ================
      
      park object: ${JSON.stringify(park)}
      `
      )
    }
  })
}

async function createParks({ graphql, actions, reporter }) {
  const parkQuery = `
  {
    allStrapiProtectedArea(filter: {isDisplayed: {eq: true}}) {
      nodes {
        id
        orcs
        protectedAreaName
        slug  
        urlPath
      }
      totalCount
    }
  }
  `
  const result = await strapiApiRequest(graphql, parkQuery)

  result.data.allStrapiProtectedArea.nodes.forEach(park => {
    actions.createPage({
      // add a trailing slash park pages so they are treated as folders
      // when resolving relative urls (so they can link to their child pages)
      path: park.urlPath.replace(/\/$|$/, `/`),
      component: require.resolve(`./src/templates/park.js`),
      context: { ...park },
    })
  })
}

async function createParkSubPages({ graphql, actions, reporter }) {
  const parkSubPageQuery = `
  {
    allStrapiParkSubPages {
      nodes {
        id
        slug
        title
        protectedArea {
          urlPath
        }
      }
    }
  }
  `
  const result = await strapiApiRequest(graphql, parkSubPageQuery)

  result.data.allStrapiParkSubPages.nodes.forEach(parkSubPage => {
    const parkPath = parkSubPage.protectedArea?.urlPath
    const parkSubPagePath = `${parkPath}/${parkSubPage.slug}`
    actions.createPage({
      path: parkSubPagePath,
      component: require.resolve(`./src/templates/parkSubPage.js`),
      context: { ...parkSubPage },
    })
  })
}

async function createSites({ graphql, actions, reporter }) {
  const siteQuery = `
  {
    allStrapiSites {
      nodes {
        id
        siteName
        siteNumber
        orcsSiteNumber
        protectedArea {
          urlPath
        }
      }
      totalCount
    }
  }
  `
  const result = await strapiApiRequest(graphql, siteQuery)

  result.data.allStrapiSites.nodes.forEach(site => {
    // TODO: slug can be deleted when site.slug has created on all strapi env
    const slug = slugify(site.siteName).toLowerCase()
    const parkPath = site.protectedArea?.urlPath
    // TODO: change sitePath `${parkPath}/${slug}` to `${parkPath}/${site.slug}` when site.slug has created on all strapi env
    let sitePath = `${parkPath}/${slug}`
    // If site doesn't have a relation with protectedArea, its path will be `parks/protected-area/${slug}`
    if (!parkPath) {
      sitePath = `parks/protected-area/${slug}`
    }
    actions.createPage({
      path: sitePath,
      component: require.resolve(`./src/templates/site.js`),
      context: { ...site },
    })
  })
}

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
    result.data.allStrapiPages.nodes.forEach(page => {
      actions.createPage({
        path: page.Slug,
        component: require.resolve(`./src/templates/${page.Template}.js`),
        context: { page },
      })
    })
  }
}

exports.onCreateWebpackConfig = ({ stage, loaders, actions }) => {
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
}
