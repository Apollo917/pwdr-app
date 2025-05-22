import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';

import { generatePwd } from 'pwdr';

import { useErrorHandler } from 'Hooks/useHandleError';
import { EditPhrase, Phrase, RemovePhrase, usePhrases } from 'Hooks/usePhrases';
import { CreateVaultPage, UnlockVaultPage } from 'Pages/VaultPages';
import { PASSWORD } from "Utils/constants";
import { DefaultContextProvider } from 'Utils/types';
import { decode, encode, stubMethod } from 'Utils/utils';

import { Encrypted, KeyTimeComplexity, useCrypto } from './useCrypto';
import { useStorage } from './useStrorage';

// Types

export type VaultState = 'unlocked' | 'locked' | 'not_created';
export type RestoreVaultFromBackup = () => Promise<void>;
export type FetchVault = () => Promise<Vault | undefined>;
export type CreateVault = (pin: string) => Promise<void>;
export type DestroyVault = () => Promise<void>;
export type UnlockVault = (pin: string) => Promise<void>;
export type LockVault = () => void;
export type GeneratePassword = (encrypted: Encrypted, phraseKey: string, length: number) => Promise<string>;
export type PutPhrase = (label: string, phrase: string) => Promise<Phrase>;
export type ChangePin = (oldPin: string, newPin: string, keyComplexity?: KeyTimeComplexity) => Promise<void>;
type GenerateVault = (pin: string, keyComplexity: KeyTimeComplexity) => Promise<Vault>;
type SaveVault = (vault: Vault) => Promise<void>;
type ValidatePin = (pin: string, vault: Vault) => Promise<CryptoKey>;
type BackupVault = (backup: VaultBackup) => Promise<void>;
type FetchVaultBackup = () => Promise<VaultBackup>;
type RemoveVaultBackup = () => Promise<void>;
type CleanUpVaultAndPhrases = () => Promise<void>;
type EncryptPhrase = (key: CryptoKey, label: string, phrase: string) => Promise<Phrase>;
type SetVaultState = (vaultState: VaultState) => void;
type SetKey = (key: CryptoKey) => void;
type SetKeyComplexity = (complexity: KeyTimeComplexity) => void;
type ResetKey = () => void;

interface Vault {
  id: string;
  salt: string;
  lock: Encrypted;
  keyComplexity: KeyTimeComplexity;
}

interface VaultContext {
  vaultState: VaultState | null;
  key: CryptoKey | null;
  keyComplexity: KeyTimeComplexity | null;
  setVaultState: SetVaultState;
  setKey: SetKey;
  setKeyComplexity: SetKeyComplexity;
  resetKey: ResetKey;
}

export interface UseVault {
  vaultState: VaultState | null;
  keyComplexity: KeyTimeComplexity | null;
  restoreVaultFromBackup: RestoreVaultFromBackup;
  fetchVault: FetchVault;
  destroyVault: DestroyVault;
  createVault: CreateVault;
  unlockVault: UnlockVault;
  lockVault: LockVault;
  generatePassword: GeneratePassword;
  putPhrase: PutPhrase;
  editPhrase: EditPhrase;
  removePhrase: RemovePhrase;
  changePin: ChangePin;
  VaultContextProvider: DefaultContextProvider;
}

interface DecryptedPhrase {
  phrase: Phrase;
  rawPhrase: string;
}

interface VaultBackup {
  reason: string;
  vault: Vault;
  phrases: Phrase[];
}

// Errors

export class VaultError extends Error {
}

export class InvalidVaultStateError extends VaultError {
}

export class InvalidPinError extends VaultError {
}

export class PhraseDuplicationError extends VaultError {
}

// Constants

const VAULT_STORAGE_KEY = 'v';
const VAULT_BACKUP_STORAGE_KEY = 'bak';
const SIGNATURE = 'signature';
const DEFAULT_KEY_TIME_COMPLEXITY: KeyTimeComplexity = 'balanced';
const DEFAULT_CONTEXT_VALUE: VaultContext = {
  vaultState: null,
  key: null,
  keyComplexity: null,
  setVaultState: stubMethod,
  setKey: stubMethod,
  setKeyComplexity: stubMethod,
  resetKey: stubMethod
};

// Contexts

const VaultContext = createContext<VaultContext>(DEFAULT_CONTEXT_VALUE);
VaultContext.displayName = 'VaultContext';

// Components

