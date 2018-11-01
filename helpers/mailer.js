const nodemailer = require('nodemailer')

const SENDER_MAIL = process.env.SENDER_MAIL
const SENDER_PASS = process.env.SENDER_PASS

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: SENDER_MAIL,
    pass: SENDER_PASS // the actual password for that account
  }
})

module.exports.Mailer = transporter
