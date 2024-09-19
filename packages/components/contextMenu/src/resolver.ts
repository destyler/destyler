import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const contextMenuComponentName = [
  'ContextMenuArrow',
  'ContextMenuCheckboxItem',
  'ContextMenuContent',
  'ContextMenuGroup',
  'ContextMenuItem',
  'ContextMenuItemIndicator',
  'ContextMenuLabel',
  'ContextMenuPortal',
  'ContextMenuRadioGroup',
  'ContextMenuRadioItem',
  'ContextMenuRoot',
  'ContextMenuSeparator',
  'ContextMenuSub',
  'ContextMenuSubContent',
  'ContextMenuSubTrigger',
  'ContextMenuTrigger',
]

export function ContextMenuResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (contextMenuComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
