import { createContext, use, useCallback, useEffect, useMemo, useState } from "react";

import { DefaultContextProvider } from "Utils/types";

// Types

export interface UseGlobalDimensions {
  width: number;
  height: number;
  top: number;
  left: number;
  GlobalDimensionsContextProvider: DefaultContextProvider;
}

interface GlobalDimensionsContext {
  width: number;
  height: number;
  top: number;
  left: number;
}

// Constants

const ROOT_ID = 'root';
const globalDimensionsContextDefault: GlobalDimensionsContext = {
  width: 300,
  height: 425,
  top: 0,
  left: 0,
}

// Contexts

const GlobalDimensionsContext = createContext<GlobalDimensionsContext>(globalDimensionsContextDefault);
GlobalDimensionsContext.displayName = 'GlobalDimensionsContext';

// Components

const GlobalDimensionsContextProvider: DefaultContextProvider = ({ children }) => {
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [top, setTop] = useState<number>(0);
  const [left, setLeft] = useState<number>(0);


  const updateDimensions = useCallback(() => {
    const rect = document.getElementById(ROOT_ID)?.getBoundingClientRect();

    setWidth(rect?.width ?? 0);
    setHeight(rect?.height ?? 0);
    setTop(rect?.top ?? 0);
    setLeft(rect?.left ?? 0);
  }, [])

  useEffect(() => {
    updateDimensions();
  }, [updateDimensions]);

  useEffect(() => {
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, [updateDimensions]);

  const value = useMemo(() => {
    return { width, height, top, left }
  }, [height, left, top, width]);


  return (
      <GlobalDimensionsContext value={value}>
        {children}
      </GlobalDimensionsContext>
  )
};

// Hooks

export const useGlobalDimensions = (): UseGlobalDimensions => {
  const { width, height, top, left } = use(GlobalDimensionsContext);

  return { width, height, top, left, GlobalDimensionsContextProvider }
};