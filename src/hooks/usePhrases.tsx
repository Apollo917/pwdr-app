import { createContext, Dispatch, SetStateAction, use, useCallback, useEffect, useMemo, useState } from 'react';

import { useErrorHandler } from 'Hooks/useHandleError';
import { useStorage } from 'Hooks/useStrorage';
import { DefaultContextProvider } from 'Utils/types';
import { stubMethod } from 'Utils/utils';

import { Encrypted } from './useCrypto';

// Types

export type FetchPhrases = () => Promise<Phrase[]>;
export type SavePhrase = (phrase: Phrase) => Promise<Phrase>;
export type SavePhrases = (phrases: Phrase[]) => Promise<Phrase[]>;
export type EditPhrase = (phrase: Phrase, editData: EditPhraseData) => Promise<void>;
export type RemovePhrase = (phrase: Phrase) => Promise<void>;
export type RemoveAllPhrases = () => Promise<void>;

export interface Phrase {
  label: string;
  signature: string;
  phrase: Encrypted;
}

export interface EditPhraseData {
  label: string;
}

interface PhrasesContext {
  phrases: Phrase[];
  setPhrases: Dispatch<SetStateAction<Phrase[]>>;
}

export interface UsePhrases {
  phrases: Phrase[];
  fetchPhrases: FetchPhrases,
  savePhrase: SavePhrase;
  savePhrases: SavePhrases;
  editPhrase: EditPhrase;
  removePhrase: RemovePhrase;
  removeAllPhrases: RemoveAllPhrases;
  PhrasesContextProvider: DefaultContextProvider;
}

// Errors

export class PhraseNotFoundError extends Error {
}

// Constants

const PHRASE_STORAGE_KEY_PREFIX = 'p_';
const phrasesContextDefault: PhrasesContext = {
  phrases: [],
  setPhrases: stubMethod,
};

// Contexts

const PhrasesContext = createContext<PhrasesContext>(phrasesContextDefault);
PhrasesContext.displayName = 'PhrasesContext';

// Components

const PhrasesContextProvider: DefaultContextProvider = ({ children }) => {
  const [phrases, setPhrases] = useState<Phrase[]>([]);
  const { fetchPhrases } = usePhrases();
  const { handleError } = useErrorHandler();

  useEffect(() => {
    fetchPhrases().then(setPhrases).catch(handleError);
  }, [fetchPhrases, handleError]);

  const value = useMemo(() => {
    return { phrases, setPhrases };
  }, [phrases, setPhrases]);

  return (
      <PhrasesContext value={value}>
        {children}
      </PhrasesContext>
  );
};

// Utils

const generatePhraseStorageKey = (phrase: Phrase) => {
  return `${PHRASE_STORAGE_KEY_PREFIX}${btoa(phrase.signature)}`;
};

// Hooks

export const usePhrases = (): UsePhrases => {
  const { phrases, setPhrases } = use(PhrasesContext);
  const { getKeys, getItems, saveItems, removeItems } = useStorage();

  const getPhrasesKeys = useCallback(async () => {
    const storageKeys = await getKeys();
    return storageKeys.filter(k => k.startsWith(PHRASE_STORAGE_KEY_PREFIX));
  }, [getKeys]);

  const fetchPhrases: FetchPhrases = useCallback(async () => {
    const phrasesKeys = await getPhrasesKeys();
    const phrases = await getItems(phrasesKeys);
    const phrasesArr: Phrase[] = [];

    for (const key in phrases) {
      phrasesArr.push(phrases[key] as Phrase);
    }

    return phrasesArr;
  }, [getPhrasesKeys, getItems]);

  const savePhrase: SavePhrase = useCallback(async (phrase) => {
    await saveItems({ [generatePhraseStorageKey(phrase)]: phrase });
    setPhrases(p => [...p, phrase]);
    return phrase;
  }, [saveItems, setPhrases]);

  const savePhrases: SavePhrases = useCallback(async (phrases) => {
    const items = phrases.reduce((acc, p) => ({ ...acc, [generatePhraseStorageKey(p)]: p }), {});
    await saveItems(items);
    setPhrases(p => [...p, ...phrases]);
    return phrases;
  }, [saveItems, setPhrases]);

  const editPhrase: EditPhrase = useCallback(async (phrase, editData) => {
    const phraseToUpdate = phrases.find(p => p.signature === phrase.signature);

    if (!phraseToUpdate) throw new PhraseNotFoundError();

    const updatedPhrase = { ...phraseToUpdate, ...editData };

    await saveItems({ [generatePhraseStorageKey(updatedPhrase)]: updatedPhrase });
    setPhrases(phrases => phrases.map(p => p.signature === updatedPhrase.signature ? updatedPhrase : p));
  }, [phrases, saveItems, setPhrases]);

  const removePhrase: RemovePhrase = useCallback(async (phrase) => {
    await removeItems([generatePhraseStorageKey(phrase)]);
    setPhrases(pArr => pArr.filter(p => p.signature !== phrase.signature));
  }, [removeItems, setPhrases]);

  const removeAllPhrases: RemoveAllPhrases = useCallback(async () => {
    const keys = await getPhrasesKeys();
    await removeItems(keys);
    setPhrases([]);
  }, [getPhrasesKeys, removeItems, setPhrases]);


  return {
    phrases,
    fetchPhrases,
    savePhrase,
    savePhrases,
    editPhrase,
    removePhrase,
    removeAllPhrases,
    PhrasesContextProvider
  };
};
