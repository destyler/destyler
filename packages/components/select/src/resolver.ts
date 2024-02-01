import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const selectComponentName = [
  'DestylerSelectContent',
  'DestylerSelectGroup',
  'DestylerSelectIcon',
  'DestylerSelectItem',
  'DestylerSelectItemIndicator',
  'DestylerSelectItemText',
  'DestylerSelectLabel',
  'DestylerSelectPortal',
  'DestylerSelectRoot',
  'DestylerSelectScrollDownButton',
  'DestylerSelectScrollUpButton',
  'DestylerSelectSeparator',
  'DestylerSelectTrigger',
  'DestylerSelectValue',
  'DestylerSelectViewport',
]

export function DestylerSelectResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (selectComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
