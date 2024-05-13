export function UserPreview({ user }) {

    return <article >
        <h4>{user.username}</h4>
        <p>{user.fullname}</p>
        <h1>😊</h1>
        <p>Score: <span>{user.score}</span></p>
    </article>
}
