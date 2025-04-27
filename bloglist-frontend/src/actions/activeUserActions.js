export const setUser = (userData) => ({
  type: 'LOGIN',
  payload: userData,
})

export const resetUser = {
  type: 'LOGOUT',
}

export const restoreUser = {
  type: 'RESTORE_SESSION',
}
