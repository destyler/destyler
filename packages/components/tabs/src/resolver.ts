import type { ComponentResolver } from 'unplugin-vue-components'
import { name } from '../package.json'

const packageName = name

export const tabsComponentName = [
  'TabsContent',
  'TabsIndicator',
  'TabsList',
  'TabsRoot',
  'TabsTrigger',
]

export function TabsResolver(): ComponentResolver {
  return {
    type: 'component',
    resolve: (name: string) => {
      if (tabsComponentName.includes(name))
        return { name, from: packageName }
    },
  }
}
