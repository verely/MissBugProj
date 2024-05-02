import Axios from 'axios'

var axios = Axios.create({
    withCredentials: true
})

import { utilService } from './util.service.js'
import { storageService } from './storage.service.js'

// const BASE_URL = 'http://localhost:3030/api/bug/'
// const BASE_URL = '//localhost:3030/api/bug/'
const BASE_URL = '//localhost:3000/api/bug/'
// const BASE_URL =  process.env.NODE_ENV !== 'development'
//         ? '/api/'
//         : '//localhost:3000/api/'

const BUG_KEY = 'bugDB'

_createBugs()


export const bugService = {
    query,
    get,
    remove,
    save,
    getEmptyBug,
    getDefaultFilter,
}

async function query(filterBy = {}) {
    let { data: bugs } = await axios.get(BASE_URL)

    if (filterBy.title) {
        const regExp = new RegExp(filterBy.title, 'i')
        bugs = bugs.filter(bug => regExp.test(bug.title))
    }

    if (filterBy.severity) {
        bugs = bugs.filter(bug => bug.severity = filterBy.severity)
    }
    return bugs
}

async function get(bugId) {
    const { data: bug } = await axios.get(BASE_URL + bugId)
    return bug
}

async function remove(bugId) {
    return axios.delete(BASE_URL + bugId)
}

async function save(bug) {
    const method = bug._id ? 'put' : 'post'
    const { data: savedBug } = await axios[method](BASE_URL + (bug._id || ''), bug)

    // const queryParams = `?_id=${bug._id || ''}&title=${bug.title}&desc=${bug.desc}&severity=${bug.severity}`
    // const { data: savedBug } = await axios.get(BASE_URL + 'save' + queryParams)
    return savedBug
}

function getEmptyBug(title = '', desc='', severity = '') {
    return { title, desc, severity }
}

function getDefaultFilter() {
    return { title: '', severity: '' }
}

function _createBugs() {
    let bugs = storageService.loadFromStorage(BUG_KEY) || []
    if (bugs.length) return

    bugs.push(_createBug('Unable to delete user account', 300))
    bugs.push(_createBug('Login button not working', 120))
    bugs.push(_createBug('Crash when uploading large files', 50))
    bugs.push(_createBug('Incorrect date format on website', 150))

    storageService.saveToStorage(BUG_KEY, bugs)
}

function _createBug(title, severity = 3) {
    const bug = getEmptyBug(title, severity)
    bug._id = utilService.makeId()
    return bug
}
