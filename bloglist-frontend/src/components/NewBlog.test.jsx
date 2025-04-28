import NewBlog from './NewBlog.jsx'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('<NewBlog /> form', () => {

  const blog = {
    title: 'Bob Log Blog',
    author: 'Bob',
    url: 'https://boblog.com',
  }

  let currentContainer
  let toggleableContainer

  const hiddenStyle = 'display: none'
  let fillerMock = vi.fn()
  let addBlogMock = vi.fn()

  beforeEach( () => {
    fillerMock = vi.fn()
    addBlogMock = vi.fn()
    const { container } = render(<NewBlog
      showNotification={fillerMock}
      addNewBlog={addBlogMock}
    />)
    currentContainer = container
    toggleableContainer = currentContainer.querySelector('.toggleable-content')

  })

  test('sends the right data to create the blog', async () => {
    const user = userEvent.setup()
    const userInput = screen.getByPlaceholderText('Blog title')
    const authorInput = screen.getByPlaceholderText('Blog author')
    const urlInput = screen.getByPlaceholderText('Blog URL')
    await user.type(userInput, blog.title)
    await user.type(authorInput, blog.author)
    await user.type(urlInput, blog.url)
    const button = await screen.getByText('Add entry')
    await user.click(button)
    expect(addBlogMock.mock.calls).toHaveLength(1)
    expect(addBlogMock.mock.calls[0][0]).toBe(blog.title)
    expect(addBlogMock.mock.calls[0][1]).toBe(blog.author)
    expect(addBlogMock.mock.calls[0][2]).toBe(blog.url)
  })

})