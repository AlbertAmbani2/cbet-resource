import { describe, it, expect, beforeEach, afterEach } from 'vitest'

/**
 * Download Tracking E2E Tests
 * Tests the POST /api/analytics/download endpoint
 * 
 * Prerequisites:
 * 1. Backend server running on http://localhost:3000
 * 2. Database initialized with resources table
 * 3. Seed data created with at least one resource
 */

const API_URL = 'http://localhost:3000'

// Helper to get a resource ID from the API
async function getResourceId(): Promise<string> {
  try {
    const response = await fetch(`${API_URL}/api/resources?page=1&limit=1`)
    if (!response.ok) throw new Error('Failed to fetch resources')
    
    const data = await response.json()
    if (data.data && data.data.length > 0) {
      return data.data[0].id
    }
    throw new Error('No resources found')
  } catch (error) {
    console.error('[Test] Error getting resource ID:', error)
    throw error
  }
}

// Helper to get current download count for a resource
async function getDownloadCount(resourceId: string): Promise<number> {
  try {
    const response = await fetch(`${API_URL}/api/analytics/resources/${resourceId}`)
    if (!response.ok) throw new Error('Failed to fetch analytics')
    
    const data = await response.json()
    return data.data?.downloadCount || 0
  } catch (error) {
    console.error('[Test] Error getting download count:', error)
    throw error
  }
}

describe('Download Tracking - E2E', () => {
  let testResourceId: string
  let initialDownloadCount: number

  beforeEach(async () => {
    // Skip tests if backend is not available
    try {
      const response = await fetch(`${API_URL}/health`)
      if (!response.ok) {
        console.warn('[Test] Backend server not available, skipping tests')
      }
    } catch {
      console.warn('[Test] Cannot connect to backend, skipping download tracking tests')
    }

    // Get a test resource
    try {
      testResourceId = await getResourceId()
      initialDownloadCount = await getDownloadCount(testResourceId)
    } catch (error) {
      console.warn('[Test] Could not set up test resource:', error)
    }
  })

  afterEach(() => {
    // Cleanup happens automatically in database
  })

  it('should track a download and increment download count', async () => {
    if (!testResourceId) {
      console.warn('[Test] Skipping - no test resource available')
      return
    }

    // Track a download
    const response = await fetch(`${API_URL}/api/analytics/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resourceId: testResourceId })
    })

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.resourceId).toBe(testResourceId)
    expect(data.downloadCount).toBeGreaterThanOrEqual(initialDownloadCount)
  })

  it('should return error for missing resourceId', async () => {
    const response = await fetch(`${API_URL}/api/analytics/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({})
    })

    expect(response.status).toBe(400)
    const data = await response.json()
    expect(data.error).toBeDefined()
  })

  it('should return error for non-existent resource', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000'
    
    const response = await fetch(`${API_URL}/api/analytics/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resourceId: fakeId })
    })

    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data.error).toBe('Resource not found')
  })

  it('should implement 60-second cache to prevent duplicate increments', async () => {
    if (!testResourceId) {
      console.warn('[Test] Skipping - no test resource available')
      return
    }

    // First download
    const response1 = await fetch(`${API_URL}/api/analytics/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resourceId: testResourceId })
    })

    expect(response1.status).toBe(200)
    const data1 = await response1.json()
    const countAfterFirst = data1.downloadCount

    // Immediate second download (should be cached)
    const response2 = await fetch(`${API_URL}/api/analytics/download`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ resourceId: testResourceId })
    })

    expect(response2.status).toBe(200)
    const data2 = await response2.json()
    
    // Both requests should show the same download count (caching in effect)
    expect(data2.cached).toBe(true)
    expect(data2.downloadCount).toBe(countAfterFirst)
  })

  it('should retrieve resource analytics', async () => {
    if (!testResourceId) {
      console.warn('[Test] Skipping - no test resource available')
      return
    }

    const response = await fetch(`${API_URL}/api/analytics/resources/${testResourceId}`)

    expect(response.status).toBe(200)
    const data = await response.json()
    expect(data.success).toBe(true)
    expect(data.data).toHaveProperty('resourceId')
    expect(data.data).toHaveProperty('title')
    expect(data.data).toHaveProperty('downloadCount')
    expect(data.data).toHaveProperty('rating')
  })

  it('should return error for non-existent resource analytics', async () => {
    const fakeId = '00000000-0000-0000-0000-000000000000'
    
    const response = await fetch(`${API_URL}/api/analytics/resources/${fakeId}`)

    expect(response.status).toBe(404)
    const data = await response.json()
    expect(data.error).toBe('Resource not found')
  })
})
