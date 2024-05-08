import fs from 'fs'
import { utilService } from '../../services/util.service.js'
import { loggerService } from '../../services/logger.service.js'

const PAGE_SIZE_DEFAULT = 2
const bugs = utilService.readJsonFile('data/bug.json')
// console.log(bugs)

export const bugService = {
    query,
    getById,
    remove,
    save
}

async function query(filterBy = {}) {
    // console.log(`back query filterBy: index=${filterBy.pageIndex}
    // title=${filterBy.title} severity=${filterBy.minSeverity}`)

    let filteredBugs = [...bugs]

    try {
        if (filterBy.title) {
            const regExp = new RegExp(filterBy.title, 'i')
            filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title))
        }

        if (filterBy.minSeverity) {
            filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
        }

        filteredBugs.sort((a, b) => {
            if (a.title !== b.title) {
                return a.title.localeCompare(b.title);
            } else {
                return a.severity - b.severity;
            }
        });

        const pageIndex = filterBy.pageIndex || 1;
        const pageSize = filterBy.pageSize || PAGE_SIZE_DEFAULT;
        const startIdx = (pageIndex - 1) * pageSize;
        const endIdx = startIdx + pageSize;
        const paginatedBugs = filteredBugs.slice(startIdx, endIdx);

        // console.log(paginatedBugs)
        return paginatedBugs
    } catch (err) {
        loggerService.error(`Error occurred while query: ${err}. Filter parameters used: ${filterBy.title} ${filterBy.minSeverity}`);
        throw err
    }
}

async function getById(bugId) {
    return new Promise((resolve, reject) => {
        try {
            console.log(bugs)
            console.log(`trying to get bugId: ${bugId}`)
            const bug = bugs.find(bug => bug._id === bugId);
            if (bug) {
                resolve(bug);
            } else {
                reject(new Error(`Bug with id ${bugId} not found`));
            }
        } catch (error) {
            reject(error);
        }
    });
}

async function remove(bugId) {
    try {
        const bugIndex = bugs.findIndex(bug => bug._id === bugId)
        bugs.splice(bugIndex, 1)
        _saveBugsToFile()
    } catch (error) {
        loggerService.error(`Error occurred while bug ${bugId} removal: ${err}.`);
        throw error
    }
}

async function save(bugToSave){
    try {
        if (bugToSave._id) {
            const index = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (index<0) throw `Cannot find the bug with id ${bugToSave._id}`
            bugs[index]=bugToSave
        } else {
            bugToSave._id = utilService.makeId()
            bugToSave.createdAt = Date.now()
            bugs.push(bugToSave)
        }
        await _saveBugsToFile()
        return bugToSave
    } catch (error) {
        loggerService.error(`Error occurred while bug saving ${bugToSave.title}: ${err}.`);
        throw error
    }
}

function _saveBugsToFile(path = './data/bug.json') {
    return new Promise ( (resolve, reject) => {
        const data = JSON.stringify(bugs, null, 4)
        fs.writeFile(path, data, (err) => {
            if (err) return reject(err)
            resolve()
        })
    })
}
