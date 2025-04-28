import Blog from './Blog.jsx'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

describe('<Blog /> component', () => {

  const blog = {
    title: 'Bob Log Blog',
    author: 'Bob',
    url: 'https://boblog.com',
    likes: 0,
    user: {
      username: 'Willy'
    }
  }
  const activeUser = {
    username: 'Bob'
  }
  let currentContainer
  let toggleableContainer

  const hiddenStyle = 'display: none'
  let fillerMock = vi.fn()
  let likeMock = vi.fn()
  beforeEach( () => {
    fillerMock = vi.fn()
    likeMock = vi.fn()
    const { container } = render(<Blog
      activeUser={activeUser}
      deleteBlog={fillerMock}
      showNotification={fillerMock}
      likeBlog={likeMock}
      blog={blog}
    />)
    currentContainer = container
    toggleableContainer = currentContainer.querySelector('.toggleable-content')

  })

  test('displays title and author, but not url and likes', () => {
    const title = screen.getByText(blog.title)
    const author = screen.getByText(`by ${blog.author}`)
    const url = screen.getByText(blog.url, { exact: false })
    const likes = screen.getByText('Likes:')
    expect(title).toBeVisible()
    expect(author).toBeVisible()
    expect(url).not.toBeVisible()
    expect(likes).not.toBeVisible()
    expect(toggleableContainer).toHaveStyle(hiddenStyle)
  })
  test('url and likes become visible after click', async () => {
    const url = screen.getByText(blog.url, { exact: false })
    const likes = screen.getByText('Likes:')
    const user = userEvent.setup()
    const button = screen.getByText('Show details')
    await user.click(button)
    expect(url).toBeVisible()
    expect(likes).toBeVisible()
    expect(toggleableContainer).not.toHaveStyle(hiddenStyle)
  })
  test('if we hit like 2, thus many calls take place', async () => {
    const user = userEvent.setup()
    const likeButton = screen.getByText('Like!')
    await user.click(likeButton)
    await user.click(likeButton)
    expect(likeMock.mock.calls).toHaveLength(2)
  })
})