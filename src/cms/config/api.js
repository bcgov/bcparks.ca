// https://docs.strapi.io/dev-docs/configurations/api

// has conflict with params http://localhost:1337/api/public-advisory-audits?pagination[page]=1&pagination[pageSize]=10
module.exports = {
  rest: {
    defaultLimit: 100,
    maxLimit: 2000
  },
};
