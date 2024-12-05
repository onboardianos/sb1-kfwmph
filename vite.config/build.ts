import { BuildOptions } from './types'
import { MANUAL_CHUNKS } from './constants'

export const getBuildConfig = (mode: string): BuildOptions => ({
  sourcemap: mode === 'development',
  rollupOptions: {
    output: {
      manualChunks: MANUAL_CHUNKS
    }
  },
  chunkSizeWarningLimit: 1000,
  minify: mode === 'production',
  target: 'esnext'
})