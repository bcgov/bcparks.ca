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
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_SERVER,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  await transporter.sendMail({
    from: `${fromName} <${process.env.EMAIL_SENDER}>`,
    to: recipients,
    subject: subject,
    text: notificationSummary,
    html: body,
    attachments,
  });
};
