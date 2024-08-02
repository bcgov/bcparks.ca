module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: "aws-s3",
      providerOptions: {
        credentials: {
          accessKeyId: env("S3_ACCESS_KEY_ID"),
          secretAccessKey: env("S3_ACCESS_SECRET"),
        },
        region: "cannot-be-blank",
        endpoint: `https://${env("S3_ENDPOINT")}`,
        forcePathStyle: true,
        params: {
          Bucket: env("S3_BUCKET"),
        },
      },
      breakpoints: {
        small: 720,
      },
    }
  },
});
