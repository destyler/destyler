import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const hoverCardComponentName = [
  'HoverCardArrow',
  'HoverCardContent',
  'HoverCardPortal',
  'HoverCardRoot',
  'HoverCardTrigger',
]

export function HoverCardResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (hoverCardComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
