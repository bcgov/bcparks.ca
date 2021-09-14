module.exports = ({ env }) => ({
  host: env("HOST", "0.0.0.0"),
  port: env.int("PORT", 1337),
  url: "$WEB_SCHEMA:\\$REACT_APP_CMS_BASE_URL",
  cron: {
    enabled: env.bool("CRON_ENABLED", true),
  },
  admin: {
    auth: {
      url: '$WEB_SCHEMA:\\$REACT_APP_CMS_BASE_URL/dashboard',
      secret: env("ADMIN_JWT_SECRET", "$ADMIN_JWT_SECRET"),
    },
  },
});
