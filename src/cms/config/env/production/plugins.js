module.exports = ({ env }) => ({
  upload: {
    provider: "aws-s3",
    providerOptions: {
      accessKeyId: env("S3_ACCESS_KEY_ID"),
      secretAccessKey: env("S3_ACCESS_SECRET"),
      endpoint: env("S3_ENDPOINT"),
      s3ForcePathStyle: true,
      params: {
        Bucket: env("S3_BUCKET"),
      },
    },
    breakpoints: {
      small: 720,
    },
  },
});
