import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { loggerService } from './services/logger.service.js'
import { bugService } from './services/bug.service.js'

const app = express()

const corsOptions = {
    origin: [
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://localhost:5173',
        'http://localhost:3000'
    ],
    credentials: true
}

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(cors(corsOptions))


app.get('/api/bug', async (req, res) => {
    try {
        const bugs = await bugService.query()
        //console.log('/api/bug', bugs)
        res.send(bugs)
    } catch (error) {
        loggerService.error(`Cannot get bugs`, error)
        res.status(400).send(`Cannot get bugs`)
    }
})

app.get('/api/bug/save', async (req, res) => {
    try {
        let bugToSave = {
            "_id" : req.query._id,
            "title" : req.query.title,
            "severity" : +req.query.severity,
            "createdAt" : Date.now()
        }
        bugToSave = await bugService.save(bugToSave)
        res.send(bugToSave)
    } catch (error) {
        loggerService.error(`Cannot save a bug`, error)
        res.status(400).send(`Cannot save a bug`)
    }
})

app.get('/api/bug/:bugId', async (req, res) => {
    const bugId = req.params.bugId
    try {
        console.log('bugId:', bugId)
        const bug = await bugService.getById(bugId)
        console.log('bug:', bug)
        res.send(bug)
    } catch (error) {
        loggerService.error(`Cannot get a bug ${bugId}`, error)
        res.status(400).send(`Cannot get a bug ${bugId}`)
    }
})

app.get('/api/bug/:bugId/remove', async (req, res) => {
    const bugId = req.params.bugId
    try {
        await bugService.remove(bugId)
        res.send('deleted')
    } catch (error) {
        loggerService.error(`Cannot remove bug ${bugId}`, error)
        res.status(400).send(`Cannot remove bug`)
    }
})

const port = 3030
app.get('/', (req, res) => res.send('Hello there'))
app.listen(port, () =>
    loggerService.info(`Server listening on port http://127.0.0.1:${port}/`)
)
