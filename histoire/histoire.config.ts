import path from 'node:path'
import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
  plugins: [
    HstVue(),
  ],
  setupFile: './style.css',
  storyMatch: [
    path.resolve(__dirname, '../packages/components/*/.story/**.story.vue'),
  ],
  tree: {
    groups: [
      { title: 'Components', include: _file => true },
    ],
  },
  theme: {
    title: 'Destyler',
    logo: {
      square: '../docs/public/logo.svg',
      light: '../docs/public/logo.svg',
      dark: '../docs/public/logo.svg',
    },
  },
  vite: {
    server: {
      port: 53403,
    },
  },
})
