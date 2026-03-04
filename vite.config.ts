import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { tanstackRouter } from '@tanstack/router-plugin/vite'
import tailwindcss from '@tailwindcss/vite'
import path from "path"
import { copyFileSync } from 'fs'

// Plugin to copy .htaccess to dist folder
// const copyHtaccessPlugin = () => {
//   return {
//     name: 'copy-htaccess',
//     writeBundle() {
//       const src = path.resolve(__dirname, '.htaccess')
//       const dest = path.resolve(__dirname, 'dist', '.htaccess')
//       try {
//         copyFileSync(src, dest)
//         console.log('✓ Copied .htaccess to dist folder')
//       } catch (error) {
//         console.warn('⚠ Could not copy .htaccess:', error)
//       }
//     },
//   }
// }

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tanstackRouter({
      target: 'react',
      autoCodeSplitting: true,
      enableRouteGeneration: true,
    }),
    tailwindcss(),
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "./src"),
      '@assets': path.resolve(__dirname, "./src/assets"),
      '@images': path.resolve(__dirname, "./src/assets/images"),
      '@styles': path.resolve(__dirname, "./src/assets/css"),
      '@animations': path.resolve(__dirname, "./src/assets/animations"),
      '@components': path.resolve(__dirname, "./src/components"),
      '@hooks': path.resolve(__dirname, "./src/hooks"),
      '@context': path.resolve(__dirname, "./src/context"),
      '@providers': path.resolve(__dirname, "./src/providers"),
      '@store': path.resolve(__dirname, "./src/store"),
      '@routes': path.resolve(__dirname, "./src/routes"),
      '@utils': path.resolve(__dirname, "./src/utils"),
      '@lang': path.resolve(__dirname, "./src/lang"),
      '@public': path.resolve(__dirname, "./public"),
      '@auth': path.resolve(__dirname, "./src/auth"),
      '@api': path.resolve(__dirname, "./src/api"),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    outDir: "dist",
    rollupOptions: {
      output: {
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]',
      },
    },
  },
  server: {
    port: 7000,
    host: true,
  },
  preview: {
    port: Number(process.env.PORT) || 7000,
    host: true,
  }
})
