/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_IS_CHROME_EXTENSION: string;
  readonly VITE_WORKSPACE_WIDTH: string;
  readonly VITE_WORKSPACE_HEIGHT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
