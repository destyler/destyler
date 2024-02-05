import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const imageComponentName = [
  'DestylerImageRoot',
  'DestylerImage',
  'DestylerImageFallback',
]

export function DestylerImageResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (imageComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
