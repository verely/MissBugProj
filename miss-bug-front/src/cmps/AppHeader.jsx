
import { useState } from 'react'
import { useNavigate, Link, NavLink } from 'react-router-dom'

import { UserMsg } from './UserMsg.jsx'
import { LoginSignup } from './LoginSignup.jsx'
import { authService  } from '../services/auth.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'

export function AppHeader() {

    const navigate = useNavigate()

    const [user, setUser] = useState(authService.getLoggedInUser())

    async function onLogout() {
        try {
            await authService.logout()
            onSetUser(null)
        } catch (err) {
            showErrorMsg(`Error while logout, please try again`)
        }
    }

    function onSetUser(user) {
        setUser(user)
        navigate('/')
    }

    return (
        <header className='app-header container'>

            <div className='header-container'>
                <nav className='app-nav'>
                    <NavLink to="/">Home</NavLink> |
                    <NavLink to="/bug">Bugs</NavLink> |
                    <NavLink to="/user">Users</NavLink> |
                    <NavLink to="/about">About</NavLink>
                </nav>
                <h2>Miss Bug: Helping Us Improve</h2>
            </div>
            {user ? (
                < section >
                    <Link to={`/user/${user._id}`}>Hello {user.fullname}</Link>
                    <button onClick={onLogout}>Logout</button>
                </ section >
            ) : (
                <section>
                    <LoginSignup onSetUser={onSetUser} />
                </section>
            )}
            <UserMsg />
        </header>
    )
}
