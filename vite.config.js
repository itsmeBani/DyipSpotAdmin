import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fixReactVirtualized from 'esbuild-plugin-react-virtualized'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    esbuildOptions: {
      plugins: [fixReactVirtualized],
    },
  },
  build: {
    outDir: 'dist',  // The folder where your build files will be output
    minify: 'esbuild',  // Minify the build for smaller file sizes
    sourcemap: false,  // Disable sourcemaps in production (optional)
  },
  base: './'
})
