import { useCallback } from 'react';

import { erase } from 'pwdr';

// Types

export type KeyTimeComplexity = 'fast' | 'balanced' | 'strong' | 'paranoid';

export interface Encrypted {
  data: string;
  iv: string;
}

type ToBase64String = (arr: Uint8Array | ArrayBuffer) => string;
type Base64StringToUint8Array = (str: string) => Uint8Array;
type GenerateRandomUint8Array = (size: number) => Uint8Array;
type GenerateId = () => string;
type GenerateSalt = () => string;
type GenerateKey = (pin: Uint8Array, salt: string, complexity: KeyTimeComplexity) => Promise<CryptoKey>;
type Encrypt = (key: CryptoKey, data: Uint8Array) => Promise<Encrypted>;
type Decrypt = (key: CryptoKey, encrypted: Encrypted) => Promise<Uint8Array>;

export interface UseCrypto {
  toBase64String: ToBase64String;
  base64StringToUint8Array: Base64StringToUint8Array;
  generateRandomUint8Array: GenerateRandomUint8Array;
  generateId: GenerateId;
  generateSalt: GenerateSalt;
  generateKey: GenerateKey;
  encrypt: Encrypt;
  decrypt: Decrypt;
}

// Constants

const ENCRYPTION_ALGORITHM = 'AES-GCM';

const COMPLEXITY_LEVELS: Record<KeyTimeComplexity, number> = {
  fast: 250_000,
  balanced: 500_000,
  strong: 1_000_000,
  paranoid: 5_000_000
}

// Hooks

export const useCrypto = (): UseCrypto => {

  const toBase64String: ToBase64String = useCallback((arr) => {
    return btoa(String.fromCharCode(...(arr instanceof ArrayBuffer) ? new Uint8Array(arr) : arr));
  }, []);

  const base64StringToUint8Array: Base64StringToUint8Array = useCallback((str) => {
    return new Uint8Array(atob(str).split('').map((c) => c.charCodeAt(0)));
  }, []);

  const generateRandomUint8Array: GenerateRandomUint8Array = useCallback((size) => {
    return crypto.getRandomValues(new Uint8Array(size));
  }, []);

  const generateId: GenerateId = useCallback(() => {
    return crypto.randomUUID().replace(/-/g, '');
  }, []);

  const generateSalt: GenerateSalt = useCallback(() => {
    return toBase64String(generateRandomUint8Array(16));
  }, [toBase64String, generateRandomUint8Array]);

  const generateKey: GenerateKey = useCallback(async (pin, salt, complexity) => {
    const derivationAlgo = 'PBKDF2';
    const baseKey = await crypto.subtle.importKey('raw', pin, { name: derivationAlgo }, false, ['deriveKey']);
    erase(pin);
    return crypto.subtle.deriveKey(
        {
          name: derivationAlgo,
          salt: base64StringToUint8Array(salt),
          iterations: COMPLEXITY_LEVELS[complexity],
          hash: 'SHA-512',
        },
        baseKey,
        { name: ENCRYPTION_ALGORITHM, length: 256 },
        true,
        ['encrypt', 'decrypt'],
    );
  }, [base64StringToUint8Array]);

  const encrypt: Encrypt = useCallback(async (key, data) => {
    const iv = generateRandomUint8Array(16);
    const encrypted = await crypto.subtle.encrypt({ name: ENCRYPTION_ALGORITHM, iv }, key, data);

    return { data: toBase64String(encrypted), iv: toBase64String(iv) } as Encrypted;
  }, [generateRandomUint8Array, toBase64String]);

  const decrypt: Decrypt = useCallback(async (key: CryptoKey, encrypted: Encrypted) => {
    const iv = base64StringToUint8Array(encrypted.iv);
    const data = base64StringToUint8Array(encrypted.data);

    return await crypto.subtle.decrypt({ name: ENCRYPTION_ALGORITHM, iv }, key, data)
        .then(data => new Uint8Array(data));
  }, [base64StringToUint8Array]);

  return {
    toBase64String,
    base64StringToUint8Array,
    generateRandomUint8Array,
    generateId,
    generateSalt,
    generateKey,
    encrypt,
    decrypt,
  };
};