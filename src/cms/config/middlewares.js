module.exports = [
  "strapi::errors",
  {
    name: "strapi::security",
    config: {
      contentSecurityPolicy: {
        useDefaults: true,
        directives: {
          "connect-src": ["'self'", "https:"],
          "default-src": ["none"],
          "frame-src": "*",
          "media-src": [
            "'self'",
            "data:",
            "blob:",
            // `https://${env('AWS_BUCKET')}.s3.${env('AWS_REGION')}.amazonaws.com`// TODO: (working on) loading img from S3
          ],
          upgradeInsecureRequests: null,
        },
      },
    },
  },
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
