const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const createUserToken = async payload => await jwt.sign(payload, process.env.SECRET, { expiresIn:60**2 })

router.post('/', async (req, res)  => {
  const userData = req.body
  if (!userData || !userData.username || !userData.password)
  {
    return res.status(400).json({ error: 'Missing login data' })
  }
  const user = await User.findOne({ username: userData.username })
  const dataMatches = user?await bcrypt.compare(userData.password, user.passwordHash):null
  if (!dataMatches)
  {
    return res.status(401).json({ error: 'Invalid user or password' })
  }
  const userToken = await createUserToken({ username: user.username, id: user._id })
  if (!userToken)
  {
    return res.status(401).json({ error: 'Authentication failed' })
  }
  console.log('Successful login for', user.username)
  res.status(200).json({ userToken, username: user.username, name: user.name })
})

module.exports = router