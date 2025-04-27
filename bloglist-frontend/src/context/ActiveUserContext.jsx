import { useReducer, useContext, createContext } from 'react'

const USER_KEY = 'activeUser'

const existingSession = () => {
  const session = window.localStorage.getItem(USER_KEY)
  if (session) {
    const validUser = JSON.parse(session)
    return validUser?.token ? validUser : null
  }
  return null
}

const ActiveUserContext = createContext()

const activeUserReducer = (state, { type, payload }) => {
  switch (type) {
  case 'LOGIN': {
    window.localStorage.setItem(USER_KEY, JSON.stringify(payload || null))
    return payload
  }
  case 'LOGOUT': {
    window.localStorage.removeItem(USER_KEY)
    return null
  }
  case 'RESTORE_SESSION': {
    const existing = existingSession()
    if (!existing) {
      window.localStorage.removeItem(USER_KEY)
    }
    return existing
  }
  default:
    return state
  }
}
export const useActiveUserContext = () => useContext(ActiveUserContext)

export const UserLoginContextProvider = ({ children }) => {
  const propValues = useReducer(activeUserReducer, existingSession())

  return (
    <ActiveUserContext.Provider value={propValues}>
      {children}
    </ActiveUserContext.Provider>
  )
}

export default ActiveUserContext
