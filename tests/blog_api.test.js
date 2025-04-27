const {test, describe, before, beforeEach, after} = require("node:test")
const assert = require("node:assert")
const mongoose = require("mongoose")
const supertest = require("supertest")
const {initialBlogs} = require("../utils/list_helper")
const app = require("../app")
const middlewares = require('../utils/middleware')
const Blog = require("../models/blog")
const User = require('../models/user')
const {getAllBlogsInDB, getAllUsersInDB, newBlog, rootUser, validUser} = require('./test_helpers')

const api = supertest(app)

before( async () => {
    await User.deleteMany({})
    const root = await api.post('/api/users')
        .send(rootUser.userData)
        .expect(201)

    const loginData = await api.post('/api/login')
        .send({username: rootUser.userData.username, password: rootUser.userData.password})
        .expect(200)
        .expect('Content-type', /application\/json/)
    rootUser.loginToken = `Bearer ${loginData.body.userToken}`
    console.log('logged in as root with token', rootUser.loginToken)
})

beforeEach( async () => {
    await Blog.deleteMany({})
    const anyUser = await User.findOne({})
    for (const b of initialBlogs)
    {
        b.user = anyUser._id
        const newBlog = new Blog(b)
        await newBlog.save()
    }
})

const getAllBlogs = async () => await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-type', /application\/json/)

test('returns correct number of blogs', async () => {
    const allBlogs = await getAllBlogs()
    assert.strictEqual(initialBlogs.length, allBlogs.body.length)
})

test('_id is indeed id', async () => {
    const allBlogs = await getAllBlogs()
    const _id = allBlogs.body[0]._id
    const id = allBlogs.body[0].id
    assert(!_id && id)
})

describe('adding blogs', () =>
{
    test('we can actually add a blog', async () => {
        const originalLength = initialBlogs.length
        await api.post('/api/blogs')
            .send(newBlog)
            .expect(201)
            .set('Authorization', rootUser.loginToken)
        const newBlogs = await getAllBlogsInDB()
        const addedBlog = newBlogs.find(b => b.title === newBlog.title)
        assert.strictEqual(originalLength + 1, newBlogs.length)
        assert(addedBlog)
    })
    test('we can\'t add a blog without a token (error 401)', async () => {
        const blogsBefore = await getAllBlogs()
        await api.post('/api/blogs')
            .send(newBlog)
            .expect(401)
            .expect('Content-type', /application\/json/)
        const blogsAfter = await getAllBlogs()
        assert.strictEqual(blogsBefore.length, blogsAfter.length)

    })
    test('we can\'t add blogs without an url', async () => {
        const originalLength = initialBlogs.length
        await api.post('/api/blogs')
            .send({...newBlog, url: null})
            .expect(400)
            .set('Authorization', rootUser.loginToken)

        const newBlogs = await getAllBlogsInDB()
        const addedBlog = newBlogs.find(b => b.title === newBlog.title)
        assert.strictEqual(originalLength, newBlogs.length)
        assert(!addedBlog)
    })
    test('we can\'t add blogs without a title', async () => {
        const originalLength = initialBlogs.length
        await api.post('/api/blogs')
            .send({...newBlog, title: null})
            .expect(400)
            .set('Authorization', rootUser.loginToken)

        const newBlogs = await getAllBlogsInDB()
        const addedBlog = newBlogs.find(b => b.url === newBlog.url)
        assert.strictEqual(originalLength, newBlogs.length)
        assert(!addedBlog)
    })
}
)
test('likes are 0 if empty', async () => {
    const newBlog = await api.post('/api/blogs')
        .send({
            title: 'A Bob\'s Life',
            author: 'Bob',
            url: 'www.boblogsblogsblogbob.bob'
        })
        .set('Authorization', rootUser.loginToken)
        .expect(201)
        .expect('Content-type', /application\/json/)
    assert.strictEqual(newBlog.body.likes, 0)
})

