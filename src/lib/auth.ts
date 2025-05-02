
'use client'; // Mark functions potentially using client-side APIs

import * as bip39 from 'bip39';

// Function to safely access localStorage
const safeLocalStorage = {
  getItem: (key: string): string | null => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(key);
    }
    return null;
  },
  setItem: (key: string, value: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(key, value);
    } else {
      console.warn(`localStorage is not available. Cannot set item: ${key}`);
    }
  },
  removeItem: (key: string): void => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(key);
    } else {
      console.warn(`localStorage is not available. Cannot remove item: ${key}`);
    }
  }
};


const SEED_PHRASE_KEY = 'thredx_seed_phrase';

/**
 * Generates a cryptographically secure 12-word BIP39 mnemonic seed phrase.
 * Uses window.crypto for better randomness in browser environments.
 * IMPORTANT: This should only be called on the client-side.
 * @returns {string} A 12-word seed phrase.
 */
export function generateSeedPhrase(): string {
  if (typeof window === 'undefined' || !window.crypto || !window.crypto.getRandomValues) {
      console.error("Secure random number generator not available. Falling back to less secure method. DO NOT use this for production keys.");
       // Fallback for environments without window.crypto (like older SSR or specific runtimes)
       // WARNING: This fallback using Math.random is NOT cryptographically secure.
      const fallbackRandomBytes = new Uint8Array(16);
      for (let i = 0; i < 16; i++) {
          fallbackRandomBytes[i] = Math.floor(Math.random() * 256);
      }
      return bip39.entropyToMnemonic(Buffer.from(fallbackRandomBytes).toString('hex'));
  }
  const randomBytes = new Uint8Array(16); // 128 bits for a 12-word phrase
  window.crypto.getRandomValues(randomBytes);
  const entropy = Buffer.from(randomBytes).toString('hex');
  return bip39.entropyToMnemonic(entropy);
}


/**
 * Validates a given seed phrase.
 * @param {string} seedPhrase - The seed phrase to validate.
 * @returns {boolean} True if the seed phrase is valid, false otherwise.
 */
export function validateSeedPhrase(seedPhrase: string): boolean {
  try {
    return bip39.validateMnemonic(seedPhrase);
  } catch (error) {
    console.error('Error validating seed phrase:', error);
    return false;
  }
}

/**
 * Stores the seed phrase securely in localStorage.
 * IMPORTANT: This should only be called on the client-side.
 * @param {string} seedPhrase - The seed phrase to store.
 */
export function storeSeedPhrase(seedPhrase: string): void {
  // Basic validation before storing
  if (validateSeedPhrase(seedPhrase)) {
     safeLocalStorage.setItem(SEED_PHRASE_KEY, seedPhrase); // Use safe wrapper
     console.log('Seed phrase stored.'); // Keep for debugging, consider removing for prod
  } else {
     console.error('Attempted to store an invalid seed phrase.');
     // Optionally throw an error or handle it based on application needs
     // throw new Error('Invalid seed phrase provided for storage.');
  }
}


/**
 * Retrieves the stored seed phrase from localStorage.
 * IMPORTANT: This should only be called on the client-side.
 * @returns {string | null} The stored seed phrase, or null if not found or invalid.
 */
export function getSeedPhrase(): string | null {
  const storedSeed = safeLocalStorage.getItem(SEED_PHRASE_KEY); // Use safe wrapper
  if (storedSeed && validateSeedPhrase(storedSeed)) {
      return storedSeed;
  }
  if (storedSeed) {
      // If something is stored but invalid, log it and remove it for safety.
      console.warn('Invalid seed phrase found in storage. Removing it.');
      safeLocalStorage.removeItem(SEED_PHRASE_KEY);
  }
  return null;
}

/**
 * Checks if a seed phrase exists in storage.
 * IMPORTANT: This should only be called on the client-side.
 * @returns {boolean} True if a valid seed phrase is stored, false otherwise.
 */
export function hasStoredSeedPhrase(): boolean {
    return !!getSeedPhrase(); // Relies on getSeedPhrase's validation logic
}


/**
 * Logs the user out by removing the seed phrase from localStorage.
 * IMPORTANT: This should only be called on the client-side.
 */
export function logout(): void {
  safeLocalStorage.removeItem(SEED_PHRASE_KEY); // Use safe wrapper
  console.log('User logged out.'); // Keep for debugging
  // Potentially add redirection logic here or handle it in the calling component
}

/**
 * Verifies a provided seed phrase against the one stored in localStorage.
 * WARNING: This is a basic comparison and NOT a cryptographically secure verification method.
 * It's primarily for client-side checks before attempting more secure operations.
 * IMPORTANT: This should only be called on the client-side.
 * @param {string} providedSeedPhrase - The seed phrase provided by the user.
 * @returns {boolean} True if the provided phrase matches the stored one, false otherwise.
 */
export function verifySeedPhraseLocally(providedSeedPhrase: string): boolean {
   const storedSeed = getSeedPhrase();
   // Ensure both are valid before comparing, though getSeedPhrase already validates.
   if (storedSeed && validateSeedPhrase(providedSeedPhrase)) {
       return storedSeed === providedSeedPhrase;
   }
   return false;
}
