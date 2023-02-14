module.exports = ({ env }) => {
  const modelsToCache = env(
    "STRAPI_CACHE_MODELS",
    "public-advisory,protected-area"
  )
    .split(",")
    .map((item) => item.trim());

  return {
    settings: {
      cors: {
        origin: [
          "http://localhost:3000",
          "http://localhost:1337",
          "https://*-61d198-dev.apps.silver.devops.gov.bc.ca",
          "https://*-61d198-test.apps.silver.devops.gov.bc.ca",
          "https://*-61d198-prod.apps.silver.devops.gov.bc.ca",
          "https://*.bcparks.ca",
          "https://bcparks.ca",
          "*",
        ],
      },
      cache: {
        enabled: env.bool("STRAPI_CACHE_ENABLED", false),
        maxAge: env.int("STRAPI_CACHE_TTL", 300000), // Default cache ttl of 5 minutes
        contentTypes: modelsToCache,
        cacheTimeout: env.int("STRAPI_CACHE_TIMEOUT", 10000),
        type: env("STRAPI_CACHE_TYPE", "mem"),
        redisConfig: {
          host: env("REDIS_HOST", "localhost"),
          port: env.int("REDIS_PORT", 6379),
          name: "redis-primary",
          password: env("REDIS_PASSWORD", null),
        },
      },
    },
  };
};
