import { useMemo } from 'react';

// Types

export type StorageItems = Record<string, unknown>;

export interface UseStorage {
  getKeys: () => Promise<string[]>;
  getItems: (keys: string[] | null) => Promise<StorageItems>;
  saveItems: (items: StorageItems) => Promise<void>;
  removeItems: (keys: string[]) => Promise<void>;
}

// Constants

const IS_CHROME_EXTENSION = import.meta.env.VITE_IS_CHROME_EXTENSION === 'true';

// Utils

const parseStringItem = (strItem: string | null): unknown => JSON.parse(strItem ?? 'null');

const localStorage = (): UseStorage => {
  const storage = window.localStorage;

  const getKeys = () => {
    const result: string[] = [];

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i);
      if (key) result.push(key);
    }

    return Promise.resolve(result);
  };

  const getItems = async (keys: string[] | null) => {
    const result: StorageItems = {};
    keys = keys ?? (await getKeys());

    keys.forEach((key) => (result[key] = parseStringItem(storage.getItem(key))));

    return Promise.resolve(result);
  };

  const saveItems = (items: StorageItems) => {
    Object.keys(items).forEach((key) => storage.setItem(key, JSON.stringify(items[key])));
    return Promise.resolve();
  };

  const removeItems = (keys: string[]) => {
    keys.forEach((key) => storage.removeItem(key));
    return Promise.resolve();
  };

  return { getKeys, getItems, saveItems, removeItems };
};

const extensionLocalStorage = (): UseStorage => {
  const storage = chrome.storage.local;

  const getKeys = () => storage.getKeys();

  const getItems = (keys: string[] | null) => storage.get(keys);

  const saveItems = (items: StorageItems) => storage.set(items);

  const removeItems = (keys: string[]) => storage.remove(keys);

  return { getKeys, getItems, saveItems, removeItems };
};

// Hooks

export const useStorage = (): UseStorage => {
  const storage: UseStorage = useMemo(() => {
    return (IS_CHROME_EXTENSION ? extensionLocalStorage : localStorage)();
  }, []);

  return { ...storage };
};
