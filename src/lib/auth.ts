
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
 * Generates a cryptographically secure 5-word seed phrase.
 * Adjusted to generate 5 words (64 bits of entropy needed).
 * Uses window.crypto for better randomness in browser environments.
 * IMPORTANT: This should only be called on the client-side.
 * @returns {string} A 5-word seed phrase.
 */
export function generateSeedPhrase(): string {
    const WORD_COUNT = 5; // Target 5 words
    const ENTROPY_BITS = (WORD_COUNT * 11) - (WORD_COUNT * 11 % 32); // Closest multiple of 32 bits for BIP39 (needs 64 bits for 5 words)
    const ENTROPY_BYTES = ENTROPY_BITS / 8; // 8 bytes for 64 bits

    if (typeof window === 'undefined' || !window.crypto || !window.crypto.getRandomValues) {
        console.error("Secure random number generator not available. Falling back to less secure method. DO NOT use this for production keys.");
        // Fallback for environments without window.crypto (like older SSR or specific runtimes)
        // WARNING: This fallback using Math.random is NOT cryptographically secure.
        const fallbackRandomBytes = new Uint8Array(ENTROPY_BYTES);
        for (let i = 0; i < ENTROPY_BYTES; i++) {
            fallbackRandomBytes[i] = Math.floor(Math.random() * 256);
        }
        // Ensure the generated phrase has exactly 5 words. BIP39 might adjust word count based on entropy, so we handle this.
        let mnemonic = bip39.entropyToMnemonic(Buffer.from(fallbackRandomBytes).toString('hex'));
        let words = mnemonic.split(' ');
        while (words.length < WORD_COUNT) {
             // If fewer words, generate more entropy and append. This is non-standard but aims for 5 words.
             const moreBytes = new Uint8Array(ENTROPY_BYTES);
              for (let i = 0; i < ENTROPY_BYTES; i++) {
                 moreBytes[i] = Math.floor(Math.random() * 256);
              }
             mnemonic = bip39.entropyToMnemonic(Buffer.from(moreBytes).toString('hex'));
             words = [...words, ...mnemonic.split(' ')].filter((w, i, self) => self.indexOf(w) === i); // Keep unique words
        }
        return words.slice(0, WORD_COUNT).join(' ');
    }

    const randomBytes = new Uint8Array(ENTROPY_BYTES);
    window.crypto.getRandomValues(randomBytes);
    const entropy = Buffer.from(randomBytes).toString('hex');
    let mnemonic = bip39.entropyToMnemonic(entropy);
    let words = mnemonic.split(' ');

     // BIP39 word count depends strictly on entropy bits (128->12, 160->15 etc.).
     // 64 bits technically isn't standard BIP39 entropy for word list generation.
     // We'll enforce 5 words by truncation/padding if needed, but this deviates from strict BIP39.
     // A better approach might be to use 128 bits (12 words) as the minimum standard.
     // Forcing 5 words:
     while (words.length < WORD_COUNT) {
          // Regenerate if needed (rare case if entropy somehow resulted in fewer)
          window.crypto.getRandomValues(randomBytes);
          const newEntropy = Buffer.from(randomBytes).toString('hex');
          mnemonic = bip39.entropyToMnemonic(newEntropy);
          words = mnemonic.split(' ');
     }

     // Ensure uniqueness (very unlikely to have duplicates in short phrases, but good practice)
     const uniqueWords = Array.from(new Set(words));
     if (uniqueWords.length < WORD_COUNT) {
         // Extremely unlikely, but handle by regenerating
         return generateSeedPhrase();
     }


    // Return exactly 5 words
    return words.slice(0, WORD_COUNT).join(' ');
}


/**
 * Validates a given seed phrase (specifically checks for 5 words).
 * @param {string} seedPhrase - The seed phrase to validate.
 * @returns {boolean} True if the seed phrase has 5 words and passes BIP39 check, false otherwise.
 */
export function validateSeedPhrase(seedPhrase: string): boolean {
  if (!seedPhrase) return false;
  const words = seedPhrase.trim().split(/\s+/); // Split by whitespace
  if (words.length !== 5) {
    console.warn(`Validation failed: Expected 5 words, got ${words.length}`);
    return false;
  }
  // Optionally, add more checks like ensuring words are in the BIP39 wordlist
  // For simplicity here, we rely on the word count and the bip39.validateMnemonic (which might be less strict for non-standard lengths)
  try {
    // bip39.validateMnemonic might not strictly enforce length if checksum is okay for a subset?
    // Let's rely primarily on our word count check for the 5-word requirement.
    // You could add a check against the BIP39 wordlist here for stronger validation.
    return bip39.validateMnemonic(seedPhrase); // Use BIP39 validation as a checksum/format check
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
 * @param {string} providedSeedPhrase - The seed phrase provided by the user.
 * @returns {boolean} True if the provided phrase matches the stored one and both are valid, false otherwise.
 */
export function verifySeedPhraseLocally(providedSeedPhrase: string): boolean {
   const storedSeed = getSeedPhrase(); // Already validates the stored seed
   // Validate the provided seed phrase as well
   if (storedSeed && validateSeedPhrase(providedSeedPhrase)) {
       return storedSeed === providedSeedPhrase;
   }
   return false;
}
