const router = require('express').Router()
const User = require('../models/user')
const Blog = require('../models/blog')

router.post('/reset', async (req, res) => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    console.log('wiped')
    res.status(204).end()
})

module.exports = router