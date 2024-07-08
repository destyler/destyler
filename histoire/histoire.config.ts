import path from 'node:path'
import { defineConfig } from 'histoire'
import { HstVue } from '@histoire/plugin-vue'


export default defineConfig({

  plugins: [
    HstVue(),
  ],
  theme: {
    title: 'Destyler'
  }
})
