import { createContext, use, useCallback, useEffect, useMemo, useState } from 'react';

import { erase, generatePwd } from 'pwdr';

import { useErrorHandler } from 'Hooks/useHandleError';
import { EditPhrase, Phrase, RemovePhrase, usePhrases } from 'Hooks/usePhrases';
import { CreateVaultPage, UnlockVaultPage } from 'Pages/VaultPages';
import { DefaultContextProvider } from 'Utils/types';
import { decode, encode, stubMethod } from 'Utils/utils';

import { Encrypted, useCrypto } from './useCrypto';
import { useStorage } from './useStrorage';

// Types

export type VaultState = 'unlocked' | 'locked' | 'not_created' | 'none';
export type FetchVault = () => Promise<Vault | undefined>;
export type CreateVault = (pin: string) => Promise<void>;
export type UnlockVault = (pin: string) => Promise<void>;
export type LockVault = () => void;
export type GetPassword = (encrypted: Encrypted, phraseKey: string) => Promise<string>;
export type PutPhrase = (label: string, phrase: string) => Promise<Phrase>;
export type DestroyVault = () => Promise<void>;
type SetVaultState = (vaultState: VaultState) => void;
type SetKey = (key: CryptoKey | null) => void;

interface Vault {
  id: string;
  salt: string;
  lock: Encrypted;
}

interface VaultContext {
  vaultState: VaultState;
  setVaultState: SetVaultState;
  key: CryptoKey | null;
  setKey: SetKey;
}

export interface UseVault {
  vaultState: VaultState;
  fetchVault: FetchVault;
  createVault: CreateVault;
  unlockVault: UnlockVault;
  lockVault: LockVault;
  getPassword: GetPassword;
  putPhrase: PutPhrase;
  editPhrase: EditPhrase;
  removePhrase: RemovePhrase;
  destroyVault: DestroyVault;
  VaultContextProvider: DefaultContextProvider;
}

// Errors

export class VaultError extends Error {
}

export class VaultAlreadyExistsError extends VaultError {
}

export class VaultNotFoundError extends VaultError {
}

export class InvalidPinError extends VaultError {
}

export class VaultLockedError extends VaultError {
}

export class PhraseDuplicationError extends VaultError {
}

// Constants

const VAULT_STORAGE_KEY = 'v';

const SIGNATURE = 'signature';

const DEFAULT_CONTEXT_VALUE: VaultContext = {
  vaultState: 'locked',
  setVaultState: stubMethod,
  key: null,
  setKey: stubMethod,
};

// Contexts

const VaultContext = createContext<VaultContext>(DEFAULT_CONTEXT_VALUE);
VaultContext.displayName = 'VaultContext';

// Components

const VaultContextProvider: DefaultContextProvider = ({ children }) => {
  const [vaultState, setVaultState] = useState<VaultState>('none');
  const [key, setKey] = useState<CryptoKey | null>(null);
  const { fetchVault } = useVault();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    fetchVault().then(v => v ? 'locked' : 'not_created').then(setVaultState).catch(handleError);
  }, [fetchVault, handleError]);

  const value = useMemo(() => {
    return { vaultState, setVaultState, key, setKey };
  }, [vaultState, setVaultState, key, setKey]);

  const renderContent = useCallback(() => {
    if (vaultState === 'not_created') return (<CreateVaultPage />);
    if (vaultState === 'locked') return (<UnlockVaultPage />);
    if (vaultState === 'none') return (<UnlockVaultPage />);
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
  const { vaultState, setVaultState, key, setKey } = use(VaultContext);
  const { generateId, generateSalt, generateKey, encrypt, decrypt } = useCrypto();
  const { getItems, saveItems, removeItems } = useStorage();
  const { phrases, savePhrase, editPhrase, removePhrase, removeAllPhrases } = usePhrases();


  const fetchVault: FetchVault = useCallback(async () => {
    const items = await getItems([VAULT_STORAGE_KEY]);
    return items[VAULT_STORAGE_KEY] as Vault;
  }, [getItems]);

  const createVault: CreateVault = useCallback(async (pin) => {
    if (await fetchVault()) throw new VaultAlreadyExistsError();

    const id = generateId();
    const salt = generateSalt();
    const key = await generateKey(encode(pin), salt);
    const lock = await encrypt(key, encode(id));
    await saveItems({ [VAULT_STORAGE_KEY]: { id, salt, lock } });

    setVaultState('locked');
  }, [fetchVault, generateId, generateSalt, generateKey, encrypt, saveItems, setVaultState]);

  const unlockVault: UnlockVault = useCallback(async (pin) => {
    const vault = await fetchVault();

    if (!vault) throw new VaultNotFoundError();

    const lock = vault.id;
    const key = await generateKey(encode(pin), vault.salt);
    const decryptedLock = decode(await decrypt(key, vault.lock).catch(() => encode('invalid-pin')));
    if (lock !== decryptedLock) throw new InvalidPinError();

    setKey(key);
    setVaultState('unlocked');
  }, [fetchVault, generateKey, decrypt, setKey, setVaultState]);

  const lockVault: LockVault = useCallback(() => {
    setKey(null);
    setVaultState('locked');
  }, [setKey, setVaultState]);

  const getPassword: GetPassword = useCallback(async (encrypted, phraseKey) => {
    if (!key) throw new VaultLockedError();

    const phrase = await decrypt(key, encrypted);
    const pwd = await generatePwd(phrase, encode(phraseKey));

    erase(phrase);

    return decode(pwd);
  }, [key, decrypt]);

  const putPhrase: PutPhrase = useCallback(async (label, phrase) => {
    if (!key) throw new VaultLockedError();

    const encryptedPhrase = await encrypt(key, encode(phrase));
    const signature = await getPassword(encryptedPhrase, SIGNATURE);

    if (phrases.find(p => p.signature === signature)) {
      throw new PhraseDuplicationError();
    }

    return await savePhrase({
      label,
      signature,
      phrase: encryptedPhrase,
    });
  }, [key, phrases, encrypt, getPassword, savePhrase]);

  const destroyVault: DestroyVault = useCallback(async () => {
    await removeItems([VAULT_STORAGE_KEY]);
    await removeAllPhrases();
    setVaultState('not_created');
  }, [removeItems, removeAllPhrases, setVaultState]);


  return {
    vaultState,
    fetchVault,
    createVault,
    unlockVault,
    lockVault,
    getPassword,
    putPhrase,
    editPhrase,
    removePhrase,
    destroyVault,
    VaultContextProvider,
  };
};
