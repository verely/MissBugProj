import { useCallback, useEffect, useState } from 'react';

import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { bugService } from '../services/bug.service.js'
import { utilService } from '../services/util.service.js';

import { BugFilter } from '../cmps/BugFilter.jsx';
import { BugList } from '../cmps/BugList.jsx'


export function BugIndex() {
  const [bugs, setBugs] = useState([])
  // const [currentPage, setCurrentPage] = useState(1);
  const [filterBy, setFilterBy] = useState(bugService.getDefaultFilter())

  const debouncedSetFilterBy =
     useCallback(utilService.debounce(onSetFilterBy, 1000), [])

  useEffect(() => {
    loadBugs()
  }, [filterBy])


  function onSetFilterBy(filterBy) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
  }

  async function loadBugs() {
    try {
      const bugs = await bugService.query(filterBy)
      setBugs(bugs)
    } catch (err) {
      console.log('Cannot load bugs:',err)
      showErrorMsg('Cannot load bugs')
    }
  }

  async function onRemoveBug(bugId) {
    try {
      await bugService.remove(bugId)
      console.log('Deleted Successfully!')
      setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
      showSuccessMsg('Bug removed')
    } catch (err) {
      console.log('Cannot remove bug:', err)
      showErrorMsg('Cannot remove bug')
    }
  }

  async function onAddBug() {
    const bug = {
      title: prompt('Bug title?'),
      desc: prompt('Bug description?'),
      severity: +prompt('Bug severity?'),
    }
    try {
      const savedBug = await bugService.save(bug)
      console.log('Added Bug', savedBug)
      setBugs(prevBugs => [...prevBugs, savedBug])
      showSuccessMsg('Bug added')
    } catch (err) {
      console.log('Error from onAddBug ->', err)
      showErrorMsg('Cannot add bug')
    }
  }

  async function onEditBug(bug) {
    const severity = +prompt('New severity?')
    const bugToSave = { ...bug, severity }
    try {

      const savedBug = await bugService.save(bugToSave)
      console.log('Updated Bug:', savedBug)
      setBugs(prevBugs => prevBugs.map((currBug) =>
        currBug._id === savedBug._id ? savedBug : currBug
      ))
      showSuccessMsg('Bug updated')
    } catch (err) {
      console.log('Error from onEditBug ->', err)
      showErrorMsg('Cannot update bug')
    }
  }

  return (
    <main className="bug-index">
      <main>
        <BugFilter filterBy={filterBy} onSetFilterBy={debouncedSetFilterBy}/>
        <button className='btn-add' onClick={onAddBug}>Add Bug ⛐</button>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}
