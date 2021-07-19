module.exports = ({ env }) => ({
  upload: {
    provider: "local",
    providerOptions: {
      path: env("MEDIA_FILE_PATH") || "media",
      sizeLimit: 1000000,
    },
  },
});
