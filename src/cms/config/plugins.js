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
    breakpoints: {
      small: 720,
    },
  },
});
