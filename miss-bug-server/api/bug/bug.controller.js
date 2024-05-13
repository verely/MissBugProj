import { bugService } from './bug.service.js'
import { logger } from '../../services/logger.service.js'

export async function getBugs(req, res) {
    const { title = '', minSeverity = 0, pageIndex = 0 } = req.query

    const filterBy = { title, minSeverity: +minSeverity, pageIndex: +pageIndex }
    try {
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch (error) {
        logger.error(`Cannot get bugs`, error)
        res.status(400).send(`Cannot get bugs`)
    }
}

export async function getBug(req, res) {
    const { bugId } = req.params
    try {
        console.log('bugId:', bugId)
        const bug = await bugService.getById(bugId)
        console.log('bug:', bug)
        res.send(bug)
    } catch (error) {
        logger.error(`Cannot get a bug ${bugId}`, error)
        res.status(400).send(`Cannot get a bug ${bugId}`)
    }
}

export async function addBug(req, res) {
    const { loggedInUser } = req
    const {title, desc, severity} = req.body
    let bugToSave = {title, desc, severity: +severity, owner: loggedInUser}
    try {
        bugToSave = await bugService.add(bugToSave)
        res.send(bugToSave)
    } catch (error) {
        logger.error(`Cannot add a bug`, error)
        res.status(400).send(`Cannot add a bug`)
    }
}

export async function updateBug(req, res) {
    const { loggedInUser } = req
    const {_id, title, desc, severity, createdAt, owner} = req.body
    let bugToSave = {_id, title, desc, severity: +severity, createdAt}
    try {
        bugToSave = await bugService.update(bugToSave)
        res.send(bugToSave)
    } catch (error) {
        logger.error(`Cannot update a bug`, error)
        res.status(400).send(`Cannot update a bug`)
    }
}

export async function removeBug(req, res) {
    try {
        const bugId = req.params.bugId
        await bugService.remove(bugId)
        res.send('deleted')
    } catch (error) {
        logger.error(`Cannot remove bug ${bugId}`, error)
        res.status(400).send(`Cannot remove bug`)
    }
}
