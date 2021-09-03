// Create pages dynamically
const { graphql } = require("gatsby")
const fetch = require(`node-fetch`)

exports.onPostBuild = ({ reporter }) => {
  reporter.info(`Pages have been built!`)
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const { createPage } = actions
  const parkQuery = `
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
  `
  const staticQuery = `
  {
    allStrapiPages(filter: {Template: {eq: "StaticGeneral1"}}) {
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
  const dependencies = { graphql, actions, reporter }
  await createPageSlugs('park', parkQuery, dependencies)
  await createPageSlugs('static', staticQuery, dependencies)
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
  if (type === 'park') {
    result.data.allStrapiProtectedArea.nodes.forEach(park => {
      const slug = park.slug
        ? park.slug
        : park.protectedAreaName.toLowerCase().replace(/ /g, "-")
      actions.createPage({
        path: slug,
        component: require.resolve(`./src/templates/parkTemplate.js`),
        context: { orcs: park.orcs, park: park },
      })
    })
  }
  if (type === 'static') {
    result.data.allStrapiPages.nodes.forEach(page => {
      actions.createPage({
        path: page.Slug,
        component: require.resolve(`./src/templates/staticGeneral1.js`),
        context: { page },
      })
    })
  }
}