describe('deletions', () => {
    test('we can delete existing blog', async () => {
        const allBlogs = await getAllBlogsInDB()
        const firstBlog = allBlogs[0]
        await api.delete(`/api/blogs/${firstBlog.id}`)
            .expect(204)
            .set('Authorization', rootUser.loginToken)

        const newBlogs = await getAllBlogsInDB()
        assert.strictEqual(newBlogs.find(b => b.id === firstBlog.id), undefined)
        assert.strictEqual(allBlogs.length -1, newBlogs.length)
    })
    test('we get error 400 and no deletion from wrong id format', async () =>{
        const allBlogs = await getAllBlogsInDB()
        await api.delete('/api/blogs/68')
            .expect(400)
            .set('Authorization', rootUser.loginToken)
        const newBlogs = await getAllBlogsInDB()
        assert.deepStrictEqual(allBlogs, newBlogs)
    } )
    test('we get error 404 and no deletion from non existing blog', async () =>{
        const allBlogs = await getAllBlogsInDB()
        await api.delete('/api/blogs/5a422b3a1b54a676234d17f4')
            .expect(404)
            .set('Authorization', rootUser.loginToken)

        const newBlogs = await getAllBlogsInDB()
        assert.deepStrictEqual(allBlogs, newBlogs)
    } )
})

describe('editing blogs', () =>
{
    test('an existing blog can be replaced', async () => {
        const allBlogs = await getAllBlogsInDB()
        const firstBlog = allBlogs[0]
        const newBlog = {
            author: 'Bob Log',
            title: 'Bob\'s Log Blogs',
            url: 'http://boblogsblogsblog.ogg'
        }
        await api.put(`/api/blogs/${firstBlog.id}`)
            .send(newBlog)
            .expect(200)
            .expect('Content-type', /application\/json/)
        const updatedBlog = await Blog.findById(firstBlog.id)
        assert.strictEqual(updatedBlog.title, newBlog.title)
    })

    test('likes can be edited independently', async () => {
        const allBlogs = await getAllBlogsInDB()
        const firstBlog = allBlogs[0]
        await api.put(`/api/blogs/${firstBlog.id}`)
            .send({likes: 50})
            .expect(200)
            .expect('Content-type', /application\/json/)
        const updatedBlog = await Blog.findById(firstBlog.id)
        assert.strictEqual(updatedBlog.likes, 50)
        assert.strictEqual(updatedBlog.title, firstBlog.title)
    })
})


describe.only('adding users', () => {
    beforeEach( async () =>
    {
        await User.deleteMany({username: {$ne: 'root'}})
    })

    test('can add a valid new user', async () => {
        const usersBefore = await getAllUsersInDB()
        await api
            .post('/api/users')
            .send(validUser)
            .expect(201)
            .expect('Content-type', /application\/json/)

        const usersAfter = await getAllUsersInDB()
        assert.strictEqual(usersBefore.length + 1, usersAfter.length)
        assert(usersAfter.find(u => u.username === validUser.username))
    })

    test('can\'t add a valid user twice', async () =>{
        await api
            .post('/api/users')
            .send(validUser)
            .expect(201)
            .expect('Content-type', /application\/json/)

        const usersBefore = await getAllUsersInDB()
        const res = await api.post('/api/users')
            .send(validUser)
            .expect(400)
            .expect('Content-type', /application\/json/)

        const usersAfter = await getAllUsersInDB()
        assert.strictEqual(usersBefore.length, usersAfter.length)
        assert.strictEqual(res.body.error, 'User already exists')
    })

    test('can\'t add if missing username', async () => {
        const user = {...validUser, username: ''}
        const usersBefore = await getAllUsersInDB()
        const res = await api.post('/api/users')
            .send(user)
            .expect(400)
            .expect('Content-type', /application\/json/)
        const usersAfter = await getAllUsersInDB()
        assert.strictEqual(usersAfter.length, usersBefore.length)
        assert.strictEqual(res.body.error, 'Path `username` is required.')
    })

    test('can\'t add if username is too short', async () => {
        const user = {...validUser, username:'ah'}
        const usersBefore = await getAllUsersInDB()

        const res = await api.post('/api/users')
            .send(user)
            .expect(400)
            .expect('Content-type', /application\/json/)
        const usersAfter = await getAllUsersInDB()
        assert.strictEqual(usersAfter.length, usersBefore.length)
        assert(res.body.error.includes('is shorter than the minimum allowed length (3)'))
    })

    test('can\'t add if password is too short', async () => {
        const user = {...validUser, password: 'uh'}
        const usersBefore = await getAllUsersInDB()
        const res = await api.post('/api/users')
            .send(user)
            .expect(400)
            .expect('Content-type', /application\/json/)
        const usersAfter = await getAllUsersInDB()
        assert.strictEqual(usersAfter.length, usersBefore.length)
        assert.strictEqual(res.body.error, 'Password must be at least 3 characters long')
    })
})

after( async () => await mongoose.connection.close())