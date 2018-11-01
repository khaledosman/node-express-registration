const router = require('express').Router()
const { User } = require('../models/user')
const uuid = require('uuid/v4')
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

router.get('/verifyUser', async (req, res) => {
  const { token } = req.query
  const user = await User.findOne({
    verificationToken: token
  })
  if (user) {
    User.updateOne({
      verificationToken: token
    }, { $set: { isVerified: true } })
      .then((w) => {
        console.log(w)
        res.send(`Account verification successful`)
      })
  } else {
    res.statusCode = 400
    res.send({
      message: 'Invalid token',
      status: 400
    })
  }
})

router.post('/register', (req, res) => {
  const { email, username } = req.body
  if (!email || !username) {
    res.statusCode = 400
    res.send({
      message: 'You need a username and an email to register',
      status: 400
    })
  } else {
    const token = uuid()
    const verificationUrl = `${process.env.SERVER_URL}/verifyUser?token=${token}`
    new User({
      username,
      email,
      verificationToken: token,
      isVerified: false
    }).save()
      .then(() => {
        return sendEmail(email, verificationUrl)
      })
      .then(() => {
        res.send(
          {
            verificationUrl
          }
        )
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(500)
      })
  }
})

function sendEmail (email, verificationUrl) {
  const message = {
    from: SENDER_MAIL,
    to: email,
    subject: 'Verify your email',
    html: `<div>Please click on this link to verify your email <a href="${verificationUrl}" target="_blank"> ${verificationUrl}</a></div>`
  }
  return transporter.sendMail(message)
}
module.exports = router
