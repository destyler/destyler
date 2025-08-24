import { presetDestyler } from 'starlight-theme-destyler/unocss'
import { defineConfig, presetWind3 } from 'unocss'

export default defineConfig({
  presets: [
    presetWind3(),
    presetDestyler() as any,
  ],
  safelist:[
    
  ]
})
