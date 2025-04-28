const { test, expect, beforeEach, describe } = require('@playwright/test')
const helper = require('./blog_app.helper')
const API = '/api'

describe('Blog App', () => {
  beforeEach( async ({ page }) => {
    helper.setPage(page)
    await page.request.post(`${API}/testing/reset`)
    await page.request.post(`${API}/users`, { data: helper.validUser })

    //Firefox fails if we don't wait here
    await page.waitForTimeout(100)
    await page.goto('/')
  })

  test('login form is shown by default', async ({ page }) => {
    await expect(page.getByText('Login to use')).toBeVisible()
  })

  describe('Login', () => {

    test('succeeds with correct credentials', async ({ page }) => {
      await helper.login()
      await expect(page.getByText('Welcome back,')).toBeVisible()
    })
    test('fails with wrong credentials', async () => {
      await helper.login(true)
      await helper.checkNotification('Invalid user or password', true)
    })
  })
  describe('When logged in', () => {
    beforeEach(async () => {
      await helper.login()
    })
    test('a new blog can be created', async() => {
      const blog = await helper.createBlog()
      await expect(blog.getByText(helper.validBlog.title)).toBeVisible()
    })
    test('a blog can be liked', async () => {
      const blog = await helper.createBlog()
      await helper.likeBlog(blog)
    })
    test('a blog can be deleted by the creator', async ({ page }) => {
      const blog = await helper.createBlog()
      const indvBlog = await helper.clickBlog(blog)
      page.on('dialog', d => d.accept())
      await helper.clickButtonInLocator(indvBlog, 'Remove')
      await expect(indvBlog).not.toBeVisible()
    })
    test('a blog cannot be deleted by another user', async ({ page }) => {
      const blog = await helper.createBlog()
      await page.request.post(`${API}/users`, { data: helper.anotherValidUser })

      //Firefox fails if we don't wait here
      await page.waitForTimeout(100)
      await helper.clickButtonInLocator(page, 'Log out')
      await helper.login(false, helper.anotherValidUser)
      const indvBlog = await helper.clickBlog(blog)
      const removeButton = await helper.getButtonInLocator(indvBlog, 'Remove')
      await expect(removeButton).toBeNull()
    })
    test('blogs are ordered by likes dynamically', async ({ page }) => {
      const blog1 = await helper.createBlog(helper.validBlog)
      const blog2 = await helper.createBlog(helper.anotherValidBlog)
      const blog3 = await helper.createBlog(helper.yetAnotherValidBlog)
      let indexBlog1 = await helper.getBlogIndex(helper.validBlog.title)
      let indexBlog2 = await helper.getBlogIndex(helper.anotherValidBlog.title)
      let indexBlog3 = await helper.getBlogIndex(helper.yetAnotherValidBlog.title)
      expect(indexBlog1).toEqual(0)
      expect(indexBlog2).toEqual(1)
      expect(indexBlog3).toEqual(2)

      //We add 3, 2 and 1 likes from bottom to top, which should invert the list
      await helper.likeBlog(blog3, 3)
      await helper.clickButtonInLocator(page, 'Go back')
      await helper.likeBlog(blog2, 2)
      await helper.clickButtonInLocator(page, 'Go back')
      await helper.likeBlog(blog1, 1)
      await helper.clickButtonInLocator(page, 'Go back')
      indexBlog1 = await helper.getBlogIndex(helper.validBlog.title)
      indexBlog2 = await helper.getBlogIndex(helper.anotherValidBlog.title)
      indexBlog3 = await helper.getBlogIndex(helper.yetAnotherValidBlog.title)
      expect(indexBlog1).toEqual(2)
      expect(indexBlog2).toEqual(1)
      expect(indexBlog3).toEqual(0)
    })
  })
})
