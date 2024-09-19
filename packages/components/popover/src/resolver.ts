import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const popoverComponentName = [
  'PopoverArrow',
  'PopoverClose',
  'PopoverContent',
  'PopoverPortal',
  'PopoverRoot',
  'PopoverTrigger',
]

export function PopoverResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (popoverComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
