const nodemailer = require('nodemailer');
const {SMTP} = require('../environment');

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    requireTLS: true,
    auth: {
        user: SMTP.SMTP_EMAIL,
        pass: SMTP.SMTP_APP_KEY
    }
})

function sendMail(to, subject, message, callback) {
    const mailOption = {
        from : SMTP.SMTP_EMAIL,
        to,
        subject,
        html: message
    }
    transporter.sendMail(mailOption, callback);
}

module.exports = sendMail;