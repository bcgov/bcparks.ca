module.exports = {
  routes: [
    {
      method: 'GET',
      path: '/search/parks',
      handler: 'search.searchParks',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/search/indexing/parks',
      handler: 'search.findParks',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/search/indexing/photos',
      handler: 'search.findParkPhotos',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/search/indexing/all',
      handler: 'search.setAllReindexNeeded',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ],
};
