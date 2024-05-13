import { logger } from '../services/logger.service.js'
import { authService } from '../api/auth/auth.service.js'

export async function requireAuth(req, res, next) {
    if (!req?.cookies?.loginToken) {
        return res.status(401).send('Not Authenticated')
    }

    const loggedInUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedInUser) return res.status(401).send('Not Authenticated')

    req.loggedInUser = loggedInUser
    next()
}

export async function requireAdmin(req, res, next) {
    if (!req?.cookies?.loginToken) {
        return res.status(401).send('Not Authenticated')
    }

    const loggedInUser = authService.validateToken(req.cookies.loginToken)
    if (!loggedInUser.isAdmin) {
        logger.warn(loggedInUser.fullname + 'attempted to perform admin action')
        res.status(403).end('Not Authorized')
        return
    }
    next()
}
