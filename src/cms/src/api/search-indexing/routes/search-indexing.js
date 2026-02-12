module.exports = {
  routes: [
    {
      method: "GET",
      path: "/search-indexing/parks",
      handler: "search-indexing.getParksForIndexing",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "GET",
      path: "/search-indexing/photos",
      handler: "search-indexing.getParkPhotosForIndexing",
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: "POST",
      path: "/search-indexing/all",
      handler: "search-indexing.queueAllParksForIndexing",
      config: {
        policies: [],
        middlewares: [],
      },
    },
  ],
};
