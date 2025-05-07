import { createContext, use, useCallback, useMemo, useState } from 'react';

import { DefaultContextProvider } from 'Utils/types';
import { stubMethod } from 'Utils/utils';

// Types

export type OverflowComponentArgs = unknown;

export type ComponentVisibilityTrigger = (args?: OverflowComponentArgs) => Promise<void>;

export interface ComponentVisibilityTriggers {
  show: ComponentVisibilityTrigger;
  hide: ComponentVisibilityTrigger;
}

type ComponentsRegistry = Record<string, ComponentVisibilityTriggers>;
type RegisterComponent = (name: string, triggers: ComponentVisibilityTriggers) => void;
type UnregisterComponent = (name: string) => void;
type ShowComponent = (name: string, args?: OverflowComponentArgs) => Promise<void>;
type HideComponent = ShowComponent
type AddComponentToRegistry = RegisterComponent;
type RemoveComponentFromRegistry = UnregisterComponent;

export interface UseOverflowComponent {
  registerComponent: RegisterComponent;
  unregisterComponent: UnregisterComponent;
  showComponent: ShowComponent;
  hideComponent: HideComponent;
  OverflowComponentContextProvider: DefaultContextProvider;
}

interface OverflowComponentContext {
  componentsRegistry: ComponentsRegistry;
  addComponentToRegistry: AddComponentToRegistry;
  removeComponentFromRegistry: RemoveComponentFromRegistry;
}


// Constants

const defaultOverflowComponentContext: OverflowComponentContext = {
  componentsRegistry: {},
  addComponentToRegistry: stubMethod,
  removeComponentFromRegistry: stubMethod,
};

// Contexts

const OverflowComponentContext = createContext<OverflowComponentContext>(defaultOverflowComponentContext);
OverflowComponentContext.displayName = 'OverflowComponentContext';

// Components

const OverflowComponentContextProvider: DefaultContextProvider = ({ children }) => {
  const [componentsRegistry, setComponentsRegistry] = useState<ComponentsRegistry>({});

  const addComponentToRegistry: AddComponentToRegistry = useCallback((name, triggers) => {
    setComponentsRegistry(registry => ({ ...registry, [name]: triggers }));
  }, []);

  const removeComponentFromRegistry: RemoveComponentFromRegistry = useCallback((name) => {
    setComponentsRegistry((registry) => {
      const res = { ...registry };
      delete res[name];
      return res;
    });
  }, []);


  const value = useMemo(() => {
    return { componentsRegistry, addComponentToRegistry, removeComponentFromRegistry };
  }, [componentsRegistry, addComponentToRegistry, removeComponentFromRegistry]);

  return (
    <OverflowComponentContext value={value}>
      {children}
    </OverflowComponentContext>
  );
};


// Hooks

export const useOverflowComponent = (): UseOverflowComponent => {
  const { componentsRegistry, addComponentToRegistry, removeComponentFromRegistry } = use(OverflowComponentContext);


  const showComponent: ShowComponent = useCallback((name, args) => {
    const triggers = componentsRegistry[name];

    if (triggers) return triggers.show(args);

    console.warn(`Cannot show Overflow component with the name "${name}. Component is not registered."`);
    return Promise.resolve();
  }, [componentsRegistry]);

  const hideComponent: HideComponent = useCallback((name, args) => {
    const triggers = componentsRegistry[name];

    if (triggers) return triggers.hide(args);

    console.warn(`Cannot hide Overflow component with the name "${name}. Component is not registered."`);
    return Promise.resolve();
  }, [componentsRegistry]);


  return {
    registerComponent: addComponentToRegistry,
    unregisterComponent: removeComponentFromRegistry,
    showComponent,
    hideComponent,
    OverflowComponentContextProvider,
  };
};