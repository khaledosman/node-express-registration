const router = require('express').Router()
const uuid = require('uuid/v4')

const { User } = require('../models/user')
const { Mailer } = require('../helpers/mailer')

router.get('/verifyUser', async (req, res) => {
  const { token } = req.query
  const user = await User.findOne({
    verificationToken: token
  })

  if (user) {
    try {
      await User.updateOne({
        verificationToken: token
      }, { $set: { isVerified: true } })

      res.send(`Account verification successful`)
    } catch (error) {
      res.sendStatus(500)
    }
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
    // TODO check for registered users with the same username/email ?
    const token = uuid()
    const verificationUrl = `${process.env.SERVER_URL}/verifyUser?token=${token}`
    new User({
      username,
      email,
      verificationToken: token,
      isVerified: false
    }).save()
      .then(() => {
        const message = {
          from: process.envSENDER_MAIL,
          to: email,
          subject: 'Verify your email',
          html: `<div>Please click on this link to verify your email <a href="${verificationUrl}" target="_blank"> ${verificationUrl}</a></div>`
        }
        return Mailer.sendMail(message)
      })
      .then(() => {
        res.send({
          verificationUrl,
          message: 'Registration successful, please validate your email'
        })
      })
      .catch(err => {
        console.log(err)
        res.sendStatus(500)
      })
  }
})

module.exports = router
