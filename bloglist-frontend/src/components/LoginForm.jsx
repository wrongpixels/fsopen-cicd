import loginService from '../services/login.js'
import { Form, Button } from 'react-bootstrap'
import useNotification from '../hooks/useNotification.js'
import useInputField from '../hooks/useInputField.js'
import { forwardRef, useImperativeHandle } from 'react'
import styles from './styles/componentStyles.js'

const LoginForm = forwardRef((props, refs) => {
  const { showError } = useNotification()
  LoginForm.displayName = 'LoginForm'
  const [username, userProps, userFunctions] = useInputField(
    'text',
    'Username',
    '',
    'username'
  )
  const [password, passProps, passFunctions] = useInputField(
    'password',
    'Password',
    '',
    'password'
  )
  const { setSession } = props

  const cleanForm = () => {
    passFunctions.clean()
    userFunctions.clean()
  }
  useImperativeHandle(refs, () => ({ cleanForm }))

  const doLogin = async (event) => {
    event.preventDefault()
    if (!username || !password) {
      showError('Username and password can\'t be empty.')
      return
    }
    const userData = await loginService.tryLogin(username, password)
    if (userData === null) {
      showError('Login failed.')
      return
    }
    if (userData.error) {
      showError(userData.error)
      return
    }
    if (!userData.token) {
      showError('Token is not valid.')
      return
    }
    setSession(userData)
  }

  return (
    <div className="mt-4">
      <h1>
        <b>Blogs App</b>
      </h1>
      <h4>
        <b>Login to use</b>
      </h4>
      <Form onSubmit={doLogin}>
        <Form.Group>
          <div className="mt-4">
            <Form.Label>
              <b>Username</b>
            </Form.Label>
            <Form.Control {...userProps} {...styles.fixedForm} />
          </div>
          <div className="mt-3">
            <Form.Label>
              <b>Password</b>
            </Form.Label>
            <Form.Control {...passProps} {...styles.fixedForm} />
          </div>
        </Form.Group>
        <p>
          <Button type="submit" {...styles.normalButton}>
            Login
          </Button>
        </p>
      </Form>
    </div>
  )
})

export default LoginForm
