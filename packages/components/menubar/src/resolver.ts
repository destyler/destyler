import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const menubarComponentName = [
  'MenubarRoot',
  'MenubarTrigger',
  'MenubarPortal',
  'MenubarContent',
  'MenubarArrow',
  'MenubarItem',
  'MenubarGroup',
  'MenubarSeparator',
  'MenubarCheckboxItem',
  'MenubarItemIndicator',
  'MenubarLabel',
  'MenubarRadioGroup',
  'MenubarRadioItem',
  'MenubarSub',
  'MenubarSubContent',
  'MenubarSubTrigger',
  'MenubarMenu',
]

export function MenubarResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (menubarComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
