/// <reference types="@vitest/browser/providers/playwright" />

import { defineConfig } from 'vitest/config'
import Vanilla from './vitest.browser.config'
// import React from './vitest.react.config'
// import Solid from './vitest.solid.config'
// import Svelte from './vitest.svelte.config'
import Utils from './vitest.utils.config'
// import Vue from './vitest.vue.config'

export default defineConfig({
  test: {
    projects: [
      Utils,
      // Vue,
      // React,
      // Svelte,
      // Solid,
      Vanilla,
    ],
  },
})
