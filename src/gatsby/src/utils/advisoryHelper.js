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

export {
    getAdvisoryTypeFromUrl
}