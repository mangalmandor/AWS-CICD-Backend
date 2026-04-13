// const transporter = require('../config/mailer');

// const sendEmailAlert = async ({ to, subject, text }) => {
//   try {
//     await transporter.sendMail({
//       from: `"Marketplace App" <${process.env.SMTP_USER}>`,
//       to,
//       subject,
//       text,
//     });
//   } catch (error) {
//     console.error(error);
//   }
// };

// module.exports = { sendEmailAlert };

const { google } = require('googleapis');

const OAuth2 = google.auth.OAuth2;

const sendEmailAlert = async ({ to, subject, text }) => {
  try {
    const oauth2Client = new OAuth2(
      process.env.CLIENT_ID,
      process.env.CLIENT_SECRET,
      "https://developers.google.com/oauthplayground"
    );

    oauth2Client.setCredentials({
      refresh_token: process.env.REFRESH_TOKEN,
    });

    const accessToken = await oauth2Client.getAccessToken();

    // The Gmail API uses base64 encoded strings
    const gmail = google.gmail({ version: 'v1', auth: oauth2Client });

    const utf8Subject = `=?utf-8?B?${Buffer.from(subject).toString('base64')}?=`;
    const messageParts = [
      `From: MarketTred <${process.env.EMAIL_USER}>`,
      `To: ${to}`,
      `Content-Type: text/html; charset=utf-8`,
      `MIME-Version: 1.0`,
      `Subject: ${utf8Subject}`,
      '',
      text,
    ];
    const message = messageParts.join('\n');

    const encodedMessage = Buffer.from(message)
      .toString('base64')
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');

    await gmail.users.messages.send({
      userId: 'me',
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("Email sent via Gmail API!");
  } catch (error) {
    throw error
  }
};

module.exports = { sendEmailAlert };