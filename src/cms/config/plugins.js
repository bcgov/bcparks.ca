module.exports = ({ env }) => ({
  upload: {
    provider: "local",
    providerOptions: {
      path: "media",
      sizeLimit: 1000000,
    },
  },
});
