import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import Unfonts from 'unplugin-fonts/vite'
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from 'fs';
import path from 'path'

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// https://vitejs.dev/config/
export default defineConfig({
  optimizeDeps: {
    exclude: ['@ffmpeg/ffmpeg', '@ffmpeg/util'],
  },
  resolve:{
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    alias:{
      "@context": "/src/context",
      "@assets": "/src/assets",
      "@theme": "/src/theme",
      "@services": "/src/services",
      "@pages": "/src/pages",
      "@common": "/src/common",
      "@utils": "/src/utils",
    }
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    https: {
      key: fs.readFileSync(path.resolve(__dirname, 'local-certificates/local.onboardian.com-key.pem')),
      cert: fs.readFileSync(path.resolve(__dirname, 'local-certificates/local.onboardian.com.pem')),
    },
    // ...
  },
  plugins: [react(),
    Unfonts({
      fontsource:{
        families:[
          'Poppins'
        ]
      }
    })
  ],
})
