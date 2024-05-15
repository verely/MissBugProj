import express from 'express'
import { requireAuth, requireAdmin } from '../../middlewares/requireAuth.middleware.js'
import { addBug, getBug, getBugs, removeBug, updateBug } from './bug.controller.js'

const router = express.Router()

router.use(requireAuth)

router.get('/', getBugs)
router.get('/:bugId', getBug)
router.post('/', requireAuth, addBug)
router.put('/:bugId', requireAuth, updateBug)
router.delete('/:bugId', requireAuth, removeBug)


export const bugRoutes = router
