import 'dotenv/config'
import express from 'express'
import cookieParser from 'cookie-parser'
import cors from 'cors'

import { logger } from './services/logger.service.js'

const app = express()

const corsOptions = {
    origin: [
        'http://127.0.0.1:5173',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3030',
        'http://localhost:5173',
        'http://localhost:3000',
        'http://localhost:3030'
    ],
    credentials: true
}

// Express Config:
app.use(express.static('public'))
app.use(cookieParser())
app.use(cors(corsOptions))
app.use(express.json())

import { bugRoutes } from './api/bug/bug.routes.js'
app.use('/api/bug', bugRoutes)

import { userRoutes } from './api/user/user.routes.js'
app.use('/api/user', userRoutes)

import { authRoutes } from './api/auth/auth.routes.js'
app.use('/api/auth', authRoutes)

// const port = 3030
const port = process.env.PORT || 3000
app.get('/', (req, res) => res.send('Hello there'))
app.listen(port, () =>
    logger.info(`Server listening on port ${port}`)
)
