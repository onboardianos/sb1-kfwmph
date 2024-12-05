import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

export const aliases = {
  '@': path.resolve(__dirname, '../src'),
  '@context': path.resolve(__dirname, '../src/context'),
  '@assets': path.resolve(__dirname, '../src/assets'),
  '@theme': path.resolve(__dirname, '../src/theme'),
  '@services': path.resolve(__dirname, '../src/services'),
  '@pages': path.resolve(__dirname, '../src/pages'),
  '@common': path.resolve(__dirname, '../src/common'),
  '@utils': path.resolve(__dirname, '../src/utils')
}