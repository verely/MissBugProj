import { bugService } from './bug.service.js'

export async function getBugs(req, res) {
    const { title, minSeverity, pageIndex } = req.query

    const filterBy = { title, minSeverity: +minSeverity, pageIndex: +pageIndex }
    try {
        const bugs = await bugService.query(filterBy)
        res.send(bugs)
    } catch (error) {
        loggerService.error(`Cannot get bugs`, error)
        res.status(400).send(`Cannot get bugs`)
    }
}

export async function getBug(req, res) {
    try {
        const bugId = req.params.bugId
        console.log('bugId:', bugId)
        const bug = await bugService.getById(bugId)
        console.log('bug:', bug)
        res.send(bug)
    } catch (error) {
        loggerService.error(`Cannot get a bug ${bugId}`, error)
        res.status(400).send(`Cannot get a bug ${bugId}`)
    }
}

export async function removeBug(req, res) {
    try {
        const bugId = req.params.bugId
        await bugService.remove(bugId)
        res.send('deleted')
    } catch (error) {
        loggerService.error(`Cannot remove bug ${bugId}`, error)
        res.status(400).send(`Cannot remove bug`)
    }
}

export async function updateBug(req, res) {
    const {_id, title, desc, severity, createdAt} = req.body
    let bugToSave = {_id, title, desc, severity: +severity, createdAt}
    try {
        bugToSave = await bugService.save(bugToSave)
        res.send(bugToSave)
    } catch (error) {
        loggerService.error(`Cannot save a bug`, error)
        res.status(400).send(`Cannot save a bug`)
    }
}

export async function addBug(req, res) {
    const {title, desc, severity} = req.body
    let bugToSave = {title, desc, severity: +severity}
    try {
        bugToSave = await bugService.save(bugToSave)
        res.send(bugToSave)
    } catch (error) {
        loggerService.error(`Cannot save a bug`, error)
        res.status(400).send(`Cannot save a bug`)
    }
}
