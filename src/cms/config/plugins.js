module.exports = ({ env }) => ({
  graphql: {
    amountLimit: 2500,
  },
  email: {
    provider: "nodemailer",
    providerOptions: {
      host: env("STRAPI_SMTP_HOST", "apps.smtp.gov.bc.ca"),
      port: env.int("STRAPI_SMTP_PORT", 25),
      tls: { rejectUnauthorized: false }, // Needed because of OCIO cert issue
    },
    settings: {
      defaultFrom: env("STRAPI_SMTP_FROM", "noreply@gov.bc.ca"),
      defaultReplyTo: env("STRAPI_SMTP_REPLY_TO", "noreply@gov.bc.ca"),
    },
  },
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
  },
});