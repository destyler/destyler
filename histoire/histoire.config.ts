import path from 'node:path'
import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'

export default defineConfig({
  plugins: [
    HstVue(),
  ],
  storyMatch: [
    path.resolve(__dirname, '../packages/components/*/.story/**.story.vue'),
  ],
})
