import axios from "axios"
const qs = require('qs');

const getAdvisoryTypeFromUrl = () => {
    let aType = "all", thisUrl = "", params
  
    if (typeof window !== "undefined" && window.document) {
      thisUrl = new URLSearchParams(window.location.search)
      params = Object.fromEntries(thisUrl.entries())
    }
  
    if (params && params.type) {
      aType = params.type
    }
    return aType
}

const loadAdvisories = (apiBaseUrl, orcsId) => {
  const params = qs.stringify({
    filters: {
      protectedAreas: {
        orcs: {
          $eq: orcsId
        }
      }
    },
    pagination: {
      limit: 100,
    }
  }, {
    encodeValuesOnly: true,
  })

  return axios.get(`${apiBaseUrl}/public-advisories/items?${params}`)
}

export {
    loadAdvisories,
    getAdvisoryTypeFromUrl
}