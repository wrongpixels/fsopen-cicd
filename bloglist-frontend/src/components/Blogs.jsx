import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { Table } from 'react-bootstrap'
import Toggleable from '../components/Toggleable'
import styles from './styles/componentStyles.js'
import NewBlog from '../components/NewBlog'
import useNotification from '../hooks/useNotification.js'
import { useBlogs } from '../hooks/useBlogs.js'

const Blogs = ({ user }) => {
  const { showError, showNotification } = useNotification()
  const { blogsQuery, createBlogMutation } = useBlogs()
  const { isLoading, isError, data } = blogsQuery

  const newBlogRef = useRef()
  if (!user) {
    return null
  }
  if (isLoading) {
    return <h2>Loading app…</h2>
  }
  if (isError) {
    return (
      <h3>
        Server not available! <p>Please, try later.</p>
      </h3>
    )
  }

  const blogs = data
  const addNewBlog = async (blog) => {
    try {
      const newBlog = await createBlogMutation.mutateAsync(blog)
      showNotification(
        `'${newBlog.title}' by ${newBlog.author} was added to the Blog List!`
      )
      newBlogRef.current?.toggleVisibility()
      return newBlog
    } catch (e) {
      if (e.response?.data?.error) {
        showError(e.response.data.error)
      } else {
        showError('There was an error adding the entry')
      }
    }
  }

  return (
    <div>
      <h1>
        <b>Blogs</b>
      </h1>
      <div className="blog-list">
        <div {...styles.bubble}>
          <Table>
            <thead>
              <tr>
                <th className="bg-transparent">
                  <h4>
                    <b>Title</b>:
                  </h4>
                </th>
                <th className="bg-transparent">
                  <h4>
                    <b>Author</b>:
                  </h4>
                </th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((b) => (
                <tr key={b.id}>
                  <td className="bg-transparent blog-entry">
                    <b>
                      {
                        <Link to={`/blogs/${b.id}`} {...styles.link}>
                          {b.title}
                        </Link>
                      }{' '}
                    </b>{' '}
                  </td>
                  <td className="bg-transparent"> {`${b.author}`}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>

      <div>
        <Toggleable
          ref={newBlogRef}
          labelOnVisible={'Hide new Blog Form'}
          labelOnInvisible={'Add a new Blog'}
          initialVisibility={false}
          addSpace={false}
          showOver={true}
        >
          <NewBlog addNewBlog={addNewBlog} />
        </Toggleable>
      </div>
    </div>
  )
}

export default Blogs
