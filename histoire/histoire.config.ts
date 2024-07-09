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
  vite: {
    server: {
      port: 53403,
    },
  },
})
