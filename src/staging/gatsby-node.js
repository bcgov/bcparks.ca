// Create pages dynamically
const fetch = require(`node-fetch`)

exports.onPostBuild = ({ reporter }) => {
  reporter.info(`xxx  page has been built!`)
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
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  result.data.allStrapiProtectedArea.nodes.forEach(park => {
    const slug = park.slug
      ? park.slug
      : park.protectedAreaName.toLowerCase().replace(/ /g, "-")
    console.log(slug, park.slug)
    createPage({
      path: slug,
      component: require.resolve(`./src/templates/parkTemplate.js`),
      context: { orcs: park.orcs, park: park },
    })
  })
}
