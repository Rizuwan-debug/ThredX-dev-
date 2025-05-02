
'use client'; // Mark functions potentially using client-side APIs

import * as bip39 from 'bip39';
import { Buffer } from 'buffer'; // Ensure Buffer is imported explicitly

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
    // Ensure entropy bits are a multiple of 32 and between 128-256 for bip39
    const ENTROPY_BITS = 128; // 128 is valid (results in 12 words)
    const ENTROPY_BYTES = ENTROPY_BITS / 8; // 16 bytes

    let mnemonic: string;
    let words: string[];

    try {
        if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
            const randomBytes = new Uint8Array(ENTROPY_BYTES);
            window.crypto.getRandomValues(randomBytes);
            // Pass Buffer directly to entropyToMnemonic
            mnemonic = bip39.entropyToMnemonic(Buffer.from(randomBytes));
        } else {
            console.error("Secure random number generator not available. Falling back to less secure method. DO NOT use this for production keys.");
            // Fallback for environments without window.crypto (like older SSR or specific runtimes)
            // WARNING: This fallback using Math.random is NOT cryptographically secure and might still cause issues.
            const fallbackRandomBytes = new Uint8Array(ENTROPY_BYTES);
            for (let i = 0; i < ENTROPY_BYTES; i++) {
                fallbackRandomBytes[i] = Math.floor(Math.random() * 256);
            }
             // Pass Buffer directly to entropyToMnemonic
            mnemonic = bip39.entropyToMnemonic(Buffer.from(fallbackRandomBytes));
        }

        words = mnemonic.split(' ');

        // BIP39 word count depends strictly on entropy bits (128->12, 160->15 etc.).
        // Check if we got the expected number of words for the entropy used.
        const expectedWordCount = bip39.wordlists.english.length * (ENTROPY_BITS / 11); // This isn't quite right, word count is fixed for entropy length
        // For 128 bits, it should always be 12 words.
        if (words.length !== 12) {
             console.error(`Generated mnemonic has unexpected word count: ${words.length}. Expected 12 for 128 bits.`);
             // Throw an error or retry, as this indicates a problem with bip39 or the entropy.
             throw new Error("Mnemonic generation failed: incorrect word count.");
        }

    } catch (error) {
        console.error("Error during mnemonic generation:", error);
        // Attempt to recover or inform the user
        // For now, rethrow or return a default/error state might be needed
        // Rethrowing to make the issue visible
        throw new Error(`Seed phrase generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }


    // Take the first 5 words
    const fiveWordPhrase = words.slice(0, WORD_COUNT_TARGET).join(' ');

    // Basic check to prevent empty phrase return
    if (!fiveWordPhrase) {
         console.error("Generated phrase is empty after slicing. This should not happen.");
         // Throw an error as this is unexpected
         throw new Error("Generated phrase is empty.");
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
  const wordlist = bip39.wordlists.english;
  if (!words.every(word => wordlist.includes(word))) {
      console.warn("Validation failed: Phrase contains words not in the standard list.");
      // Consider if this strict check is desired for the 5-word derived phrase
      // return false;
  }
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
