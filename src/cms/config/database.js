module.exports = ({ env }) => ({
  defaultConnection: env("DATABASE_CLIENT", "default"),
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "sqlite",
        timezone: "UTC",
        filename: env("DATABASE_FILENAME", ".tmp/data.db"),
      },
      options: {
        useNullAsDefault: true,
      },
    },
    postgres: {
      connector: "bookshelf",
      settings: {
        client: "postgres",
        host: env("DATABASE_HOST", "localhost"),
        port: env.int("DATABASE_PORT", 5432),
        database: env("DATABASE_NAME", "cms"),
        username: env("DATABASE_USERNAME", "postgres"),
        password: env("DATABASE_PASSWORD", "postgres"),
        ssl: env.bool("DATABASE_SSL", false),
        timezone: "UTC",
      },
      options: {
        pool: {
          min: env.int("DATABASE_MIN_CONNECTIONS", 0),
          max: env.int("DATABASE_MAX_CONNECTIONS", 10),
          idleTimeoutMillis: env.int("DATABASE_IDLE_TIMEOUT", 30000),
          createTimeoutMillis: env.int("DATABASE_CREATE_TIMEOUT", 30000),
          acquireTimeoutMillis: env.int("DATABASE_ACQUIRE_TIMEOUT", 30000),
        },
      },
    },
  },
});
