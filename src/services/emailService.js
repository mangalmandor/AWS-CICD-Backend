const transporter = require('../config/mailer');

const sendEmailAlert = async ({ to, subject, text }) => {
  try {
    await transporter.sendMail({
      from: `"Marketplace App" <${process.env.SMTP_USER}>`,
      to,
      subject,
      text,
    });
  } catch (error) {
    console.error(error);
  }
};

module.exports = { sendEmailAlert };