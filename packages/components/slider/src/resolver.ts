import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const sliderComponentName = [
  'SliderRange',
  'SliderRoot',
  'SliderThumb',
  'SliderTrack',
]

export function SliderResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (sliderComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
