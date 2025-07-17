/// <reference types="@vitest/browser/providers/playwright" />

import { defineConfig } from 'vitest/config'
import React from './vitest.react.config'
import Utils from './vitest.utils.config'
import Vue from './vitest.vue.config'

export default defineConfig({
  test: {
    projects: [
      Utils,
      Vue,
      React,
    ],
  },
})
