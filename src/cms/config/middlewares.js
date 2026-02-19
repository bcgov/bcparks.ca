module.exports = [
  "strapi::logger",
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "script-src": ["'self'", "'unsafe-inline'"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airtable.com",
            "market-assets.strapi.io",
            "nrs.objectstore.gov.bc.ca"
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airtable.com",
            "market-assets.strapi.io",
            "nrs.objectstore.gov.bc.ca"
          ],
          "frame-src": [
            "'self'",
            "youtube.com",
            "www.youtube.com"
          ],
          "script-src": [
            "'self'",
            "https://apollo-server-landing-page.cdn.apollographql.com",
            "https://embeddable-sandbox.cdn.apollographql.com",
          ],
        },
      },
    },
  },
  "strapi::poweredBy",
  {
    // doc https://docs.strapi.io/dev-docs/configurations/middlewares#cors
    name: "strapi::cors",
    config: {
      headers: "*",
      origin: "*",
      methods: "*",
    },
  },
  "strapi::query",
  "strapi::session",
  "strapi::favicon",
  "strapi::public",
  {
    name: "strapi::body",
    config: {
      jsonLimit: "2mb",
      formLimit: "2mb",
      textLimit: "2mb",
      formidable: {
        maxFileSize: 250 * 1024 * 1024, // multipart data, modify here limit of uploaded file size
      },
    },
  },
];
