// Create pages dynamically
exports.onPostBuild = ({ reporter }) => {
  reporter.info(`xxx  page has been built!`)
}

exports.createPages = async ({ graphql, actions }) => {
  const { createPage } = actions
  const parks = await fetch(
    `http://localhost:1337/protected-areas/status?_limit=10`
  )
  const parksData = await parks.json()

  parksData.forEach(park => {
    const pageName = park.protectedAreaName.toLowerCase().replace(/ /g, "-")
    createPage({
      path: pageName,
      component: require.resolve(`./src/templates/parkTemplate.js`),
      context: { park },
    })
  })
}
