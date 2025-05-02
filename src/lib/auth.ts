
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


const SEED_PHRASE_KEY = 'thredx_seedPhrase';
const USERNAME_KEY = 'thredx_username'; // Key for storing username


/**
 * Generates a 5-word seed phrase derived from a standard 12-word BIP39 mnemonic.
 * Uses 128 bits of entropy (standard minimum) to generate 12 words, then takes the first 5.
 * Uses window.crypto for better randomness in browser environments.
 * IMPORTANT: This should only be called on the client-side.
 * @returns {string} A 5-word seed phrase.
 */
export function generateSeedPhrase(): string {
    const WORD_COUNT_TARGET = 5;
    const STANDARD_ENTROPY_BITS = 128; // Use standard 128 bits (generates 12 words)
    const ENTROPY_BYTES = STANDARD_ENTROPY_BITS / 8; // 16 bytes

    let mnemonic: string;

    if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
        const randomBytes = new Uint8Array(ENTROPY_BYTES);
        window.crypto.getRandomValues(randomBytes);
        const entropy = Buffer.from(randomBytes).toString('hex');
        mnemonic = bip39.entropyToMnemonic(entropy); // Generates 12 words
    } else {
        console.error("Secure random number generator not available. Falling back to less secure method. DO NOT use this for production keys.");
        // Fallback for environments without window.crypto (like older SSR or specific runtimes)
        // WARNING: This fallback using Math.random is NOT cryptographically secure.
        const fallbackRandomBytes = new Uint8Array(ENTROPY_BYTES);
        for (let i = 0; i < ENTROPY_BYTES; i++) {
            fallbackRandomBytes[i] = Math.floor(Math.random() * 256);
        }
        mnemonic = bip39.entropyToMnemonic(Buffer.from(fallbackRandomBytes).toString('hex')); // Generates 12 words
    }

    const words = mnemonic.split(' ');

    // Ensure we actually got 12 words (should always happen with 128 bits)
    if (words.length < WORD_COUNT_TARGET) {
        // This case is extremely unlikely with 128 bits but handle defensively
        console.error("Failed to generate sufficient words from entropy. Retrying.");
        return generateSeedPhrase(); // Retry generation
    }

    // Take the first 5 words
    const fiveWordPhrase = words.slice(0, WORD_COUNT_TARGET).join(' ');

    // Basic check to prevent empty phrase return
    if (!fiveWordPhrase) {
         console.error("Generated phrase is empty. Retrying.");
         return generateSeedPhrase(); // Retry generation
    }

    return fiveWordPhrase;
}


/**
 * Validates a given seed phrase (specifically checks for 5 words).
 * Does not perform BIP39 checksum validation as the 5-word phrase is derived.
 * @param {string} seedPhrase - The seed phrase to validate.
 * @returns {boolean} True if the seed phrase has 5 non-empty words, false otherwise.
 */
export function validateSeedPhrase(seedPhrase: string): boolean {
  if (!seedPhrase) return false;
  const words = seedPhrase.trim().split(/\s+/).filter(word => word.length > 0); // Split by whitespace and remove empty strings
  if (words.length !== 5) {
    console.warn(`Validation failed: Expected 5 words, got ${words.length}`);
    return false;
  }
  // Optionally, check if words are in the BIP39 english wordlist for better validation
  // const wordlist = bip39.wordlists.english;
  // if (!words.every(word => wordlist.includes(word))) {
  //     console.warn("Validation failed: Phrase contains words not in the standard list.");
  //     return false;
  // }
  return true; // Passes if it has 5 non-empty words
}

/**
 * Stores the seed phrase securely in localStorage.
 * IMPORTANT: This should only be called on the client-side.
 * @param {string} seedPhrase - The seed phrase to store.
 */
export function storeSeedPhrase(seedPhrase: string): void {
  // Use the updated validation logic
  if (validateSeedPhrase(seedPhrase)) {
     safeLocalStorage.setItem(SEED_PHRASE_KEY, seedPhrase.trim()); // Trim before storing
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
  // Use the updated validation logic
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
    // Relies on getSeedPhrase's updated validation logic
    return !!getSeedPhrase();
}


/**
 * Stores the username in localStorage.
 * @param {string} username - The username to store.
 */
export function storeUsername(username: string): void {
   if (username && username.trim().length > 0) {
      safeLocalStorage.setItem(USERNAME_KEY, username.trim());
      console.log('Username stored.');
   } else {
      console.warn('Attempted to store an empty username.');
   }
}

/**
 * Retrieves the stored username from localStorage.
 * @returns {string | null} The stored username, or null if not found.
 */
export function getUsername(): string | null {
    return safeLocalStorage.getItem(USERNAME_KEY);
}


/**
 * Logs the user out by removing the seed phrase and username from localStorage.
 * IMPORTANT: This should only be called on the client-side.
 */
export function logout(): void {
  safeLocalStorage.removeItem(SEED_PHRASE_KEY); // Use safe wrapper
  safeLocalStorage.removeItem(USERNAME_KEY); // Remove username on logout
  console.log('User logged out.'); // Keep for debugging
  // Potentially add redirection logic here or handle it in the calling component
}

/**
 * Verifies a provided seed phrase against the one stored in localStorage.
 * IMPORTANT: This should only be called on the client-side.
 * Performs simple string comparison after basic validation.
 * @param {string} providedSeedPhrase - The seed phrase provided by the user.
 * @returns {boolean} True if the provided phrase matches the stored one and both are valid (5 words), false otherwise.
 */
export function verifySeedPhraseLocally(providedSeedPhrase: string): boolean {
   const storedSeed = getSeedPhrase(); // Already validates the stored seed structure (5 words)

   // Validate the provided seed phrase structure (5 words)
   if (storedSeed && validateSeedPhrase(providedSeedPhrase)) {
       // Simple string comparison is sufficient now
       return storedSeed === providedSeedPhrase.trim();
   }
   return false;
}
