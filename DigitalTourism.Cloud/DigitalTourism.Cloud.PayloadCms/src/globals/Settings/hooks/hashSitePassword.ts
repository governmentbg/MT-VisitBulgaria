import crypto from 'node:crypto'
import type { FieldHook } from 'payload'

const HASH_SEPARATOR = ':'
const KEY_LENGTH = 64

/**
 * Field-level beforeChange hook for `sitePassword`.
 * Hashes the plaintext password, stores it in `sitePasswordHash`,
 * and clears the plaintext field so it is never persisted.
 */
export const hashSitePassword: FieldHook = ({ value, siblingData }) => {
  if (!value || typeof value !== 'string') {
    // No new password entered — keep the existing hash unchanged
    return undefined
  }

  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto.scryptSync(value, salt, KEY_LENGTH).toString('hex')
  siblingData.sitePasswordHash = `${salt}${HASH_SEPARATOR}${hash}`

  // Return undefined to clear the plaintext field (never persisted)
  return undefined
}

/**
 * Verify a plaintext password against a stored `salt:hash` string.
 */
export function verifySitePassword(plaintext: string, storedHash: string): boolean {
  const separatorIndex = storedHash.indexOf(HASH_SEPARATOR)
  if (separatorIndex === -1) return false

  const salt = storedHash.slice(0, separatorIndex)
  const hash = storedHash.slice(separatorIndex + 1)

  const derivedHash = crypto.scryptSync(plaintext, salt, KEY_LENGTH).toString('hex')

  return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(derivedHash, 'hex'))
}
