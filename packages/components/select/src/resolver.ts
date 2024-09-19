import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const selectComponentName = [
  'SelectContent',
  'SelectGroup',
  'SelectIcon',
  'SelectItem',
  'SelectItemIndicator',
  'SelectItemText',
  'SelectLabel',
  'SelectPortal',
  'SelectRoot',
  'SelectScrollDownButton',
  'SelectScrollUpButton',
  'SelectSeparator',
  'SelectTrigger',
  'SelectValue',
  'SelectViewport',
]

export function SelectResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (selectComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
