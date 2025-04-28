const { expect } = require('@playwright/test')

const validUser = {
  username: 'bestUser',
  name: 'Pepe Pérez',
  password: 'supersafe'
}
const anotherValidUser = {
  username: 'bestUser2',
  name: 'Pepe Pérezdos',
  password: 'supersafedos'
}
const invalidUser = {
  username: 'bestestUser',
  name: 'Pepe Pérez',
  password: 'supersafe'
}

const validBlog = {
  title: 'Bob Log\'s Log Blog',
  author: 'Bob B. Log',
  url: 'http://bobloglogblog.blog'
}
const anotherValidBlog = {
  title: 'Bob Log\'s Log Blog - EXTREME',
  author: 'Bob B. Log',
  url: 'http://bobloglogblogextreme.blog'
}
const yetAnotherValidBlog = {
  title: 'Bob Log\'s Log Blog - SUPER DELUXE',
  author: 'Bob B. Log',
  url: 'http://bobloglogblogsuperdeluxe.blog'
}

let page

const setPage = (_page) => page = _page

const checkNotification = async (text, error = false) => {
  const notification = page.locator('.notification', { hasText: text })
  await expect(notification).toBeVisible()

  if (error) {
    await expect(notification).toHaveClass(/alert-danger/)
  }
}

const login = async (checkFail = false, userData = null) => {
  if (!userData) {
    userData = checkFail ? invalidUser : validUser
  }
  await page.getByTestId('username').fill(userData.username)
  await page.getByTestId('password').fill(userData.password)
  await page.getByRole('button', { name: 'Login' }).click()
  if (!checkFail) {
    await page.getByText('Welcome back,').waitFor()
  }
}

const showNewBlogEntry = async () => await clickButtonInLocator(page, 'Add a new Blog')

const getBlogList = () => page.locator('.blog-list')

const getBlogIndex = async (blogTitle) => {
  const blogList = await getBlogList()
  const allBlogs = await blogList.locator('.blog-entry').all()
  if (allBlogs.length > 0) {
    let index = 0
    for (const blog of allBlogs) {
      const match = await blog.getByText(blogTitle, { exact: true }).isVisible()
      if (match) {
        return index
      }
      index += 1
    }
  }
  return null
}

const getBlog = (blogTitle = null) => {
  if (!blogTitle) {
    blogTitle = validBlog.title
  }
  getBlogList()
  return page.locator('.blog-entry', {
    has: page.getByText(blogTitle,
      { exact: true })
  }).first()
}
const getButtonInLocator = async (locator, buttonName) => {
  const buttons = await locator.getByRole('button', { name: buttonName }).all()
  if (buttons.length > 0) {
    return buttons[0]
  }
  return null
}

const clickButtonInLocator = async (locator, buttonName) => {
  const button = await getButtonInLocator(locator, buttonName)
  if (button) {
    await button.click()
    return button
  }
}

const likeBlog = async (blog, likes = 1) => {
  const indvBlog = await clickBlog(blog)
  const likesField = page.locator('.blog-likes')
  for (let i = 0; i < likes; i++) {
    const _likes = parseInt(await likesField.textContent())
    await clickButtonInLocator(indvBlog, 'Like!')
    await expect(indvBlog.getByText(_likes + 1)).toBeVisible()
  }
}

const clickBlog = async (blog) => {
  await blog.locator('a').click()
  const indvBlog = await page.locator('.indv-blog')
  await expect(indvBlog).toBeVisible()
  return indvBlog


}
const collapseBlog = async (blog) => await clickButtonInLocator(blog, 'Hide details')

const createBlog = async (blogData = null) => {
  if (!blogData) {
    blogData = validBlog
  }
  await showNewBlogEntry()
  await page.getByTestId('blog-title').fill(blogData.title)
  await page.getByTestId('blog-author').fill(blogData.author)
  await page.getByTestId('blog-url').fill(blogData.url)
  await page.getByRole('button', { name: 'Add entry' }).click()
  const addedBlog = await getBlog(blogData.title)
  await addedBlog.waitFor()
  return addedBlog
}

module.exports = {
  setPage,
  validUser,
  anotherValidUser,
  validBlog,
  anotherValidBlog,
  yetAnotherValidBlog,
  checkNotification,
  login,
  createBlog,
  getBlog,
  getBlogIndex,
  clickBlog,
  collapseBlog,
  likeBlog,
  getButtonInLocator,
  clickButtonInLocator
}