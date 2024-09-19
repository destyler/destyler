import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const imageComponentName = [
  'ImageRoot',
  'Image',
  'ImageFallback',
]

export function ImageResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (imageComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
