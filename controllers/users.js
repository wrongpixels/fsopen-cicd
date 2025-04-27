const router = require('express').Router()
const User = require('../models/user')
const bcrypt = require('bcrypt')

router.post('/', async (req, res) => {
  const user = req.body
  if (!user) {
    return res.status(400).json({ error: 'User data is missing' })
  }
  if (!user.password || user.password.length <= 2) {
    return res
      .status(400)
      .json({ error: 'Password must be at least 3 characters long' })
  }
  const passHash = await bcrypt.hash(user.password, 10)
  const userToAdd = new User({
    username: user.username,
    name: user.name,
    passwordHash: passHash,
  })

  const addedUser = await userToAdd.save()
  res.status(201).json(addedUser)
})

router.get('/', async (req, res) => {
  const allUsers = await User.find({}).populate('blogs', {
    user: 0,
    likes: 0,
    comments: 0,
  })
  res.status(200).json(allUsers)
})

router.get('/:id', async (req, res) => {
  const param = req.params.id
  const user = await User.findById(param).populate('blogs', {
    user: 0,
    likes: 0,
    comments: 0,
  })
  if (!user) {
    return res.status(404).json({ error: 'User doesn\'t exist in database' })
  }
  res.status(200).json(user)
})

module.exports = router
