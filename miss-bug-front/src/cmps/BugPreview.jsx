

export function BugPreview({ bug }) {

    return <article >
        <h4>{bug.title}</h4>
        <h1>🐛</h1>
        <p>{bug.desc}</p>
        <p>Severity: <span>{bug.severity}</span></p>
        <p>Owner: <span>{bug.owner.fullname}</span></p>
    </article>
}
