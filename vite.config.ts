import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import mkcert from 'vite-plugin-mkcert';
import { VitePWA } from 'vite-plugin-pwa';
import svgr from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    host: '0.0.0.0',
  },
  plugins: [
    svgr(),
    react(),
    mkcert(),
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'mask-icon.svg'],
      outDir: 'dist',
      manifest: {
        name: 'Life Calendar',
        short_name: 'LC',
        description: 'Calendar for your all life',
        display: 'fullscreen',
        start_url: '/',
        scope: '/',
        background_color: '#000000',
        theme_color: '#000',
        lang: 'en',
        icons: [
          {
            src: 'images/pwa-64x64.png',
            sizes: '64x64',
            type: 'image/png',
          },
          {
            src: 'images/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'images/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: 'images/maskable-icon-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
        screenshots: [
          {
            src: 'images/desktop-screenshot.png',
            sizes: '1920x1080',
            type: 'image/png',
            form_factor: 'wide',
          },
          {
            src: 'images/mobile-screenshot.png',
            sizes: '375x812',
            type: 'image/png',
          },
          {
            src: 'images/mobile-screenshot-2.png',
            sizes: '375x812',
            type: 'image/png',
          },
          {
            src: 'images/mobile-screenshot-3.png',
            sizes: '375x812',
            type: 'image/png',
          },
          {
            src: 'images/mobile-screenshot-ru.png',
            sizes: '375x812',
            type: 'image/png',
            // @ts-expect-error lang is valid in manifest spec
            lang: 'ru',
          },
          {
            src: 'images/mobile-screenshot-ru-2.png',
            sizes: '375x812',
            type: 'image/png',
            // @ts-expect-error lang is valid in manifest spec
            lang: 'ru',
          },
          {
            src: 'images/mobile-screenshot-ru-3.png',
            sizes: '375x812',
            type: 'image/png',
            // @ts-expect-error lang is valid in manifest spec
            lang: 'ru',
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});
