import { useMatch, useNavigate, Link } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'
import { useUsersQuery } from '../queries/usersQueries.js'
import { Button } from 'react-bootstrap'
import styles from './styles/componentStyles.js'

const User = ({ user }) => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const cachedUsers = queryClient.getQueryData(['users'])

  const match = useMatch('/users/:id')
  const { data, isLoading, isError } = useUsersQuery()
  if (!user) {
    return null
  }
  const users = cachedUsers ? cachedUsers : isLoading || isError ? null : data
  if (!users) {
    if (isLoading) {
      return <h3>Loading...</h3>
    }
    if (isError) {
      return <h3>Error loading users data.</h3>
    }
  }

  if (!users) {
    return <div>No users data available.</div>
  }
  const targetUser = users.find((u) => u.id === match?.params.id)

  if (!targetUser) {
    return <div>User not found in server.</div>
  }

  return (
    <>
      <h1>
        <b>Users</b>
      </h1>
      <h3>
        <b>{targetUser.name}</b> <i>({targetUser.username}</i>)
      </h3>
      <div {...styles.bubble}>
        <div className="mt-2 pb-2">
          <h4>
            <b>Added blogs:</b>
          </h4>
        </div>
        {!targetUser.blogs ||
          (targetUser.blogs.length === 0 && (
            <div className="mt-1">... No results!</div>
          ))}
        <ul>
          {targetUser.blogs.map((b) => (
            <li key={b.id}>
              <Link {...styles.link} to={`/blogs/${b.id}`}>
                {b.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <Button
        onClick={() => navigate('/users')}
        {...styles.fixedButton}
        variant="outline-secondary"
      >
        Go back
      </Button>
    </>
  )
}

export default User
