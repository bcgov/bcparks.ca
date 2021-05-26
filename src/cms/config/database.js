module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "postgres",
        host: env("DATABASE_HOST"),
        port: env.int("DATABASE_PORT"),
        database: env("DATABASE_NAME"),
        username: env("DATABASE_USERNAME"),
        password: env("DATABASE_PASSWORD"),
        ssl: env.bool("DATABASE_SSL"),
        timezone: "UTC",
      },
      options: {
        pool: {
          min: 0,
          max: 20,
          idleTimeoutMillis: 50000,
          createTimeoutMillis: 50000,
          acquireTimeoutMillis: 50000,
          reapIntervalMillis: 30000,
          createRetryIntervalMillis: 30000,
          propagateCreateError: false,
        },
      },
    },
  },
});
