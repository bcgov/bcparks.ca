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
      path: '/search/parknames',
      handler: 'search.parkAutocomplete',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/search/indexing/parks',
      handler: 'search.getParksForIndexing',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'GET',
      path: '/search/indexing/photos',
      handler: 'search.getParkPhotosForIndexing',
      config: {
        policies: [],
        middlewares: [],
      },
    },
    {
      method: 'POST',
      path: '/search/indexing/all',
      handler: 'search.queueAllParksForIndexing',
      config: {
        policies: [],
        middlewares: [],
      },
    }
  ],
};
