
import { Link } from 'react-router-dom'
import { BugPreview } from './BugPreview'
import { authService } from '../services/auth.service'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

  const user = authService.getLoggedInUser()

  function isOwner(bug) {
    //console.log(bug.owner)
    if (!user) return false
    if (!bug.owner) return true
    return user.isAdmin || (bug.owner._id === user._id)
  }

  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          <section>
            <Link to={`/bug/${bug._id}`}>Details</Link>
            {
              isOwner(bug) && <div>
                <button onClick={() => { onRemoveBug(bug._id) }}> x </button>
                <button onClick={() => { onEditBug(bug) }}> Edit </button>
              </div>
            }
          </section>
        </li>
      ))}
    </ul>
  )
}
