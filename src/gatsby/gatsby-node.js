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
  const { createTypes } = actions

  const typeDefs = `
  type STRAPI_BIOGEOCLIMATIC_ZONE implements Node @dontInfer {
    zone: String
    zoneCode: String
    protectedAreas: [STRAPI_PROTECTED_AREA] @link(by: "id", from: "protectedAreas___NODE")
  }

  type STRAPI_MARINE_ECOSECTION implements Node @dontInfer {
    marineEcosectionId: Int
    marineEcosection: String
    marineEcosectionCode: String
    protectedAreas: [STRAPI_PROTECTED_AREA] @link(by: "id", from: "protectedAreas___NODE")
  }

  type STRAPI_TERRESTRIAL_ECOSECTION implements Node @dontInfer {
    terrestrialEcosectionId: Int
    terrestrialEcosection: String
    terrestrialEcosectionCode: String
    parentEcoregionCode: String
    protectedAreas: [STRAPI_PROTECTED_AREA] @link(by: "id", from: "protectedAreas___NODE")
  }

  type STRAPI_PROTECTED_AREA implements Node {
    biogeoclimaticZones: [STRAPI_BIOGEOCLIMATIC_ZONE] @link(by: "id", from: "biogeoclimaticZones___NODE")
    marineEcosections: [STRAPI_MARINE_ECOSECTION] @link(by: "id", from: "marineEcosections___NODE")
    terrestrialEcosections: [STRAPI_TERRESTRIAL_ECOSECTION] @link(by: "id", from: "terrestrialEcosections___NODE")
    seo: STRAPI_COMPONENT_PARKS_SEO
  }

  type STRAPI_PARK_OPERATION implements Node {
    totalCapacity: String
  }

  type STRAPI_PARK_OPERATION_SUB_AREA implements Node {
    nonReservableSites: String
    vehicleSitesReservable: String
    pullThroughSites: String
    rvSitesReservable: String
    longStaySites: String
    groupSitesReservable: String
    boatLaunches: String
  }

  type STRAPI_COMPONENT_PARKS_SEO implements Node {
    metaKeywords: String
    metaTitle: String
    metaDescription: String
  }

  type STRAPI_SITE implements Node {
    parkOperation: STRAPI_PARK_OPERATION
  }

  type STRAPI_MANAGEMENT_DOCUMENT_TYPE implements Node {
    documentCode: String
    documentType: String
    description: String
  }

  type STRAPI_MANAGEMENT_DOCUMENT implements Node {
    title: String
    url: String
    description: String
    documentDate: Date
    documentType: STRAPI_MANAGEMENT_DOCUMENT_TYPE @link(by: "id", from: "documentType___NODE")
    protectedAreas: [STRAPI_PROTECTED_AREA] @link(by: "id", from: "protectedAreas___NODE")
    sites: [STRAPI_SITE] @link(by: "id", from: "sites___NODE")
  }
  `
  createTypes(typeDefs)
}

exports.createPages = async ({ graphql, actions, reporter }) => {
  const pageQuery = `
  {
    allStrapiPage(filter: {Slug: {nin: ["/home", "/active-advisories", "/find-a-park"]}}) {
      nodes {
        id
        Slug
        Title
        Template
        Content {
          ... on STRAPI__COMPONENT_PARKS_CARD_SET {
            id
            strapi_component
            cards {
              id
              url
              title
              subTitle
              buttonText
              imageUrl
              imageAltText
              variation
            }
          }
          ... on STRAPI__COMPONENT_PARKS_HTML_AREA {
            id
            strapi_component
            HTML {
              data {
                HTML
              }
            }
          }
          ... on STRAPI__COMPONENT_PARKS_LINK_CARD {
            id
            strapi_component
            url
            title
            subTitle
            buttonText
            imageUrl
            imageAltText
            variation
          }
          ... on STRAPI__COMPONENT_PARKS_PAGE_HEADER {
            id
            strapi_component
            pageTitle
            imageUrl
            introHtml {
              data {
                introHtml
              }
            }
          }
          ... on STRAPI__COMPONENT_PARKS_PAGE_SECTION {
            id
            strapi_id
            strapi_component
            sectionTitle
            sectionHTML {
              data {
                sectionHTML
              }
            }
          }
          ... on STRAPI__COMPONENT_PARKS_SEO {
            id
            strapi_component
            metaTitle
            metaKeywords
            metaDescription
          }
        }
      }
      totalCount
    }
  }
  `
  const parkQuery = `
  {
    allStrapiProtectedArea(filter: {isDisplayed: {eq: true}}) {
      nodes {
        id
        orcs
        slug
        protectedAreaName
        url
        oldUrl
      }
      totalCount
    }
  }
  `
  const siteQuery = `
  {
    allStrapiSite(filter: {isDisplayed: {eq: true}}) {
      nodes {
        id
        slug
        siteName
        siteNumber
        orcsSiteNumber
        protectedArea {
          slug
        }
      }
      totalCount
    }
  }
  `
  const parkSubQuery = `
  {
    allStrapiParkSubPage {
      nodes {
        id
        slug
        title
        protectedArea {
          slug
        }
      }
    }
  }
  `
  const redirectQuery = `
  { 
    allStrapiLegacyRedirect {
      nodes {
        toPath
        fromPath
      }
    }
  }
  `

  await createStaticPage(pageQuery, { graphql, actions, reporter })
  await createParkPage(parkQuery, { graphql, actions, reporter })
  await createSitePage(siteQuery, { graphql, actions, reporter })
  await createParkSubPages(parkSubQuery, { graphql, actions, reporter })
  await createRedirects(parkQuery, redirectQuery, { graphql, actions, reporter })
}

