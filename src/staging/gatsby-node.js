const { graphql } = require("gatsby")
const slugify = require("slugify")

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
  `
  createTypes(typeDefs)
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const staticQuery = `
  {
    allStrapiPages(filter: {Slug: {nin: ["/home", "/alerts", "/explore"]}}) {
      totalCount
      nodes {
        id
        Slug
        Template
        Content
      }
    }
  }
  `

  await createParks({ graphql, actions })
  await createPageSlugs("static", staticQuery, { graphql, actions, reporter })
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
      path: park.urlPath,
      component: require.resolve(`./src/templates/park.js`),
      context: { ...park },
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
    })
  }
}
