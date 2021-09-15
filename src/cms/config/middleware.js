module.exports = {
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
  },
};