async function createStaticPage(query, { graphql, actions, reporter }) {
  const result = await graphql(query)
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query - node create page.`)
    return
  }
  result.data.allStrapiPage.nodes.forEach(page => {
    actions.createPage({
      path: page.Slug.replace(/\/$|$/, `/`),
      component: require.resolve(`./src/templates/${page.Template}.js`),
      context: { page },
    })
  })
}
  
async function createParkPage(query, { graphql, actions, reporter }) {
  const result = await strapiApiRequest(graphql, query)
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query - node create park page.`)
    return
  }
  result.data.allStrapiProtectedArea.nodes.forEach(park => {
    actions.createPage({
      path: park.slug.replace(/\/$|$/, `/`),
      component: require.resolve(`./src/templates/park.js`),
      context: { ...park },
    })
  })
}
    
async function createSitePage(query, { graphql, actions, reporter }) {
  const result = await strapiApiRequest(graphql, query)
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query - node create site page.`)
    return
  }
  result.data.allStrapiSite.nodes.forEach(site => {
    // fallback in case site doesn't have a slug
    const slug = site.slug || slugify(site.siteName).toLowerCase()
    // fallback in case site doesn't have a relation with protectedArea
    const parkPath = site.protectedArea?.slug ?? "no-protected-area"
    const sitePath = `${parkPath}/${slug}`
    actions.createPage({
      path: sitePath.replace(/\/$|$/, `/`),
      component: require.resolve(`./src/templates/site.js`),
      context: { ...site },
    })
  })
}

async function createParkSubPages(query, { graphql, actions, reporter }) {
  const result = await strapiApiRequest(graphql, query)
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query - node create park sub page.`)
    return
  }
  result.data.allStrapiParkSubPage.nodes.forEach(parkSubPage => {
    // fallback in case site doesn't have a relation with protectedArea
    const parkPath = parkSubPage.protectedArea?.slug ?? "no-protected-area"
    const parkSubPagePath = `${parkPath}/${parkSubPage.slug}`
    actions.createPage({
      path: parkSubPagePath.replace(/\/$|$/, `/`),
      component: require.resolve(`./src/templates/parkSubPage.js`),
      context: {
        protectedAreaSlug: parkSubPage.protectedArea?.slug,
        ...parkSubPage 
      },
    })
  })
}

async function createRedirects(parkQuery, redirectQuery, { graphql, actions, reporter }) {
  const response = await strapiApiRequest(graphql, redirectQuery)
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
    if (park.oldUrl) {
      try {
        const oldUrl = parseUrl(park.oldUrl);
        if (oldUrl?.pathname !== `/${park.slug}/`) {
          return actions.createRedirect({
            fromPath: oldUrl.pathname,
            toPath: park.slug,
          })
        }
      } catch (error) {
        reporter.warn(`Field oldUrl for park ${park.protectedAreaName} could not be parsed`)
      }
    }
  })
}

exports.onCreateWebpackConfig = ({ stage, loaders, actions, getConfig }) => {
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
  if (stage === 'build-javascript' || stage === 'develop') {
    const config = getConfig()
    const miniCssExtractPlugin = config.plugins.find(
      plugin => plugin.constructor.name === 'MiniCssExtractPlugin'
    )
    if (miniCssExtractPlugin) {
      miniCssExtractPlugin.options.ignoreOrder = true
    }
    actions.replaceWebpackConfig(config)
  }
}
