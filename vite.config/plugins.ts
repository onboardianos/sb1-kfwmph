import react from '@vitejs/plugin-react'
import Unfonts from 'unplugin-fonts/vite'

export const plugins = [
  react({
    babel: {
      plugins: [
        ['@babel/plugin-transform-typescript', { allowDeclareFields: true }]
      ]
    }
  }),
  Unfonts({
    fontsource: {
      families: ['Montserrat']
    }
  })
]