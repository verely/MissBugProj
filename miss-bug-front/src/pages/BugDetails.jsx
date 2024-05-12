
import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'


export function BugDetails() {

    const [bug, setBug] = useState(null)
    const params = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        loadBug()
    }, [params.bugId])

    async function loadBug() {
        try {
            console.log(params)
            const bug = await bugService.get(params.bugId)
            setBug(bug)
        } catch (err) {
            console.log(`Cannot load bug ${params.bugId}: ${err}`)
            showErrorMsg('Cannot load bug')
            navigate('/bug')
        }
    }

    if (!bug) return <h1>loadings....</h1>
    return <div className="bug-details container">
        <h3>Bug Details 🐛</h3>
        <h4>{bug.title}</h4>
        <h5>{bug.desc}</h5>
        <p>Severity: <span>{bug.severity}</span></p>
        <Link to="/bug">Back to List</Link>
    </div>

}

