import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const toolbarComponentName = [
  'ToolbarRoot',
  'ToolbarButton',
  'ToolbarLink',
  'ToolbarSeparator',
  'ToolbarToggleGroup',
  'ToolbarToggleItem',
]

export function ToolbarResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (toolbarComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
