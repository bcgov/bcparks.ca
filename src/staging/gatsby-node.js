// Create pages dynamically
const fetch = require(`node-fetch`)

exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Pages have been built!`)
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions
  const typeDefs = `
  type StrapiParkAccessStatus implements Node {
    campfireBanEffectiveDate: Date
    color: String
    precedence: String
  }

  type StrapiParkAccessStatusParkActivities implements Node {
    description: String
  }

  type StrapiParkAccessStatusParkFacilities implements Node {
    description: String
  }

  type StrapiProtectedArea implements Node {
    isDayUsePass: String
    parkContact: String
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
  const { createPage } = actions

  const result = await graphql(`
    {
      allStrapiProtectedArea {
        nodes {
          id
          orcs
          protectedAreaName
          slug
        }
        totalCount
      }
    }
  `)
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(
      `Error while running GraphQL query - node create page.`
    )
    return
  }
  result.data.allStrapiProtectedArea.nodes.forEach(park => {
    const slug = park.slug
      ? park.slug
      : park.protectedAreaName.toLowerCase().replace(/ /g, "-")
    createPage({
      path: slug,
      component: require.resolve(`./src/templates/parkTemplate.js`),
      context: { orcs: park.orcs, park: park },
    })
  })
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