const nodemailer = require("nodemailer");

/**
 * Sends an email to the provided list of recipients.
 * @param {string} subject email subject
 * @param {string} body rendered HTML body
 * @param {string} notificationSummary
 *   Notification summary passed to Nodemailer as the `text` field.
 *   It is intended for device notifications, not as a separate
 *   plain-text email body.
 * @param {string} fromName display name for sender
 * @param {string[]} recipients full list of recipients
 * @param {Array} attachments optional list of attachments, each with {filename, content} properties
 */
exports.send = async function (
  subject,
  body,
  notificationSummary,
  fromName,
  recipients,
  attachments = [],
) {
  const isLocalDevelopment = process.env.BCPARKS_ENVIRONMENT === "local";
  const emailPort = Number(process.env.EMAIL_PORT);

  if (
    !process.env.EMAIL_SERVER ||
    !Number.isInteger(emailPort) ||
    emailPort <= 0 ||
    !process.env.EMAIL_SENDER
  ) {
    if (isLocalDevelopment) {
      console.warn(
        "Email configuration is missing. Emails are disabled in local development.",
      );
    } else {
      throw new Error("Required email environment variables are missing.");
    }

    return;
  }

  const transporterOptions = {
    host: process.env.EMAIL_SERVER,
    port: emailPort,
    secure: false,
  };

  if (process.env.EMAIL_USERNAME && process.env.EMAIL_PASSWORD) {
    transporterOptions.auth = {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    };
  }

  const transporter = nodemailer.createTransport(transporterOptions);

  await transporter.sendMail({
    from: `${fromName} <${process.env.EMAIL_SENDER}>`,
    to: recipients,
    subject: subject,
    text: notificationSummary,
    html: body,
    attachments,
  });
};
