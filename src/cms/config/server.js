const cronTasks = require("./cron");

module.exports = ({ env }) => ({
  host: env("STRAPI_HOST", "0.0.0.0"),
  port: env.int("STRAPI_PORT", 1337),
  url: env("STRAPI_EXTERNAL_URL", "http://localhost:1337"),
  cron: {
    enabled: env.bool("CRON_ENABLED", true),
  },
  app: {
    keys: env.array('APP_KEYS'),
  },
});
