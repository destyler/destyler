import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const comboboxComponentName = [
  'ComboboxAnchor',
  'ComboboxArrow',
  'ComboboxCancel',
  'ComboboxContent',
  'ComboboxEmpty',
  'ComboboxGroup',
  'ComboboxInput',
  'ComboboxItem',
  'ComboboxItemIndicator',
  'ComboboxLabel',
  'ComboboxPortal',
  'ComboboxRoot',
  'ComboboxSeparator',
  'ComboboxTrigger',
  'ComboboxViewport',
]

export function ComboboxResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (comboboxComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
