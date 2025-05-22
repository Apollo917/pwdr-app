import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";

import { useErrorHandler } from "Hooks/useHandleError";
import { useStorage } from "Hooks/useStrorage";
import { DefaultContextProvider } from "Utils/types";
import { stubMethod } from "Utils/utils";

// Types

export type SettingsProp = 'defaultPwdLength';

interface Settings extends Record<SettingsProp, unknown> {
  defaultPwdLength: number;
}

type FetchSettings = () => Promise<Settings>;
type UpdateSettings = (settings: Settings) => Promise<void>;
type SetSettings = (settings: Settings) => void;

interface SettingsContext {
  settings: Settings;
  setSettings: SetSettings;
}

export interface UseSettings {
  settings: Settings;
  fetchSettings: FetchSettings;
  updateSettings: UpdateSettings;
  SettingsContextProvider: DefaultContextProvider;
}

// Constants

const SETTINGS_STORAGE_KEY = "s";

const defaultSettings: Settings = {
  defaultPwdLength: 32,
};
const defaultSettingsContext: SettingsContext = {
  settings: defaultSettings,
  setSettings: stubMethod
};

// Contexts

const SettingsContext = createContext<SettingsContext>(defaultSettingsContext);
SettingsContext.displayName = 'SettingsContext';

// Components

const SettingsContextProvider: DefaultContextProvider = ({ children }) => {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const { fetchSettings } = useSettings();
  const { handleError } = useErrorHandler();


  useEffect(() => {
    fetchSettings().then(setSettings).catch(handleError);
  }, [fetchSettings, handleError]);

  const value = useMemo(() => {
    return {
      settings,
      setSettings
    }
  }, [settings]);


  return (
      <SettingsContext value={value}>
        {children}
      </SettingsContext>
  );
}

// Hooks

export const useSettings = (): UseSettings => {
  const { settings, setSettings } = use(SettingsContext);
  const { getItems, saveItems } = useStorage();


  const fetchSettings: FetchSettings = useCallback(async () => {
    const settings = await getItems([SETTINGS_STORAGE_KEY]).then(i => i[SETTINGS_STORAGE_KEY]) as Settings;
    return Promise.resolve(settings ?? defaultSettings);
  }, [getItems]);

  const updateSettings: UpdateSettings = useCallback(async (settings) => {
    await saveItems({ [SETTINGS_STORAGE_KEY]: settings });
    setSettings(settings);
  }, [saveItems, setSettings]);


  return { settings, fetchSettings, updateSettings, SettingsContextProvider };
}
