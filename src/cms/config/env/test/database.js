module.exports = ({ env }) => ({
  connection: {
    client: 'sqlite',
    connection: {
      filename: env('DATABASE_FILENAME', '.tmp/test.db'),
      schema: '',
    },
    useNullAsDefault: true,
    debug: false
  },
});
