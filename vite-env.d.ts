/// <reference types="vite/client" />
/// <reference types="vite-plugin-pwa/react" />

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_PUSHER_KEY: string;
  readonly VITE_PUSHER_CLUSTER: string;
}

interface ImportMeta { readonly env: ImportMetaEnv }