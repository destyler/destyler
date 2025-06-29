/// <reference types="@vitest/browser/providers/playwright" />

import { svelte } from '@sveltejs/vite-plugin-svelte'
import React from '@vitejs/plugin-react'
import Vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: 'node',
          environment: 'node',
          include: [
            'packages/**/*.test.{js,ts,jsx,tsx}',
          ],
        },
      },
      {
        plugins: [
          Vue(),
          svelte(),
          React(),
        ],
        test: {
          name: 'browser',
          browser: {
            enabled: true,
            provider: 'playwright',
            instances: [
              { browser: 'chromium', name: 'browser-chromium' },
              { browser: 'firefox', name: 'browser-firefox' },
              { browser: 'webkit', name: 'browser-webkit' },
            ],
          },
          setupFiles: [
            './vitest.browser.setup.ts',
          ],
          exclude: [
            'packages/**/*.solid.browser.spec.{js,ts,jsx,tsx}',
          ],
          include: [

            'packages/**/*.react.browser.spec.{js,ts,jsx,tsx}',
            'packages/**/*.svelte.browser.spec.{js,ts,jsx,tsx}',
            'packages/**/*.vue.browser.spec.{js,ts,jsx,tsx}',
          ],
        },
      },
    ],
  },
})
