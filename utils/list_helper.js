const { log } = require('../utils/logger')
const lodash = require('lodash')
const totalLikes = (blogs) =>  blogs.reduce((acc, val) => acc + val.likes, 0)

const favoriteBlog = (blogs) => {
  let mostLiked = null
  blogs.forEach(b => {
    if (!mostLiked || b.likes > mostLiked.likes)
    {
      mostLiked = { title: b.title, author: b.author, likes: b.likes }
    }
  })
  return mostLiked
}

const mostBlogs = (blogs) => {
  if (!blogs || blogs.length === 0)
  {
    return null
  }
  const max = lodash.groupBy(blogs, 'author')

  let author = { author: null, blogs: 0 }

  lodash.forEach(max, (authorBlogs, _author) => {
    const length = authorBlogs.length
    if (author.blogs < length)
    {
      author = { author: _author, blogs: length }
    }
  })
  return author
}

const mostLikes = (blogs) => {
  if (!blogs || blogs.length === 0)
  {
    return null
  }
  const authors = lodash.groupBy(blogs, 'author')
  let author = { author: null, likes:0 }

  lodash.forEach(authors, (authorBlogs, _author) => {
    const sum = authorBlogs.reduce((acc, blog) => acc + blog.likes, 0)
    if (sum > author.likes)
    {
      author = { author:_author, likes: sum }
    }
  })
  return author
}

const mostBlogsManual = (blogs) => {
  let authors = []
  blogs.forEach(b => {
    let existing = authors.find(blog => blog.author === b.author)
    if (existing)
    {
      log('updating', authors)
    }
    else
    {
      authors.push({ author: b.author, blogs: 1 })
    }
  } )
  let mostBlogged = null
  if (authors)
  {
    authors.forEach(author => {
      if (!mostBlogged || author.blogs > mostBlogged.blogs)
      {
        mostBlogged = author
      }
    })
  }
  return mostBlogged
}


const initialBlogs = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Michael Chan',
    url: 'https://reactpatterns.com/',
    likes: 7,
    __v: 0
  },
  {
    _id: '5a422aa71b54a676234d17f8',
    title: 'Go To Statement Considered Harmful',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
    likes: 5,
    __v: 0
  },
  {
    _id: '5a422b3a1b54a676234d17f9',
    title: 'Canonical string reduction',
    author: 'Edsger W. Dijkstra',
    url: 'http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html',
    likes: 12,
    __v: 0
  },
  {
    _id: '5a422b891b54a676234d17fa',
    title: 'First class tests',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll',
    likes: 10,
    __v: 0
  },
  {
    _id: '5a422ba71b54a676234d17fb',
    title: 'TDD harms architecture',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html',
    likes: 0,
    __v: 0
  },
  {
    _id: '5a422bc61b54a676234d17fc',
    title: 'Type wars',
    author: 'Robert C. Martin',
    url: 'http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html',
    likes: 2,
    __v: 0
  }
]

module.exports = { totalLikes, favoriteBlog, mostBlogs, mostLikes, initialBlogs, mostBlogsManual }
