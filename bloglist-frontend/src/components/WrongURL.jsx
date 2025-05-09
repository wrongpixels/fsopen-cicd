import { useNavigate } from 'react-router-dom'

const WrongURL = () => {
  const navigate = useNavigate()
  return (
    <div>
      <h3>Page does not exist!</h3>
      <p>
        <button onClick={() => navigate('/')}>Go back</button>{' '}
      </p>
    </div>
  )
}

export default WrongURL