const VaultContextProvider: DefaultContextProvider = ({ children }) => {
  const [vaultState, setVaultState] = useState<VaultState | null>(null);
  const [key, setKey] = useState<CryptoKey | null>(null);
  const [keyComplexity, setKeyComplexity] = useState<KeyTimeComplexity | null>(null);
  const { restoreVaultFromBackup, fetchVault } = useVault();
  const { handleError } = useErrorHandler();


  useEffect(() => {
    restoreVaultFromBackup()
        .then(fetchVault)
        .then(v => v ? 'locked' : 'not_created')
        .then(setVaultState)
        .catch(handleError);
  }, [fetchVault, handleError, restoreVaultFromBackup]);

  const resetKey: ResetKey = useCallback(() => {
    setKey(null);
    setKeyComplexity(null);
  }, []);

  const value = useMemo(() => {
    return { vaultState, setVaultState, key, setKey, keyComplexity, setKeyComplexity, resetKey };
  }, [vaultState, key, keyComplexity, resetKey]);

  const renderContent = useCallback(() => {
    if (vaultState === 'not_created') return (<CreateVaultPage/>);
    if (!vaultState || vaultState === 'locked') return (<UnlockVaultPage/>);
    return <>{children}</>;
  }, [vaultState, children]);

  return (
      <VaultContext value={value}>
        {renderContent()}
      </VaultContext>
  );
};

// Hooks

