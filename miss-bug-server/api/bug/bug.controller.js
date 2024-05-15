import { bugService } from './bug.service.js'
import { logger } from '../../services/logger.service.js'
import { UnauthorizedError } from '../auth/auth.error.js'

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
    const { bug } = req.body

    try {
        const bugToSave = await bugService.add(bug, loggedInUser)
        res.send(bugToSave)
    } catch (error) {
        logger.error(`Cannot add a bug`, error)
        res.status(400).send(`Cannot add a bug`)
    }
}

export async function updateBug(req, res) {
    const { loggedInUser } = req
    const { bug } = req.body
    console.log(bug)
    try {
        await bugService.update(bug, loggedInUser)
        res.send('updated')
    } catch (err) {
        if (err instanceof UnauthorizedError) {
            logger.error(`Failed update bug ${bug._id}: ${err.message}`);
            res.status(403).send(`Failed update bug: ${err.message}`);
        } else {
            logger.error(`Failed update bug ${bug._id}`, err);
            res.status(500).send(`Failed update bug: ${err.message}`);
        }
    }
}

export async function removeBug(req, res) {
    const { loggedInUser } = req
    const { bugId } = req.params
    try {
        await bugService.remove(bugId, loggedInUser)
        res.send('deleted')
    } catch (err) {
        if (err instanceof UnauthorizedError) {
            logger.error(`Failed remove bug ${bugId}: ${err.message}`);
            res.status(err.statusCode).send(`Failed remove bug: ${err.message}`);
        } else {
            logger.error(`Failed remove bug ${bugId}`, err);
            res.status(500).send(`Failed remove bug: ${err.message}`);
        }
    }
}
