import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const splitterComponentName = [
  'SplitterResizeHandle',
  'SplitterGroup',
  'SplitterPanel',
  'SplitterRoot',
]

export function SplitterResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (splitterComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
