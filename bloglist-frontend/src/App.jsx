import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Header from './components/Header.jsx'
import Blogs from './components/Blogs.jsx'
import Blog from './components/Blog.jsx'
import Users from './components/Users'
import User from './components/User.jsx'
import WrongURL from './components/WrongURL.jsx'
import useActiveUser from './hooks/useActiveUser.js'

const App = () => {
  const { activeUser: user } = useActiveUser()

  return (
    <div>
      <Router>
        {<Header user={user} />}
        <div className="container w-50">
          <Routes>
            <Route path="/" element={<Blogs user={user} />} />
            <Route path="/users" element={<Users user={user} />} />
            <Route path="/users/:id" element={<User user={user} />} />
            <Route path="/blogs/:id" element={<Blog user={user} />} />
            <Route path="*" element={<WrongURL />} />
          </Routes>
        </div>
      </Router>
    </div>
  )
}

export default App
