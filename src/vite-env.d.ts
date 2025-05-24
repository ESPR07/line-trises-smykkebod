/// <reference types="vite/client" />

declare namespace NodeJS{
  interface ProcessEnv {
    SUPABASE_URL : string,
    SUPABASE_KEY: string
  }
}