export const useVault = (): UseVault => {
  const { vaultState, setVaultState, key, setKey, keyComplexity, setKeyComplexity, resetKey } = use(VaultContext);
  const { generateId, generateSalt, generateKey, encrypt, decrypt } = useCrypto();
  const { getItems, saveItems, removeItems } = useStorage();
  const { phrases, savePhrase, savePhrases, editPhrase, removePhrase, removeAllPhrases } = usePhrases();


  const generateVault: GenerateVault = useCallback(async (pin, keyComplexity) => {
    const id = generateId();
    const salt = generateSalt();
    const key = await generateKey(encode(pin), salt, keyComplexity);
    const lock = await encrypt(key, encode(id));

    return { id, salt, lock, keyComplexity };
  }, [encrypt, generateId, generateKey, generateSalt]);

  const saveVault: SaveVault = useCallback(async (vault) => {
    await saveItems({ [VAULT_STORAGE_KEY]: vault });
  }, [saveItems]);

  const validatePin: ValidatePin = useCallback(async (pin, vault) => {
    const lock = vault.id;
    const key = await generateKey(encode(pin), vault.salt, vault.keyComplexity);
    const decryptedLock = decode(await decrypt(key, vault.lock).catch(() => encode('invalid-pin')));

    if (lock !== decryptedLock) {
      throw new InvalidPinError();
    }

    return key;
  }, [decrypt, generateKey]);

  const backupVault: BackupVault = useCallback(async (backup) => {
    await saveItems({ [VAULT_BACKUP_STORAGE_KEY]: backup });
  }, [saveItems]);

  const fetchVaultBackup: FetchVaultBackup = useCallback(async () => {
    const items = await getItems([VAULT_BACKUP_STORAGE_KEY]);
    return items[VAULT_BACKUP_STORAGE_KEY] as VaultBackup;
  }, [getItems]);

  const removeVaultBackup: RemoveVaultBackup = useCallback(async () => {
    await removeItems([VAULT_BACKUP_STORAGE_KEY]);
  }, [removeItems]);

  const cleanUpVaultAndPhrases: CleanUpVaultAndPhrases = useCallback(async () => {
    await removeItems([VAULT_STORAGE_KEY]);
    await removeAllPhrases();
  }, [removeAllPhrases, removeItems]);

  const encryptPhrase: EncryptPhrase = useCallback(async (key, label, phrase) => {
    const encryptedPhrase = await encrypt(key, encode(phrase));
    const signature = decode(await generatePwd(encode(phrase), encode(SIGNATURE), { length: PASSWORD.maxLength }));

    return {
      label,
      signature,
      phrase: encryptedPhrase,
    };
  }, [encrypt]);

  const restoreVaultFromBackup: RestoreVaultFromBackup = useCallback(async () => {
    const backup = await fetchVaultBackup();

    if (!backup) return;

    await cleanUpVaultAndPhrases();
    await saveVault(backup.vault);
    await savePhrases(backup.phrases);
    await removeVaultBackup();
  }, [cleanUpVaultAndPhrases, fetchVaultBackup, removeVaultBackup, savePhrases, saveVault]);

  const fetchVault: FetchVault = useCallback(async () => {
    const items = await getItems([VAULT_STORAGE_KEY]);
    return items[VAULT_STORAGE_KEY] as Vault;
  }, [getItems]);

  const createVault: CreateVault = useCallback(async (pin) => {
    const vault = await generateVault(pin, DEFAULT_KEY_TIME_COMPLEXITY);
    await saveVault(vault);
    setVaultState('locked');
  }, [generateVault, saveVault, setVaultState]);

  const destroyVault: DestroyVault = useCallback(async () => {
    await cleanUpVaultAndPhrases();
    setVaultState('not_created');
  }, [cleanUpVaultAndPhrases, setVaultState]);

  const unlockVault: UnlockVault = useCallback(async (pin) => {
    const vault = await fetchVault();

    if (!vault) return;

    const key = await validatePin(pin, vault);
    const complexity = vault.keyComplexity;

    setKey(key);
    setKeyComplexity(complexity);
    setVaultState('unlocked');
  }, [fetchVault, validatePin, setKey, setKeyComplexity, setVaultState]);

  const lockVault: LockVault = useCallback(() => {
    resetKey();
    setVaultState('locked');
  }, [resetKey, setVaultState]);

  const generatePassword: GeneratePassword = useCallback(async (encrypted, phraseKey, length) => {
    if (!key) {
      throw new InvalidVaultStateError("Vault key is not set.");
    }

    const phrase = await decrypt(key, encrypted);
    const pwd = await generatePwd(phrase, encode(phraseKey), { length });

    return decode(pwd);
  }, [key, decrypt]);

  const putPhrase: PutPhrase = useCallback(async (label, phrase) => {
    if (!key) {
      throw new InvalidVaultStateError("Vault key is not set.");
    }

    const encryptedPhrase = await encryptPhrase(key, label, phrase);

    if (phrases.find(p => p.signature === encryptedPhrase.signature)) {
      throw new PhraseDuplicationError();
    }

    return await savePhrase(encryptedPhrase);
  }, [encryptPhrase, key, phrases, savePhrase]);

  const changePin: ChangePin = useCallback(async (oldPin, newPin, keyComplexity) => {
    // 0. Fetch vault
    const oldVault = await fetchVault();

    if (!oldVault) {
      throw new InvalidVaultStateError("Vault does not exist.");
    }

    // 1. Validate PIN
    const oldKey = await validatePin(oldPin, oldVault);

    // 2. Decrypt phrases
    const decryptedPhrases: DecryptedPhrase[] = await Promise.all(
        phrases.map(p => new Promise<DecryptedPhrase>((resolve, reject) => {
          decrypt(oldKey, p.phrase).then(raw => resolve({
            phrase: p,
            rawPhrase: decode(raw),
          })).catch(reject)
        }))
    );

    // 3. Generate new Vault
    const newVault = await generateVault(newPin, keyComplexity ?? oldVault.keyComplexity);

    // 4. Generate new key
    const newKey = await validatePin(newPin, newVault);

    // 5. Encrypt phrases with new key
    const reEncryptedPhrases: Phrase[] = await Promise.all(
        decryptedPhrases.map(p => new Promise<Phrase>((resolve, reject) => {
          encryptPhrase(newKey, p.phrase.label, p.rawPhrase).then(resolve).catch(reject);
        }))
    );

    // 6. Backup new Vault and phrases
    const reason = oldPin === newPin ? 'Key complexity change' : 'PIN change';
    await backupVault({ vault: oldVault, phrases, reason });

    // 7. Remove all old phrases and vault
    await cleanUpVaultAndPhrases();

    // 8. Save new vault
    await saveVault(newVault);

    // 9. Save new phrases
    await savePhrases(reEncryptedPhrases);

    // 10. Set new key
    setKey(newKey);
    setKeyComplexity(newVault.keyComplexity);

    // 11. Remove backup
    await removeVaultBackup();

  }, [
    backupVault, cleanUpVaultAndPhrases, decrypt, encryptPhrase, fetchVault, generateVault, phrases,
    removeVaultBackup, savePhrases, saveVault, setKey, setKeyComplexity, validatePin
  ]);


  return {
    vaultState,
    keyComplexity,
    restoreVaultFromBackup,
    fetchVault,
    createVault,
    unlockVault,
    lockVault,
    generatePassword,
    putPhrase,
    editPhrase,
    removePhrase,
    destroyVault,
    changePin,
    VaultContextProvider,
  };
};
