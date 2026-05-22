/**
 * VYVRE — API key generation
 *
 * Format: vyv_pk_[32 hex chars]
 * Prefix `vyv_pk_` to avoid collision with Stripe's `pk_live_` / `pk_test_`.
 *
 * 32 hex chars = 128 bits of entropy. Sufficient for public-facing identifiers
 * (the API key is meant to be embedded in client HTML, so it's not a secret —
 * it identifies the brand and we rate-limit + validate on the backend).
 */

import { randomBytes } from 'node:crypto';

const API_KEY_PREFIX = 'vyv_pk_';
const API_KEY_BYTES = 16; // 16 bytes = 32 hex chars

export function generateApiKey(): string {
  const random = randomBytes(API_KEY_BYTES).toString('hex');
  return `${API_KEY_PREFIX}${random}`;
}

export function isValidApiKey(key: string): boolean {
  if (typeof key !== 'string') return false;
  if (!key.startsWith(API_KEY_PREFIX)) return false;
  const hex = key.slice(API_KEY_PREFIX.length);
  return /^[a-f0-9]{32}$/.test(hex);
}
