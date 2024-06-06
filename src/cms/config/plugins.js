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
      }
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
      }
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
          name: env("STRAPI_CACHE_TYPE", 'memory'),
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

    transformer: {
      enabled: true,
      config: {
        responseTransforms: {
          removeAttributesKey: true,
          removeDataKey: true,
        },
        requestTransforms: {
          wrapBodyWithDataKey: true,
        },
        hooks: {},
        contentTypeFilter: {
          mode: "allow",
          uids: {
            "api::public-advisory-audit.public-advisory-audit": {
              GET: true,
              PUT: true,
              POST: true,
            },
            "api::public-advisory-audit.public-advisory-audit/id": {
              PUT: true,
            },
            "api::region.region": {
              GET: true,
            },
            "api::management-area.management-area": {
              GET: true,
            },
            "api::park-name.park-name": {
              GET: true,
            },
            "api::advisory-status.advisory-status": {
              GET: true,
            },
            "api::standard-message.standard-message": {
              GET: true,
            },
            "api::business-hour.business-hour": {
              GET: true,
            },
            "api::link-type.link-type": {
              GET: true,
            },
            "api::statutory-holiday.statutory-holiday": {
              GET: true,
              PUT: true,
            },
            "api::public-advisory.public-advisory": {
              GET: true,
            },
            "api::urgency.urgency": {
              GET: true,
            },
            "api::access-status.access-status": {
              GET: true,
            },
            "api::section.section": {
              GET: true,
            },
            "api::fire-zone.fire-zone": {
              GET: true,
            },
            "api::fire-centre.fire-centre": {
              GET: true,
            },
            "api::natural-resource-district.natural-resource-district": {
              GET: true,
            },
            "api::event-type.event-type": {
              GET: true,
            },
            "api::search-area.search-area": {
              GET: true,
            },
          },
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
