// Create pages dynamically
const fetch = require(`node-fetch`)

exports.onPostBuild = ({ reporter }) => {
  reporter.info(`xxx  page has been built!`)
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  // Query for markdown nodes to use in creating pages.
  const result = await graphql(`
    {
      allStrapiProtectedArea(limit: -1) {
        nodes {
          id
          orcs
          protectedAreaName
        }
        totalCount
      }
    }
  `)
  // Handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  reporter.info(result)

  // parksData.forEach(park => {
  //   const pageName = park.protectedAreaName.toLowerCase().replace(/ /g, "-")
  //   createPage({
  //     path: pageName,
  //     component: require.resolve(`./src/templates/parkTemplate.js`),
  //     context: { park },
  //   })
  // })
}
