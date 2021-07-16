module.exports = ({ env }) => ({
  upload: {
    provider: "local",
    providerOptions: {
      path: env("MEDIA_FILE_PATH"),
      sizeLimit: 1000000,
    },
  },
});
