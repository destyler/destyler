import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const menuComponentName = [
  'MenuAnchor',
  'MenuArrow',
  'MenuCheckboxItem',
  'MenuContent',
  'MenuGroup',
  'MenuItem',
  'MenuItemIndicator',
  'MenuLabel',
  'MenuPortal',
  'MenuRadioGroup',
  'MenuRadioItem',
  'MenuRoot',
  'MenuSeparator',
  'MenuSub',
  'MenuSubContent',
  'MenuSubTrigger',
]

export function MenuResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (menuComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
