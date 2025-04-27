import {
  setNotification,
  resetNotification,
} from '../actions/notificationActions'
import { useNotificationDispatch } from '../context/NotificationContext'
let currentTimeOut = null

const useNotification = () => {
  const dispatch = useNotificationDispatch()

  const showError = (message, time = 5) => {
    showAlert(message, true, time)
  }
  const showNotification = (message, time = 5) => {
    showAlert(message, false, time)
  }
  const showAlert = (message, error = true, time = 5) => {
    if (currentTimeOut) {
      clearTimeout(currentTimeOut)
    }
    dispatch(setNotification(message, error))
    currentTimeOut = setTimeout(() => dispatch(resetNotification), time * 1000)
  }
  return { showAlert, showNotification, showError }
}

export default useNotification
