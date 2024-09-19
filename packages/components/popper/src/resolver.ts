import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const popperComponentName = [
  'PopperRoot',
  'PopperAnchor',
  'PopperContent',
  'PopperArrow',
]

export function PopperResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (popperComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
