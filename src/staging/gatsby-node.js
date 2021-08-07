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
    const pageName = park.protectedAreaName.toLowerCase().replace(/ /g, "-")
    console.log(park.orcs)
    createPage({
      path: pageName,
      component: require.resolve(`./src/templates/parkTemplate.js`),
      context: { orcs: park.orcs, park: park },
    })
  })
}


