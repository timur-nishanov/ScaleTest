/// <reference types="vite/client" />

interface ImportMetaEnv {
  /** URL приёмника аналитики (этап бэкенда); без него события копятся локально. */
  readonly VITE_ANALYTICS_URL?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
