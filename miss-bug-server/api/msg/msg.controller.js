import { msgService } from './msg.service.js'
import { logger } from '../../services/logger.service.js'
import { UnauthorizedError } from '../auth/auth.error.js'

export async function getMessages(req, res) {
    try {
        const messages = await msgService.query()
        res.send(messages)
    } catch (err) {
        logger.error(`Cannot get messages`, err)
        res.status(400).send(`Cannot get messages`)
    }
}

export async function getMessage(req, res) {
    const { msgId } = req.params
    try {
        console.log('msgId:', msgId)
        const msg = await msgService.getById(msgId)
        console.log('msg:', msg)
        res.send(msg)
    } catch (err) {
        logger.error(`Cannot get a msg ${msgId}`, err)
        res.status(400).send(`Cannot get a msg ${msgId}`)
    }
}

export async function addMessage(req, res) {
    const { loggedInUser } = req
    const { msg } = req.body

    try {
        const msgToSave = await msgService.add(msg, loggedInUser)
        res.send(msgToSave)
    } catch (err) {
        logger.error(`Cannot add a msg`, err)
        res.status(400).send(`Cannot add a msg`)
    }
}

export async function updateMessage(req, res) {
    const { loggedInUser } = req
    const { msg } = req.body
    console.log(msg)
    try {
        await msgService.update(msg, loggedInUser)
        res.send('updated')
    } catch (err) {
        if (err instanceof UnauthorizedError) {
            logger.error(`Failed update msg ${msg._id}: ${err.message}`)
            res.status(403).send(`Failed update msg: ${err.message}`)
        } else {
            logger.error(`Failed update msg ${msg._id}`, err)
            res.status(500).send(`Failed update msg: ${err.message}`)
        }
    }
}

export async function removeMessage(req, res) {
    const { msgId } = req.params
    try {
        await msgService.remove(msgId)
        res.send('deleted')
    } catch (err) {
        if (err instanceof UnauthorizedError) {
            logger.error(`Failed remove msg ${msgId}: ${err.message}`)
            res.status(err.statusCode).send(`Failed remove msg: ${err.message}`)
        } else {
            logger.error(`Failed remove msg ${msgId}`, err)
            res.status(500).send(`Failed remove msg: ${err.message}`)
        }
    }
}
