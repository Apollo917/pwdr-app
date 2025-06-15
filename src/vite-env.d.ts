/// <reference types="vite/client" />

interface ImportMetaEnv {

  // General
  readonly VITE_APP_WIDTH: string;
  readonly VITE_APP_HEIGHT: string;

  // Chrome Extension
  readonly VITE_IS_CHROME_EXTENSION: string;

  // Telegram
  readonly VITE_IS_TELEGRAM_APP: string;
  readonly VITE_TELEGRAM_SCRIPT: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
