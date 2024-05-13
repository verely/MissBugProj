
import { useEffect } from 'react'
import { NavLink } from 'react-router-dom'

export function AppHeader() {

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
        </header>
    )
}
