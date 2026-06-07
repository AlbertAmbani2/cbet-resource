import { Router } from 'express'
import { trackDownload, getResourceAnalytics } from '../controllers/analyticsController.js'

const router = Router()

/**
 * Analytics Routes
 * POST /api/analytics/download - Track a resource download
 * GET /api/analytics/resources/:resourceId - Get resource analytics
 */

// Track download (public endpoint)
router.post('/download', trackDownload)

// Get resource analytics (public endpoint)
router.get('/resources/:resourceId', getResourceAnalytics)

export default router
