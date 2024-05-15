import { Link } from "react-router-dom"

export function BugPreview({ bug }) {

    return <article >
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>{bug.desc}</p>
        <p>Severity: <span>{bug.severity}</span></p>
        {bug.owner &&
          <p> Owner: <Link to={`/user/${bug.owner._id}`}>{bug.owner.fullname}</Link></p>
        }
    </article>
}
