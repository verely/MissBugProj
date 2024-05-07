import { useEffect, useState } from "react"

export function BugFilter({ filterBy, onSetFilterBy }) {

    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        console.log(filterByToEdit)
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        console.log('handleChange')
        const field = target.name
        let value = target.value

        switch (target.type) {
            case 'number':
            case 'range':
                value = +value || ''
                break;

            case 'checkbox':
                value = target.checked
                break

            default:
                break;
        }

        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
    }

    function handlePageChange(step) {
        const newPage = currentPage + step
        setCurrentPage(newPage);
        setFilterByToEdit(prevFilter => ({...prevFilter, pageIndex: newPage}));
    }

    function onSubmitFilter(ev) {
        ev.preventDefault()
        onSetFilterBy(filterByToEdit)
        console.log(`onSubmitFilter: ${filterByToEdit.pageIndex}, ${filterByToEdit.title}, ${filterByToEdit.minSeverity}`)
    }

    const { title, minSeverity } = filterByToEdit
    return (
        <section className="bug-filter">
            <h2>Bug Filter</h2>
            <form onSubmit={onSubmitFilter}>
                <label htmlFor="title">Title: </label>
                <input value={title} onChange={handleChange} type="text" placeholder="By Title" id="title" name="title" />

                <label htmlFor="minSeverity">Min Severity: </label>
                <input value={minSeverity} onChange={handleChange} type="number" placeholder="By Min Severity" id="minSeverity" name="minSeverity" />

                {/* <button>Set Filter</button> */}
            </form>
            <div>
                <button onClick={() => handlePageChange(-1)} disabled={currentPage === 1}>Previous</button>
                <span>Page {currentPage}</span>
                <button onClick={() => handlePageChange(1)}>Next</button>
            </div>
        </section>
    )
}
