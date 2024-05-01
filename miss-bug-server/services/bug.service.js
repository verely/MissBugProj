import fs from 'fs'
import { utilService } from "./util.service.js"


// console.log('readJsonFile')
const bugs = utilService.readJsonFile('data/bug.json')
// console.log(bugs)

export const bugService = {
    query,
    getById,
    remove,
    save
}

async function query() {
    //return Promise.resolve(bugs)
    try {
        return bugs
    } catch (error) {
        throw error
    }
}

// async function getById(bugId) {
//     try {
//         const bug = bugs.find(bug=> bug._id === bugId)
//         return bug
//     } catch (error) {
//         throw error
//     }
// }

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
        throw error
    }
}

async function save(bugToSave){
    try {
        if (bugToSave._id) {
            const index = bugs.findIndex(bug => bug._id === bugToSave._id)
            if (index<0) throw `Cannot find the bug with id ${bugToSave._id}`
        } else {
            bugToSave._id = utilService.makeId()
            bugs.push(bugToSave)
        }
        await _saveBugsToFile()
        return bugToSave
    } catch (error) {
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
