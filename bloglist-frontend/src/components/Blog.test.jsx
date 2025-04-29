import { describe, test, expect, vi, beforeEach } from 'vitest'
import Blog from './Blog'
import { screen, render } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter, Route, Routes } from 'react-router-dom'

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

let replaceBlogMutation

vi.mock('../hooks/useNotification', () => ({
  default: () => ({
    showError: vi.fn(),
    showNotification: vi.fn(),
  }),
}))

vi.mock('../hooks/useBlogs', () => ({
  useBlog: () => ({
    blogsQuery: {
      isLoading: false,
      isError: false,
      data: [blog]
    },
    replaceBlogMutation: {
      mutate: replaceBlogMutation
    }
  })
}))

describe('<Blog /> component', () => {
  const activeUser = {
    username: 'Bob',
  }

  let queryClient

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: {
          retry: false,
        },
      },
    })

    replaceBlogMutation = vi.fn()
  })

  const renderBlog = () => {
    return render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={[`/blogs/${blog.id}`]}>
          <Routes>
            <Route path="/blogs/:id" element={<Blog user={activeUser} />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    )
  }

  test('displays title and author', () => {
    renderBlog()
    expect(screen.getByText(blog.title)).toBeInTheDocument()
    expect(screen.getByText(`(by ${blog.author})`)).toBeInTheDocument()
  })

  test('displays URL and likes', () => {
    renderBlog()
    expect(screen.getByText(blog.url)).toBeInTheDocument()
    expect(screen.getByText('Likes:')).toBeInTheDocument()
    expect(screen.getByText('0')).toBeInTheDocument()
  })

  test('clicking like button calls mutation with correct data', async () => {
    renderBlog()
    const user = userEvent.setup()
    const likeButton = screen.getByText('Like!')

    await user.click(likeButton)
    await user.click(likeButton)

    expect(replaceBlogMutation).toHaveBeenCalledTimes(2)
    expect(replaceBlogMutation).toHaveBeenCalledWith(
      { id: blog.id, likes: 1 },
      expect.any(Object)
    )
  })



  test('delete button is shown only for blog creator', () => {
    renderBlog()
    const deleteButton = screen.queryByText('Remove')

    if (blog.user.username === activeUser.username) {
      expect(deleteButton).toBeInTheDocument()
    } else {
      expect(deleteButton).not.toBeInTheDocument()
    }
  })
})