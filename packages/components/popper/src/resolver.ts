import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const popperComponentName = [
  'DestylerPopperRoot',
  'DestylerPopperAnchor',
  'DestylerPopperContent',
  'DestylerPopperArrow',
]

export function DestylerPopperResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (popperComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
