import { useState, useEffect } from 'react'
import { useParams, useNavigate, NavLink } from 'react-router-dom'
import { userService } from '../services/user.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'


export function UserDetails() {

    const [user, setUser] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadUser()
    }, [params.userId])

    async function loadUser() {
        try {
            console.log(params)
            const user = await userService.get(params.userId)
            setUser(user)
        } catch (err) {
            console.log(`Cannot load user ${params.userId}: ${err}`)
            showErrorMsg('Cannot load user')
            navigate('/user')
        }
    }

    if (!user) return <h1>loadings....</h1>
    return <div className="user-details">
        <h3>User Details 😊</h3>
        <h4>Full Name: {user.fullname}</h4>
        <h5>Username: {user.username}</h5>
        <p>Score: <span>{user.score}</span></p>
        <NavLink to="/user">Back to List</NavLink>
    </div>

}

