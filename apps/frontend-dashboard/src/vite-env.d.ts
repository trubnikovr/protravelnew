/// <reference types="vite/client" />

interface Window {
  __PROTRAVEL_CONFIG__?: {
    apiUrl?: string;
  };
}

interface ImportMetaEnv {
  readonly VITE_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
