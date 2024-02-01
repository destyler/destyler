import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const popoverComponentName = [
  'DestylerPopoverArrow',
  'DestylerPopoverClose',
  'DestylerPopoverContent',
  'DestylerPopoverPortal',
  'DestylerPopoverRoot',
  'DestylerPopoverTrigger',
]

export function DestylerPopoverResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (popoverComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
