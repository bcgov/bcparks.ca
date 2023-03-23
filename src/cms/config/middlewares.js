module.exports = [
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "img-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airtable.com",
            `https://nrs.objectstore.gov.bc.ca/`,
            // TODO:
            // doc https://strapi.io/blog/how-to-set-up-amazon-s3-upload-provider-plugin-for-our-strapi-app
            // 'yourBucketName.s3.yourRegion.amazonaws.com', or  `https://${env('AWS_BUCKET')}.s3.${env('AWS_REGION')}.amazonaws.com`
          ],
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            "dl.airtable.com",
            `https://nrs.objectstore.gov.bc.ca/`,
            // TODO:
            // 'yourBucketName.s3.yourRegion.amazonaws.com',
          ],
          'frame-src': [
            "'self'",
            "https://www.youtube.com"
          ]
        },
      },
    },
  },
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
