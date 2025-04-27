import { useNotificationValue } from '../context/NotificationContext.jsx'
import { Alert } from 'react-bootstrap'

const Notification = () => {
  const { message, error } = useNotificationValue()
  if (!message) {
    return null
  }

  const variant = error ? 'danger' : 'success'

  return (
    <Alert
      variant={variant}
      className={`notification shadow-sm fs-5 text-${variant}`}
    >
      {message}
    </Alert>
  )
}

export default Notification
