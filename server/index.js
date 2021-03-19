const express = require('express')

const jwt = require('jsonwebtoken')

const dotenv = require('dotenv')
dotenv.config()

const cors = require('cors')

const mongoose = require('mongoose')

const nuidApi = require('@nuid/sdk-nodejs').default({
  auth: { apiKey: process.env.NUID_KEY },
})

const bodyParser = require('body-parser')

const User = require('./models/User')

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  return res.send('ok')
})

app.post('/register', async (req, res) => {
  try {
    const email = req.body.email
    const name = req.body.name
    const createRes = await nuidApi.auth.credentialCreate(req.body.credential) // 05
    const nuid = createRes.parsedBody['nu/id']
    const user = new User({
      email,
      name,
      nuid,
    })

    await user.save()

    console.log(user)

    // await db.save('user', { email, nuid }) // 06
    res.status(204).send({ user }) // 07
  } catch (res) {
    console.log(res)
    res.status(400).send('error occured')
  }
})

app.post('/challenge', async (req, res) => {
  const email = req.body.email
  const user = await User.findOne({ email: email })
  if (!user) {
    res.status(401).send('user not found')
    return
  }

  try {
    const credentialRes = await nuidApi.auth.credentialGet(user.nuid) // 05
    const credential = credentialRes.parsedBody['nuid/credential']
    const challengeRes = await nuidApi.auth.challengeGet(credential) // 06
    const challengeJwt =
      challengeRes.parsedBody['nuid.credential.challenge/jwt'] // 07
    res.status(200).send({ challengeJwt: challengeJwt }) // 08
  } catch (res) {
    console.log(res)
    res.status(500).send('server error')
  }
})

app.post('/login', async (req, res) => {
  const user = await User.findOne({ email: req.body.email })
  if (!user) {
    return res.status(401).send('')
  }

  try {
    const { challengeJwt, proof } = req.body
    await nuidApi.auth.challengeVerify(challengeJwt, proof) // 12
    res.status(201).send({
      user: user.toJSON(),
      jwt: jwt.sign(user.toJSON(), process.env.JWT_SECRET),
    })
  } catch (e) {
    console.log(e)
    res.status(401).send('error occured')
  }
})

mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(async () => {
    console.log('connected to database')
    app.listen(process.env.PORT || 4001, () => {
      console.log('server is running')
    })
  })
