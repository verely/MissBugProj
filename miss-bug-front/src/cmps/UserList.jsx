
import { NavLink } from 'react-router-dom'
import { UserPreview } from './UserPreview'

export function UserList({ users, onRemoveUser, onEditUser }) {
  return (
    <ul className="user-list">
      {users.map((user) => (
        <li className="user-preview" key={user._id}>
          <UserPreview user={user} />
          <div>
            <button
              onClick={() => {
                onRemoveUser(user._id)
              }}
            >
              x
            </button>
            <button
              onClick={() => {
                onEditUser(user)
              }}
            >
              Edit
            </button>
          </div>
          <NavLink to={`/user/${user._id}`}>Details</NavLink>
        </li>
      ))}
    </ul>
  )
}

