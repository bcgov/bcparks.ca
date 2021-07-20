module.exports = ({ env }) => ({
  upload: {
    provider: "local-pvc",
    providerOptions: {
      path: env("MEDIA_FILE_PATH"),
      sizeLimit: 1000000,
    },
  },
});
