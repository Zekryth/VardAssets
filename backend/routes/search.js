import { Router } from 'express'
import { search } from '../controllers/searchController.js'

const router = Router()

// Public search endpoint (no auth) to avoid redirect loops on unauthenticated users
router.get('/', search)

export default router
