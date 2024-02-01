import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const sliderComponentName = [
  'DestylerSliderRange',
  'DestylerSliderRoot',
  'DestylerSliderThumb',
  'DestylerSliderTrack',
]

export function DestylerSliderResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (sliderComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
