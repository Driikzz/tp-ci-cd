import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import babel from 'vite-plugin-babel';


export default defineConfig({
  plugins: [
    tailwindcss(),
    babel(),
  ],
})