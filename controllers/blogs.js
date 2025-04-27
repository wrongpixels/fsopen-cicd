const router = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const middleware = require('../utils/middleware')

const alreadyExists = async (blog) => {
  const existing = {
    blog: null,
    match: '',
  }
  if (!blog) {
    return existing
  }
  existing.blog = await Blog.findOne({ title: blog.title })
  if (existing.blog) {
    existing.match = 'title'
    return existing
  }
  existing.blog = await Blog.findOne({ url: blog.url })
  if (existing.blog) {
    existing.match = 'url'
    return existing
  }
  return existing
}

router.get('/injectUsers', async (req, res) => {
  const allUsers = await User.find({})
  for (const user of allUsers) {
    user.blogs = []
    await user.save()
  }
  let userIndex = 0
  const allBlogs = await Blog.find({})
  for (const blog of allBlogs) {
    const user = allUsers[allUsers.length - 1 - userIndex]
    blog.user = user._id
    userIndex += 1
    if (userIndex >= allUsers.length) {
      userIndex = 0
    }
    await blog.save()
    user.blogs = user.blogs.concat(blog._id)
    await user.save()
  }
  res.status(200).json({ message: 'Users injected successfully' })
})
router.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 })
  response.json(blogs)
})

router.get('/:id', async (request, response) => {
  const id = request.params.id

  const blog = await Blog.findById(id).populate('user', { blogs: 0 })
  if (blog) {
    return response.json(blog)
  }

  response.status(404).json({ error: 'Blog entry doesn\'t exist in database' })
})

router.post(
  '/',
  middleware.handleUserExtractorErrors,
  async (request, response) => {
    if (!request.body) {
      return response.status(400).json({ error: 'Missing blog data' })
    }
    const user = request.user
    if (!user) {
      return response
    }
    const blogToAd = request.body
    blogToAd.user = user._id
    const blog = new Blog(blogToAd)
    const existing = await alreadyExists(blog)
    if (existing.blog) {
      return response.status(400).json({
        error: `Blog already exists with same ${existing.match}`,
      })
    }
    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    const populatedBlog = await savedBlog.populate('user', { blogs: 0 })
    response.status(201).json(populatedBlog)
  },
)

router.delete(
  '/:id',
  middleware.handleUserExtractorErrors,
  async (request, response) => {
    const id = request.params.id
    const user = request.user
    if (!user) {
      return response
    }
    const blog = await Blog.findById(id)
    if (!blog) {
      return response
        .status(404)
        .json({ error: 'Entry doesn\'t exist in server' })
    }
    if (blog.user.toString() !== user._id.toString()) {
      return response
        .status(401)
        .json({ error: 'User in not authorized to perform the operation' })
    }
    const deletedBlog = await Blog.findByIdAndDelete(blog._id)

    if (deletedBlog) {
      user.blogs = user.blogs.filter(
        (b) => b.toString() !== blog._id.toString(),
      )
      await user.save()
      console.log('deleted blog', blog.url)
      return response.status(204).end()
    }
  },
)
router.post(
  '/:id/comments',
  middleware.handleUserExtractorErrors,
  async (req, res) => {
    const comment = req.body?.comment
    if (!comment) {
      return res.status(400).json({ error: 'Missing comment content' })
    }
    const id = req.params.id
    const blog = await Blog.findById(id)
    if (!blog) {
      return res.status(404).json({ error: 'Blog was not found' })
    }
    blog.comments = blog.comments.concat({ content: comment.trim() })
    try {
      const updatedBlog = await (
        await blog.save()
      ).populate('user', { blogs: 0 })
      return res.status(200).json(updatedBlog)
    } catch (e) {
      return res.status(400).json({
        error: e ? e.message : 'There was an error adding the comment',
      })
    }
  },
)
router.put('/:id', async (request, response) => {
  const id = request.params.id
  const updatedInfo = request.body
  if (!updatedInfo) {
    return response.status(400).json({ error: 'Updated data can\'t be empty' })
  }

  const updatedBlog = await Blog.findByIdAndUpdate(id, updatedInfo, {
    new: true,
    runValidators: true,
    context: 'query',
  }).populate('user', { blogs: 0 })
  if (updatedBlog) {
    return response.status(200).json(updatedBlog)
  }

  response.status(404).json({ error: 'Blog to update was not found.' })
})

module.exports = router
