module.exports = ({ env }) => {
  return {
    graphql: {
      config: {
        shadowCRUD: true,
        amountLimit: 2500,
        depthLimit: 7,
        playgroundAlways: process.env.ENABLE_GRAPHQL_PLAYGROUND || false,
        apolloServer: {
          tracing: false,
          introspection: true,
        },
      },
    },
    email: {
      provider: "nodemailer",
      providerOptions: {
        host: env("STRAPI_SMTP_HOST", "apps.smtp.gov.bc.ca"),
        port: env.int("STRAPI_SMTP_PORT", 25),
        tls: { rejectUnauthorized: false }, // Needed because of OCIO cert issue
      },
      settings: {
        defaultFrom: env("STRAPI_SMTP_FROM", "noreply@gov.bc.ca"),
        defaultReplyTo: env("STRAPI_SMTP_REPLY_TO", "noreply@gov.bc.ca"),
      },
    },
    upload: {
      config: {
        breakpoints: {
          small: 720,
        },
      },
    },
    // TODO: Temporarily disabled for v5 upgrade
    // ckeditor5: {
    //   enabled: true,
    //   resolve: "./src/plugins/strapi-plugin-ckeditor",
    // },
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
          name: env("STRAPI_CACHE_TYPE", "memory"),
          options: {
            max: 32767,
            connection: "default",
          },
        },
        strategy: {
          enableEtagSupport: true,
          logs: true,
          clearRelatedCache: true,
          maxAge: env.int("STRAPI_CACHE_TTL", 300000),
          hitpass: false, // don't bypass the cache for requests with a cookie or authorization header
          contentTypes: [
            // list of Content-Types UID to cache
            "api::protected-area.protected-area",
            "api::public-advisory.public-advisory",
            "api::park-access-status.park-access-status",
          ],
        },
      },
    },
    "users-permissions": {
      config: {
        jwt: {
          expiresIn: "7d",
        },
      },
    },
    documentation: {
      enabled: true,
      config: {
        "x-strapi-config": {
          // Do not generate for plugins
          plugins: [],
        },
      },
    },
  };
};
