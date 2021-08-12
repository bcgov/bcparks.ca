// Create pages dynamically
const fetch = require(`node-fetch`)

exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Pages have been built!`)
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions

  const result = await graphql(`
    {
      allStrapiProtectedArea(filter: { orcs: { lt: 50 } }) {
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
