import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const scrollAreaComponentName = [
  'ScrollAreaCorner',
  'ScrollAreaRoot',
  'ScrollAreaScrollbar',
  'ScrollAreaThumb',
  'ScrollAreaViewport',
]

export function ScrollAreaResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (scrollAreaComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
