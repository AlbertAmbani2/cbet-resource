import { Request, Response } from 'express'
import { query } from '../db'
import { validatePassword } from '../passwordHelper'
import { ApiError } from '../types'

/**
 * POST /api/trainers/signin
 * Authenticate trainer with email and password
 */
export async function signin(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body as { email?: string; password?: string }

    // Validate input
    if (!email || typeof email !== 'string') {
      const error: ApiError = { error: 'Email is required' }
      res.status(400).json(error)
      return
    }

    if (!password || typeof password !== 'string') {
      const error: ApiError = { error: 'Password is required' }
      res.status(400).json(error)
      return
    }

    // Find trainer by email
    const result = await query(
      'SELECT id, email, password, full_name, department, created_at, is_verified FROM trainers WHERE email = $1',
      [email.toLowerCase()]
    )

    if (result.rows.length === 0) {
      const error: ApiError = { error: 'Email or password is incorrect' }
      res.status(401).json(error)
      return
    }

    const trainer = result.rows[0]

    // Validate password
    const isPasswordValid = await validatePassword(password, trainer.password)
    if (!isPasswordValid) {
      const error: ApiError = { error: 'Email or password is incorrect' }
      res.status(401).json(error)
      return
    }

    // Check if verified (for future use)
    // if (!trainer.is_verified) {
    //   const error: ApiError = { error: 'Please verify your email first' }
    //   res.status(403).json(error)
    //   return
    // }

    // Success: Return trainer data (no password)
    res.status(200).json({
      id: trainer.id,
      email: trainer.email,
      fullName: trainer.full_name,
      department: trainer.department,
      createdAt: trainer.created_at,
      isVerified: trainer.is_verified
    })
  } catch (error) {
    console.error('[Controller] Signin error:', error)
    const err: ApiError = {
      error: 'Failed to sign in',
      details: error instanceof Error ? error.message : 'Unknown error'
    }
    res.status(500).json(err)
  }
}
