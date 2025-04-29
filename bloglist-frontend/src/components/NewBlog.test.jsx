import { describe, test, expect, vi, beforeEach } from 'vitest'
import NewBlog from './NewBlog.jsx'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('<NewBlog /> form', () => {
  const blog = {
    id: '123',
    title: 'Bob Log Blog',
    author: 'Bob',
    url: 'https://boblog.com',
    likes: 0,
    user: {
      username: 'Willy',
      id: '456',
    },
  }

  vi.mock('../hooks/useNotification', () => ({
    default: () => ({
      showError: vi.fn(),
      showNotification: vi.fn()
    })
  }))

  let addBlogMock = vi.fn()

  beforeEach(() => {
    addBlogMock = vi.fn()
    render(<NewBlog addNewBlog={addBlogMock} />)
  })

  test('sends the right data to create the blog', async () => {
    const user = userEvent.setup()
    const userInput = screen.getByPlaceholderText('Title')
    const authorInput = screen.getByPlaceholderText('Author')
    const urlInput = screen.getByPlaceholderText('URL')
    await user.type(userInput, blog.title)
    await user.type(authorInput, blog.author)
    await user.type(urlInput, blog.url)
    const button = await screen.getByText('Add entry')
    await user.click(button)
    expect(addBlogMock.mock.calls).toHaveLength(1)
    expect(addBlogMock.mock.calls[0][0]).toEqual({
      title: blog.title,
      author: blog.author,
      url: blog.url
    })
  })
})
