
// // https://github.com/strapi/strapi/issues/11637
// default-src 'none'; connect-src 'self'; script-src 'self'; img-src * data:; style-src 'self' 'unsafe-inline'; frame-src *

module.exports = [
  "strapi::errors",
  "strapi::security",
  "strapi::cors",
  "strapi::poweredBy",
  {
    // doc https://docs.strapi.io/dev-docs/configurations/middlewares#cors
    name: "strapi::cors",
    config: {
      enabled: true,
      headers: "*",
      origin: "*",
      methods: "*",
    },
  },
  "strapi::logger",
  "strapi::query",
  "strapi::body",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
];
