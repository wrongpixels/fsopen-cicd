const Blog = require('../models/blog')
const User = require('../models/user')

const getAllBlogsInDB = async () => {
  const allBlogs = await Blog.find({})
  return allBlogs.map(b => b.toJSON())
}

const getAllUsersInDB = async () => {
  const allUsers = await User.find({})
  return allUsers.map(u => u.toJSON())
}

const newBlog = {
  title: 'Bob Log\'s Blogs Blog',
  author: 'Bob Log',
  url: 'http://boblogsblogsblog.ogg'
}

const rootUser = {
  loginToken: 0,
  userData:
        {
          username: 'root',
          name: 'Admin',
          password: 'verysecure'
        }
}

const validUser = {
  username: 'kevapaereo',
  name: 'Álvaro Moreno',
  password: 'passme'
}

module.exports = { getAllBlogsInDB, getAllUsersInDB, newBlog, rootUser, validUser }