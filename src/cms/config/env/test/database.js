module.exports = ({ env }) => ({
  defaultConnection: "default",
  connections: {
    default: {
      connector: "bookshelf",
      settings: {
        client: "sqlite",
        timezone: "UTC",
        filename: env("DATABASE_FILENAME", ".tmp/test.db"),
      },
      options: {
        useNullAsDefault: true,
      },
    },
  },
});
