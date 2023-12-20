const { NavLink, Link } = ReactRouterDOM
// const {useEffect} = React
const { useState } = React

import { userService } from '../services/user.service.js'
import { LoginSignup } from './LoginSignUp.jsx'
import { UserMsg } from './UserMsg.jsx'

export function AppHeader() {
  // useEffect(() => {
  //   // component did mount when dependancy array is empty
  // }, [])


  const [user, setUser] = useState(userService.getLoggedinUser())

  function onLogout() {
    userService.logout()
      .then(() => {
        onSetUser(null)
      })
      .catch((err) => {
        showErrorMsg('OOPs try again')
      })
  }

  function onSetUser(user) {
    setUser(user)
    navigate('/')
  }


  return (
    <header>
      <UserMsg />
      <nav>
        <NavLink to="/">Home</NavLink> |<NavLink to="/bug">Bugs</NavLink> |
        <NavLink to="/about">About</NavLink>
      </nav>
      <h1>Bugs are Forever</h1>
      {user ? (
        <section className="user-login">
          <h1>Hello {user.fullname}</h1>
          <span>
            <Link to={`/user/${user._id}`}>Navigate to your page</Link>
          </span>
          <button onClick={onLogout}>Logout</button>
        </ section >
      ) : (
        <section>
          <LoginSignup onSetUser={onSetUser} />
        </section>
      )}
    </header>
    
  )
}
