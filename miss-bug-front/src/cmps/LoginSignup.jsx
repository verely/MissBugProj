import { useState } from 'react'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service.js'
import { authService } from '../services/auth.service.js'

// const { useState } = React

export function LoginSignup({ onSetUser }) {

    const [isSignUp, setIsSignUp] = useState(false)
    const [credentials, setCredentials] = useState(authService.getEmptyCredentials())

    function handleChange({ target }) {
        const { name: field, value } = target
        setCredentials(prevCreds => ({ ...prevCreds, [field]: value }))
    }

    function handleSubmit(ev) {
        ev.preventDefault()
        onLogin(credentials)
    }


    function onLogin(credentials) {
        isSignUp ? signup(credentials) : login(credentials)
    }

    async function login(credentials) {
        try {
            await authService.login(credentials);
            onSetUser();
            showSuccessMsg('Logged in successfully');
        } catch (err) {
            showErrorMsg('Login failed. Please ensure your username and password are correct and try again.');
        }
    }


    async function signup(credentials) {
        try {
            await authService.signup(credentials);
            onSetUser();
            showSuccessMsg('Signed in successfully');
        } catch (err) {
            showErrorMsg('Sign up failed. Please try again.');
        }
    }

    return (
        <div className="login-page">
            <form className="login-form" onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="username"
                    value={credentials.username}
                    placeholder="Username"
                    onChange={handleChange}
                    required
                    autoFocus
                />
                <input
                    type="password"
                    name="password"
                    value={credentials.password}
                    placeholder="Password"
                    onChange={handleChange}
                    required
                    autoComplete="off"
                />
                {isSignUp && <input
                    type="text"
                    name="fullname"
                    value={credentials.fullname}
                    placeholder="Full name"
                    onChange={handleChange}
                    required
                />}
                <button>{isSignUp ? 'Sign up' : 'Login'}</button>
            </form>

            <div className="btns">
                <a href="#" onClick={() => setIsSignUp(!isSignUp)}>
                    {isSignUp ?
                        'Already a member? Login' :
                        'New user? Sign up here'
                    }
                </a >
            </div>
        </div >
    )
}
