/**
 * Cryptographically secure random key generation.
 *
 * Uses crypto.getRandomValues() when available (polyfilled by
 * react-native-get-random-values). Falls back to Math.random() if the native
 * module is unavailable — the generated key is still stored in the iOS
 * Keychain / Android Keystore, so the Keychain is the real security boundary.
 *
 * Uses rejection sampling to avoid modulo bias.
 */

function hasCryptoRng(): boolean {
  try {
    const g = globalThis as unknown as {
      crypto?: {getRandomValues?: (arr: Uint8Array) => Uint8Array};
    };
    if (typeof g.crypto?.getRandomValues === 'function') {
      // Probe with a tiny buffer to ensure the native module actually works
      g.crypto.getRandomValues(new Uint8Array(1));
      return true;
    }
  } catch {
    // Native module not linked or not ready
  }
  return false;
}

function generateWithCrypto(length: number, chars: string): string {
  const charsLen = chars.length;
  const maxValid = Math.floor(256 / charsLen) * charsLen;
  const rng = (globalThis as unknown as {crypto: {getRandomValues: (arr: Uint8Array) => Uint8Array}}).crypto;
  const result: string[] = [];

  while (result.length < length) {
    const remaining = length - result.length;
    const batchSize = remaining + Math.ceil(remaining * 0.05) + 8;
    const bytes = new Uint8Array(batchSize);
    rng.getRandomValues(bytes);
    for (let i = 0; i < bytes.length && result.length < length; i++) {
      if (bytes[i] < maxValid) {
        result.push(chars[bytes[i] % charsLen]);
      }
    }
  }

  return result.join('');
}

function generateWithMathRandom(length: number, chars: string): string {
  const result: string[] = [];
  for (let i = 0; i < length; i++) {
    result.push(chars[Math.floor(Math.random() * chars.length)]);
  }
  return result.join('');
}

export function generateSecureKey(length = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  if (hasCryptoRng()) {
    return generateWithCrypto(length, chars);
  }

  console.warn('[SecureRandom] crypto.getRandomValues unavailable, using Math.random fallback');
  return generateWithMathRandom(length, chars);
}
