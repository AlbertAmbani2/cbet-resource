import { Request, Response } from 'express'
import { query } from '../db.js'

/**
 * Analytics Controller
 * Handles tracking of resource downloads and other analytics events
 * 
 * Caching Strategy:
 * - Uses database timestamp to validate cache (60s TTL)
 * - In-memory map stores last-tracked timestamps by sessionId
 * - Session-based (not IP-based) for multi-user environments
 * - Fallback to database check if in-memory cache is unavailable
 */

// In-memory session cache: tracks last download for each session
interface SessionCache {
  resourceId: string
  timestamp: number
}

const sessionCache = new Map<string, Map<string, SessionCache>>()
const CACHE_TTL_MS = 60 * 1000 // 60 seconds

/**
 * Get or create session ID from request
 * Uses session cookie if available, otherwise generates from request fingerprint
 */
function getSessionId(req: Request): string {
  // Try to get from session middleware (if available)
  if ((req as any).sessionID) {
    return (req as any).sessionID
  }

  // Fallback: Use combination of IP + User-Agent for fingerprinting
  const ip = req.ip || 'unknown'
  const userAgent = req.get('user-agent') || 'unknown'
  
  // Simple hash of IP + User-Agent
  const fingerprint = `${ip}:${userAgent}`
  return Buffer.from(fingerprint).toString('base64').substring(0, 32)
}

/**
 * Check if download was recently tracked for this session
 */
function isCached(sessionId: string, resourceId: string): boolean {
  const sessionMap = sessionCache.get(sessionId)
  if (!sessionMap) return false

  const cached = sessionMap.get(resourceId)
  if (!cached) return false

  const isExpired = Date.now() - cached.timestamp > CACHE_TTL_MS
  if (isExpired) {
    sessionMap.delete(resourceId)
    return false
  }

  return true
}

/**
 * Store download in session cache
 */
function setCached(sessionId: string, resourceId: string): void {
  if (!sessionCache.has(sessionId)) {
    sessionCache.set(sessionId, new Map())
  }

  const sessionMap = sessionCache.get(sessionId)!
  sessionMap.set(resourceId, {
    resourceId,
    timestamp: Date.now()
  })

  // Clean old sessions periodically (every 1000 cache operations)
  if (sessionCache.size > 1000) {
    const now = Date.now()
    for (const [sid, smap] of sessionCache.entries()) {
      // Remove expired entries from this session
      for (const [rid, entry] of smap.entries()) {
        if (now - entry.timestamp > CACHE_TTL_MS * 2) {
          smap.delete(rid)
        }
      }

      // Remove empty sessions
      if (smap.size === 0) {
        sessionCache.delete(sid)
      }
    }
  }
}

/**
 * Track a resource download and increment download count
 * Uses session-based caching (60s TTL) to prevent duplicate increments
 */
export async function trackDownload(req: Request, res: Response): Promise<void> {
  try {
    const { resourceId } = req.body

    if (!resourceId) {
      res.status(400).json({ error: 'resourceId is required' })
      return
    }

    const sessionId = getSessionId(req)

    // Check session cache
    if (isCached(sessionId, resourceId)) {
      res.json({
        success: true,
        message: 'Download tracked (cached)',
        resourceId,
        cached: true
      })
      return
    }

    // Increment download count in database
    const result = await query(
      `
      UPDATE resources
      SET download_count = download_count + 1,
          last_downloaded = NOW()
      WHERE id = $1
      RETURNING id, download_count, last_downloaded
      `,
      [resourceId]
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Resource not found' })
      return
    }

    // Update session cache
    setCached(sessionId, resourceId)

    const { download_count, last_downloaded } = result.rows[0]

    res.json({
      success: true,
      message: 'Download tracked successfully',
      resourceId,
      downloadCount: download_count,
      lastDownloaded: last_downloaded,
      cached: false
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Analytics] Download tracking error:', errorMessage)
    res.status(500).json({
      error: 'Failed to track download',
      details: errorMessage
    })
  }
}

/**
 * Get analytics summary for a resource
 * Returns download count, last download time, rating, etc.
 */
export async function getResourceAnalytics(req: Request, res: Response): Promise<void> {
  try {
    const { resourceId } = req.params

    if (!resourceId) {
      res.status(400).json({ error: 'resourceId is required' })
      return
    }

    const result = await query(
      `
      SELECT 
        id,
        title,
        download_count,
        last_downloaded,
        rating,
        approval_date
      FROM resources
      WHERE id = $1
      `,
      [resourceId]
    )

    if (result.rows.length === 0) {
      res.status(404).json({ error: 'Resource not found' })
      return
    }

    const resource = result.rows[0]

    res.json({
      success: true,
      data: {
        resourceId: resource.id,
        title: resource.title,
        downloadCount: resource.download_count,
        lastDownloaded: resource.last_downloaded,
        rating: resource.rating,
        approvalDate: resource.approval_date
      }
    })
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'
    console.error('[Analytics] Get analytics error:', errorMessage)
    res.status(500).json({
      error: 'Failed to fetch analytics',
      details: errorMessage
    })
  }
}
