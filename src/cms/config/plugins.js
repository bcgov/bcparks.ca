module.exports = ({ env }) => {

  // TODO:
  // const modelsToCache = env(
  //   "STRAPI_CACHE_MODELS",
  //   "public-advisory,protected-area"
  // )
  //   .split(",")
  //   .map((item) => item.trim());

  return {
    graphql: {
      amountLimit: 2500,
    },
    email: {
      provider: "nodemailer",
      providerOptions: {
        host: env("STRAPI_SMTP_HOST", "apps.smtp.gov.bc.ca"),
        port: env.int("STRAPI_SMTP_PORT", 25),
        tls: {rejectUnauthorized: false}, // Needed because of OCIO cert issue
      },
      settings: {
        defaultFrom: env("STRAPI_SMTP_FROM", "noreply@gov.bc.ca"),
        defaultReplyTo: env("STRAPI_SMTP_REPLY_TO", "noreply@gov.bc.ca"),
      },
    },
    upload: {
      breakpoints: {
        small: 720,
      },
    },
    ckeditor5: {
      enabled: true,
      resolve: "./src/plugins/strapi-plugin-ckeditor",
    },
    // Step 1: Configure the redis connection
    // @see https://github.com/strapi-community/strapi-plugin-redis


    redis: {
      // locally - off
      enabled: env.bool("STRAPI_CACHE_ENABLED", false),
      config: {
        connections: {
          default: {
            connection: {
              host: env("REDIS_HOST", "localhost"),
              port: env.int("REDIS_PORT", 6379),
              db: 0,
              name: "redis-primary",
              password: env("REDIS_PASSWORD", null),
            },
            settings: {
              debug: false,
            },
          },
        },
      },
    },
    // Step 2: Configure the redis cache plugin
    "rest-cache": {
      // locally - off
      enabled: env.bool("STRAPI_CACHE_ENABLED", false),
      config: {
        provider: {
          name: "redis",
          options: {
            max: 32767,
            connection: "default",
          },
        },
        strategy: {
          enableEtagSupport: true,
          logs: true,
          clearRelatedCache: true,
          maxAge: 3600000,
          contentTypes: [
            // list of Content-Types UID to cache
            "api::protected-area.protected-area",
            "api::public-advisory.public-advisory",
          ],
        },
      },
    },
  }
}
