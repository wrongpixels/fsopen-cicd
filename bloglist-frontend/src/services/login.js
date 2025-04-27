import axios from 'axios'

const baseUrl = '/api/login'

const tryLogin = async (_username, _password) => {
  if (!_username || !_password) {
    return null
  }
  try {
    const loginData = await axios.post(baseUrl, {
      username: _username,
      password: _password,
    })

    if (!loginData || !loginData.data) {
      return null
    }
    if (loginData.data.error) {
      return loginData.data
    }
    return {
      token: loginData.data.userToken,
      username: loginData.data.username,
      name: loginData.data.name,
    }
  } catch (e) {
    return e.response.data
  }
}

export default { tryLogin }
