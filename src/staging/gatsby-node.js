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
  }

  type StrapiFacilityTypes implements Node {
    facilityName: String
    facilityCode: String
  }

  type StrapiParkAccessStatusParkActivities implements Node {
    description: String
  }

  type StrapiParkAccessStatusParkFacilities implements Node {
    description: String
  }

  type StrapiParkActivities implements Node {
    name: String
    isActive: Boolean
    isActivityOpen: Boolean
    activityType: StrapiActivityTypes @link(by: "strapiId")
  }

  type StrapiParkFacilities implements Node {
    name: String
    isActive: Boolean
    isActivityOpen: Boolean
    facilityType: StrapiFacilityTypes @link(by: "strapiId")
  }

  type StrapiParkOperation implements Node {
    orcs: Int
    isActive: Boolean 
    hasReservations: Boolean
  }

  type StrapiParkPhoto implements Node {
    orcs: Int
    isActive: Boolean
  }

  type StrapiProtectedArea implements Node {
    orcs: Int
    hasDayUsePass: String
    parkContact: String
    urlPath: String @parkPath
    parkActivities: [StrapiParkActivities]
    parkFacilities: [StrapiParkFacilities]
  }

  type StrapiPublicAdvisoryProtectedAreas implements Node {
    hasCampfireBan: String
    hasSmokingBan: String
  }

  type StrapiPublicAdvisory implements Node {
    accessStatus: StrapiParkAccessStatus
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
  await createPageSlugs('static', staticQuery, { graphql, actions, reporter })
}

async function createParks({ graphql, actions, reporter }) {
  const parkQuery = `
  {
    allStrapiProtectedArea {
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
      component: require.resolve(`./src/templates/park.js`) ,
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

  if (type === 'static') {
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
