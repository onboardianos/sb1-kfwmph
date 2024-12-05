import { UserConfig } from 'vite'

export interface BuildOptions {
  sourcemap: boolean
  minify: boolean
  target: 'esnext'
  chunkSizeWarningLimit: number
  rollupOptions: {
    output: {
      manualChunks: Record<string, string[]>
    }
  }
}

export interface ServerOptions {
  port: number
  open: boolean
  headers: {
    'Cross-Origin-Embedder-Policy': string
    'Cross-Origin-Opener-Policy': string
  }
}

export interface ViteEnv {
  VITE_API_URL: string
  VITE_MEDIA_URL: string
  VITE_STREAMIO: string
  VITE_AWSCONFIG_IDENTITY_POOL_ID: string
  VITE_AWSCONFIG_REGION: string
  VITE_AWSCONFIG_USER_POOL_ID: string
  VITE_AWSCONFIG_USER_POOL_WEB_ID: string
  VITE_AWSCONFIG_MANDATORY_SIGN_IN: string
  VITE_AWSPINPOINT_APP_ID: string
  VITE_AWSPINPONT_REGION: string
  VITE_AWSPN_APP_ID: string
  VITE_AWSPN_REGION: string
  VITE_NEXTAUTH_SECRET: string
  VITE_AMITY_API_KEY?: string
}

export type ViteConfigOptions = {
  mode: string
  env: ViteEnv
}

export type ViteConfigFn = (options: ViteConfigOptions) => UserConfig