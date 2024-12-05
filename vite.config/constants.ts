export const BREAKPOINTS = {
  xs: 0,
  sm: 600,
  md: 900,
  lg: 1200,
  xl: 1536,
  xxl: 1920
} as const

export const EXCLUDED_DEPS = ['@ffmpeg/ffmpeg', '@ffmpeg/util']

export const MANUAL_CHUNKS = {
  vendor: ['react', 'react-dom'],
  mui: ['@mui/material', '@mui/icons-material']
}

export const SECURITY_HEADERS = {
  'Cross-Origin-Embedder-Policy': 'require-corp',
  'Cross-Origin-Opener-Policy': 'same-origin'
}