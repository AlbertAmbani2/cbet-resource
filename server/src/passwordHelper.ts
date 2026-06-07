import bcrypt from 'bcryptjs';

const SALT_ROUNDS = 10;
const PASSWORD_MIN_LENGTH = 8;

/**
 * Hash a password with bcryptjs
 * @param password Plain text password
 * @returns Hashed password
 */
export async function hashPassword(password: string): Promise<string> {
  if (password.length < PASSWORD_MIN_LENGTH) {
    throw new Error(`Password must be at least ${PASSWORD_MIN_LENGTH} characters`);
  }
  return bcrypt.hash(password, SALT_ROUNDS);
}

/**
 * Validate a password against a hash
 * @param password Plain text password
 * @param hash Hashed password from database
 * @returns True if password matches
 */
export async function validatePassword(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

/**
 * Check if password meets minimum requirements
 * @param password Password to validate
 * @returns Error message if invalid, null if valid
 */
export function validatePasswordStrength(password: string): string | null {
  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    return `Password must be at least ${PASSWORD_MIN_LENGTH} characters`;
  }
  if (!/[a-z]/.test(password)) {
    return 'Password must contain lowercase letters';
  }
  if (!/[A-Z]/.test(password)) {
    return 'Password must contain uppercase letters';
  }
  if (!/[0-9]/.test(password)) {
    return 'Password must contain numbers';
  }
  return null;
}
