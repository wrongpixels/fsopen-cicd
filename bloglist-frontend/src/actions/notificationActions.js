export const setNotification = (message, error = true) => ({
  type: 'NOTIFICATION_SET',
  payload: { message, error },
})

export const resetNotification = {
  type: 'NOTIFICATION_RESET',
  payload: null,
}
