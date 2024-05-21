import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { addMessage, getMessage, getMessages, removeMessage, updateMessage } from './msg.controller.js'

const router = express.Router()

// router.use(requireAuth)

router.get('/', getMessages)
router.get('/:msgId', getMessage)
router.post('/', requireAuth, addMessage)
router.put('/:msgId', requireAuth, updateMessage)
router.delete('/:messageId', requireAdmin, removeMessage)


export const msgRoutes = router
