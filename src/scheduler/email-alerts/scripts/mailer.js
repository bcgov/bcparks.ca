const nodemailer = require("nodemailer");

exports.send = async function (subject, body, summary, fromName) {
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
    to: process.env.EMAIL_RECIPIENT,
    subject: subject,
    text: summary,
    html: body,
    attachments: [
      {
        path: "./email-alerts/images/logo.png",
        cid: "logo.png",
      },
    ],
  });
};
