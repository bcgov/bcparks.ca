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
          "script-src": [
            "'self'",
            "'unsafe-inline'",
            "https://apollo-server-landing-page.cdn.apollographql.com",
            "https://embeddable-sandbox.cdn.apollographql.com",
          ],
          // For CKEditor, load frontend styles to use in the WYSIWYG editor
          // Allow styles and fonts to be loaded from localhost (on dev) and from bcparks.ca (production)
          "style-src": [
            "'self'",
            "'unsafe-inline'",
            "http://localhost:8000",
            "https://bcparks.ca",
            "https://cdn.jsdelivr.net",
            "https://cdnjs.cloudflare.com"
          ],
          "font-src": [
            "'self'",
            "http://localhost:8000",
            "https://bcparks.ca",
            "https://cdn.jsdelivr.net",
            "https://cdnjs.cloudflare.com"
          ],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airtable.com",
            "market-assets.strapi.io",
            "nrs.objectstore.gov.bc.ca",
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airtable.com",
            "market-assets.strapi.io",
            "nrs.objectstore.gov.bc.ca",
          ],
          "frame-src": ["'self'", "youtube.com", "www.youtube.com"],
        },
      },
    },
  },
  { name: "global::graphql-security" },
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
  { name: "global::draft-read-blocker" },
];
