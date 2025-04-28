const { test, describe } = require('node:test')
const equals = require('assert').strictEqual
const deepEquals = require('assert').deepStrictEqual
const { initialBlogs } = require('../utils/list_helper')
const listHelper = require('../utils/list_helper')


const blogs2 = [
  {
    _id: '5a422a851b54a676234d17f7',
    title: 'React patterns',
    author: 'Edsger W. Dijkstra',
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
    likes: 5,
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
    likes: 5,
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

const listWithOneBlog = [{
  _id: '5a422aa71b54a676234d17f8',
  title: 'Go To Statement Considered Harmful',
  author: 'Edsger W. Dijkstra',
  url: 'https://homepages.cwi.nl/~storm/teaching/reader/Dijkstra68.pdf',
  likes: 5,
  __v: 0
}]

describe('total likes', () => {
  test('of an empty list is 0', () => equals(listHelper.totalLikes([]), 0))
  test('when list has only one blog, equals its likes', () => {
    equals(listHelper.totalLikes(listWithOneBlog), listWithOneBlog[0].likes)
  }
  )
  test('of a bigger list is calculated right', () => {
    const result = listHelper.totalLikes(initialBlogs)
    equals(result, 36)
  })
})

describe('favorite blog', () => {
  test('of an empty list is null', () => {
    deepEquals(listHelper.favoriteBlog([]), null)
  })
  test('of a single blog list is itself', () => {
    deepEquals(listHelper.favoriteBlog(listWithOneBlog), { title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      likes: 5, })
  })
  test('of a full list works right', () => {
    deepEquals(listHelper.favoriteBlog(initialBlogs), { title: 'Canonical string reduction', author: 'Edsger W. Dijkstra', likes: 12 })
  })
})

describe('most blogs', () => {
  test('of an empty list', () => {
    deepEquals(listHelper.mostBlogs([]), null)
  })
  test('of a single blog list', () => {
    deepEquals(listHelper.mostBlogs(listWithOneBlog), { author: 'Edsger W. Dijkstra', blogs: 1 })
  })
  test('of a full list', () => {
    deepEquals(listHelper.mostBlogs(initialBlogs), { author: 'Robert C. Martin', blogs: 3 })
  })
  test('of a full list with a match', () => {
    deepEquals(listHelper.mostBlogs(blogs2), { author: 'Edsger W. Dijkstra', blogs: 3 })
  })
})

describe('author with most likes', () => {
  test('of an empty list', () => {
    deepEquals(listHelper.mostLikes([]), null)
  })
  test('of a single blog list', () => {
    deepEquals(listHelper.mostLikes(listWithOneBlog), { author: 'Edsger W. Dijkstra', likes: 5 })
  })
  test('of a full list', () => {
    deepEquals(listHelper.mostLikes(initialBlogs), { author: 'Edsger W. Dijkstra', likes: 17 })
  })
  test('of a full list with a match', () => {
    deepEquals(listHelper.mostLikes(blogs2), { author: 'Edsger W. Dijkstra', likes: 17 })
  })
})