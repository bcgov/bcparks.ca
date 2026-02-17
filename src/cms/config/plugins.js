module.exports = ({ env }) => {
  return {
    graphql: {
      config: {
        shadowCRUD: true,
        amountLimit: 2500,
        depthLimit: 7,
        landingPage: env.bool("ENABLE_GRAPHQL_PLAYGROUND", false),
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
    // custom field plugins must be configured before rest-cache
    "multi-select": {},
    // redis must be configured before rest-cache
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
    "rest-cache": {
      // locally - off
      enabled: env.bool("STRAPI_CACHE_ENABLED", false),
      config: {
        provider: {
          name: env("STRAPI_CACHE_TYPE", "memory"),
          getTimeout: env.int("REST_CACHE_GET_TIMEOUT", 5000),
          options: {
            max: 32767,
            connection: "default",
            ttl: env.int("STRAPI_CACHE_TTL", 300000),
          },
        },
        strategy: {
          enableEtagSupport: true,
          debug: env.bool("REST_CACHE_DEBUG", false),
          clearRelatedCache: true,
          maxAge: env.int("STRAPI_CACHE_TTL", 300000),
          hitpass: false, // don't bypass the cache for requests with a cookie or authorization header
          contentTypes: [
            // list of Content-Types UID to cache
            "api::public-advisory.public-advisory",
            {
              contentType: "api::protected-area.protected-area",
              routes: ["/api/protected-areas", "/api/park-access-statuses"],
            },
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
